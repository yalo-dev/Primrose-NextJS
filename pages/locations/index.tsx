import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Heading from '../../app/components/atoms/Heading/Heading';
import Button from '../../app/components/atoms/Button/Button';
import SelectDropdown from '../../app/components/molecules/SelectDropdown/SelectDropdown';


const slugify = require('slugify');

export async function getStaticProps() {
    try {
        const SCHOOLS_QUERY = gql`
        query GetSchools {
            schools(first: 1000) {
                nodes {
                  markets {
                    nodes {
                      slug
                      name
                    }
                  }
                  uri
                  title
                  schoolCorporateSettings {
                    schoolOfAtOn
                    schoolName
                  }
                }
              }
          }`;

        const MARKETS_QUERY = gql`
        query GetMarketsTerms {
            markets(first: 500) {
                nodes {
                  markets {
                    marketState
                  }
                  name
                  slug
                }
              }
        }`;

        const [schoolsData, marketsData] = await Promise.all([
            client.query({ query: SCHOOLS_QUERY }),
            client.query({ query: MARKETS_QUERY })
        ]);

        return {
            props: {
                markets: marketsData.data.markets.nodes,
                schools: schoolsData.data.schools.nodes
            },
        };

    } catch (error) {
        console.error("Error fetching data", error);
        return {
            props: { markets: [], schools: []},
        };
    }
}

export default function Locations({ markets, schools }) {
    
        
    let schools_arr = [];
    schools.map((school, index) => {
       
        if(school.markets.nodes.length>0){
            schools_arr[school.markets.nodes[0].name] = school;
        }
       
    
    }
    
    );
    
    //console.log(schools_arr);
    let statesOptions = [];
    let states = [];
    //map states options, one per state
    markets.map((market, index) => {
        
        if(!states.includes(market.markets.marketState) && market.markets.marketState !== null){
            states.push(market.markets.marketState);
            
        }
    });
    states.sort();
    states.map((state, index) => {
    
        let stateSlug = slugify(`${state}`, {lower:true});
        let obj = {label: state, value: state, url: `#${stateSlug}`, target:'_self'};
        statesOptions.push(obj);
    
    });
    
    
    return (
        <>
            <div className='container-fluid bg-gray heading'>
                <div className='row py-5 '>
                    <div className='col-12 text-center'>
                        <h1>All Locations</h1>
                        <SelectDropdown
                          options={statesOptions}
                          placeholder="States"
                          returnFullOption={false}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

