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
                    address {
                        state
                    }
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
    const handleStateFilter = (state: string) => {
        if (typeof state !== 'string' || state.trim() === '') {
            console.error('Invalid state value:', state);
            return;
        }
    
        let state_section = document.getElementById(slugify(state, {lower:true}) + "_section");
        let sections = document.getElementsByClassName('state_section');
        $(sections).hide();
        $(state_section).show();
    
        let dropdownToggle = document.querySelector('.select-dropdown .dropdown-toggle');
        dropdownToggle.dispatchEvent(new Event('click'));
    };
    let abbr = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut", "DC":"District of Columbia", "DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}
    let schools_arr = [];
    console.log(schools);
    schools.map((school, index) => {
       
        for(let i=0; i<school.markets.nodes.length; i++){
            if(!schools_arr[school.markets.nodes[i].name]){
                
                schools_arr[school.markets.nodes[i].name] = new Array();
            }
            school.stateName = abbr[school.schoolCorporateSettings.address.state]
            schools_arr[school.markets.nodes[i].name].push(school);
        }
            
    }
    
    );
    
    //console.log(schools_arr);
    let statesOptions = [];
    let states = [];
    //map states options, one per state
    markets.map((market, index) => {
        if(market.markets.marketState !== null){
            market.markets.marketState.map((marketState)=>{
                //console.log(marketState);
                if(states.indexOf(marketState) == -1){
                    states.push(marketState);
                }
            })
            
            
        }
    });
    states.sort();
    states.map((state, index) => {
        let stateSlug = slugify(`${state}`, {lower:true});
        let obj = {label: state, value: state, url: `#${stateSlug}`, target:'_self'};
        statesOptions.push(obj);
    
    });

    const handleCollapse = (event) => {
        // this is a quick fix for the collapse/expand not working, ideally this would be handled within component state
        const collapsableGroup = document.querySelector(event.currentTarget.dataset.bsTarget)
        const collapsableClass = event.currentTarget.dataset.bsToggle
        if (Object.values(event.currentTarget.classList).includes('collapsed')) {
            event.currentTarget.classList.remove('collapsed')
            if (Object.values(collapsableGroup.classList).includes(collapsableClass)) {
                collapsableGroup.classList.remove(collapsableClass)
            }
        } else {
            event.currentTarget.classList.add('collapsed')
            if (!Object.values(collapsableGroup.classList).includes(collapsableClass)) {
                collapsableGroup.classList.add(collapsableClass)
            }
        }
    }
    
    
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
                        <div key={i}>
                        <div id={slugify(state, {lower:true}) + "_section"} className="state_section">
                        <span className="subheading" id={slugify(state, {lower:true})} key={i}>{state}</span>
                        <div className="accordion accordion-flush" >
                        {markets.map((market, index) => market.markets.marketState.includes(state) && (
                            <div key={index}>
                            
                                <div className="accordion-item">

                                    <h2 className="accordion-header" id={'heading' + i + "_" + index}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + i + "_" + index} aria-expanded="false" aria-controls={"collapse" + index} onClick={handleCollapse}>
                                        <h5 style={{ whiteSpace: 'normal' }}>{market.name}</h5>
                                        </button>
                                    </h2>
                                    <div id={"collapse" + i + "_" + index} className="accordion-collapse collapse" data-bs-parent={"#" + slugify(state, {lower:true})}>
                                        <div className="accordion-body">
                                            <div className="schools">
                                        {schools_arr[market.name] && schools_arr[market.name].sort() && schools_arr[market.name].map((school, index) => {
                                            if(school.stateName == state){
                                                return(
                                             <a className="school" key={index} href={school.uri}>{"Primrose School " + school.schoolCorporateSettings.schoolOfAtOn + " " + school.title}</a>
                                                )
                                                }
                                        })}
                                            </div>
                                        <a className="link" href={market.uri}>Learn more about schools in this area</a>
                                        </div>
                                    </div>

                                </div>
                            
                            </div>

                        ))}
                        </div>
                        </div>
                        </div>
                        
                       
                    )
                        )
                    }

                </div>

            </div>
        </>
    );
}

