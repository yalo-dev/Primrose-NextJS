import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Heading from '../../app/components/atoms/Heading/Heading';
import Button from '../../app/components/atoms/Button/Button';
import SelectDropdown from '../../app/components/molecules/SelectDropdown/SelectDropdown';
import bootstrap from 'bootstrap';
import Script from 'next/script';
import { Http2ServerResponse } from 'http2';
import $ from 'jquery';

const slugify = require('slugify');

export async function getStaticProps() {
    try {
        const SCHOOLS_QUERY = gql`
        query GetSchools {
            schools(first: 1000, where: {orderby: {field: TITLE, order: ASC}}) {
                nodes {
                  markets {
                    nodes {
                      slug
                      name
                      markets{
                        marketState
                      }
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
                  uri
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
    const handleStateFilter = (state:string) => {
        let state_section = document.getElementById(slugify(state, {lower:true}) + "_section");
        let sections = document.getElementsByClassName('state_section');
        $(sections).hide();
        $(state_section).show();
      };
        
    let schools_arr = [];
    schools.map((school, index) => {
       
        if(school.markets.nodes.length>0){
            if(!schools_arr[school.markets.nodes[0].name]){
                
                schools_arr[school.markets.nodes[0].name] = new Array();
            }
            schools_arr[school.markets.nodes[0].name].push(school);
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
            <Script strategy="beforeInteractive" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
            <div className='container-fluid bg-gray heading py-5'>
                <div className='row py-5 '>
                    <div className='col-12 text-center'>
                        <h1>All Locations</h1>
                        <SelectDropdown
                          options={statesOptions}
                          placeholder="All States"
                          onSelect={handleStateFilter}
                          returnFullOption={false}
                        />
                    </div>
                </div>
            </div>
            <div className='container locations py-5'>

                <div className='row py-md-5 py-0'>

                    {states.map((state, i) => (
                        <>
                        <div id={slugify(state, {lower:true}) + "_section"} className="state_section">
                        <span className="subheading" key={i}>{state}</span>
                        <div className="accordion accordion-flush" id={slugify(state, {lower:true})}>
                        {markets.map((market, index) => market.markets.marketState == state && (
                            <>
                            
                                <div className="accordion-item">

                                    <h2 className="accordion-header" id={'heading'+index}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="false" aria-controls={"collapse" + index}>
                                        <h5 style={{ whiteSpace: 'normal' }}>{market.name}</h5>
                                        </button>
                                    </h2>
                                    <div id={"collapse" + index} className="accordion-collapse collapse" data-bs-parent={"#" + slugify(state, {lower:true})}>
                                        <div className="accordion-body">
                                            <div className="schools">
                                        {schools_arr[market.name] && schools_arr[market.name].sort() && schools_arr[market.name].map((school, index) => (
                                            <>
                                            <a className="school" href={school.uri}>{"Primrose School " + school.schoolCorporateSettings.schoolOfAtOn + " " + school.title}</a>
                                            </>
                                        ))}
                                            </div>
                                        <a className="link" href={market.uri}>Learn more about schools in this area</a>
                                        </div>
                                    </div>

                                </div>
                            
                            </>

                        ))}
                        </div>
                        </div>
                        </>
                        
                       
                    )
                        )
                    }

                </div>

            </div>
        </>
    );
}

