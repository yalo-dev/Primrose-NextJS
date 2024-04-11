import { gql } from '@apollo/client';
import { client } from '../../../app/lib/apollo';
import { GfForm } from "../../../generated/graphql";
import ScheduleATourForm from '../../../components/ScheduleATour/ScheduleTourForm';
import Head from "next/head";
import CalendlyEmbed from "../../../components/Calendly/CalendlyEmbed";
import DynamicRadioButtons from "../../../components/Calendly/DynamicRadioButtons";
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';

interface Props {
    form: GfForm;
}

export async function getServerSideProps(context) {
    const { schoolSlug } = context.params;

    const GET_THANKS_FIELDS = gql`
    query SchoolData($id: ID!) {
        school(id: $id, idType: URI) {
            id
            databaseId
            slug
            uri
            title
            seo{
                fullHead
            }
            schoolAdminSettings {
              instagramLink
              yelpLink
              googleLink
              facebookLink
              hoursOfOperation {
                openingTime
                closingTime
              }
              schedulerEventsOffered
            }
            schoolCorporateSettings {
              careerplugSchoolId
              address {
                city
                state
                zipcode
                streetAddress
                streetAddress2
              }
              phoneNumber
              scheduleATourMeta {
                description
                fieldGroupName
                title
              }
              usesCalendly
              procarePointerId
              calendlyEmbedUrls {
                calendlyVirtualTour
                calendlyInPersonTour
                calendlyIntroductionPhoneCall
              }
            }
        }
      }
    `;
    const response = await client.query({
        query: GET_THANKS_FIELDS,
        variables: { id: schoolSlug } 
    });

    const schoolData = response?.data?.school;
    const schoolSettings = schoolData.schoolAdminSettings || {};

    let customSeo = {fullHead: schoolData.seo.fullHead.replaceAll(`${schoolSlug}`, `${schoolSlug}/schedule-a-tour`).replaceAll(`<title>`, `<title>Contact Us | `)};

    return {
        props: {
            school: schoolData,
            customSeo,
            schoolTitle: schoolData?.title,
            schoolSlug: schoolData?.slug || '',
            corporate: schoolData?.schoolCorporateSettings || {}, 
            socialLinks: {
                facebook: schoolSettings?.facebookLink || '',
                instagram: schoolSettings?.instagramLink || ''
            },
            schoolHours: 'M-F ' + schoolSettings?.hoursOfOperation.openingTime + " - " + schoolSettings?.hoursOfOperation.closingTime || '',
            schedulerEvent: schoolSettings?.schedulerEventsOffered || '',
            calendlyURLs: {
                inPersonTour: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyInPersonTour || '',
                virtualTour: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyVirtualTour || '',
                introductionPhoneCall: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyIntroductionPhoneCall || '',
            },
            hiddenFields: {
                userAgent: context.req.headers['user-agent'],
                ipAddress: context.req.headers['x-forwarded-for'],
                referer: context.req.headers.referer || '',
                procare: schoolData?.schoolCorporateSettings.procarePointerId || '',
                schoolID: schoolData?.databaseId,
                schoolName: schoolData?.title,
                uri: schoolData?.uri,
                slug: schoolData?.slug,
                usesCalendly: schoolData?.schoolCorporateSettings.usesCalendly,
                calendlyURLs: {
                    inPersonTour: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyInPersonTour || '',
                    virtualTour: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyVirtualTour || '',
                    introductionPhoneCall: schoolData?.schoolCorporateSettings.calendlyEmbedUrls.calendlyIntroductionPhoneCall || '',
                },
                hasCalendlyEvent: schoolSettings?.schedulerEventsOffered || '',
            }
        },
    };
}

export const CalendlyContext = createContext(null)

export default function ScheduleATourPage({ schoolSlug, corporate, socialLinks, schoolHours, schoolTitle, hiddenFields, schedulerEvent, calendlyURLs }) {

    const metaTitle = corporate?.scheduleATourMeta?.title ?? `Contact us | Primrose School of ${schoolTitle}`
    const metaDesc = corporate?.scheduleATourMeta?.description
    const nonCalendlyDesc = "We’d love for your family to meet ours. Please fill out the form below and we’ll contact you about a tour."
    const calendlyDesc = "We’d love for your family to meet ours. Please fill out the form below and select your tour date and time."
    const formDescription = corporate.usesCalendly == true ? calendlyDesc : nonCalendlyDesc;
    const router = useRouter();
    const [calendlyEvent, setCalendlyEvent] = useState<string>('');
    const [isCalendlySelected, setCalendlySelected] = useState('false')
    const tourThanksSlug = '/schools/' + schoolSlug + '/tour-thanks/'


    useEffect(() => {
        let calendlySelected = document.getElementById('choice_13_13_Yes') as HTMLInputElement
        // console.log(calendlySelected.checked)
        //console.log(isCalendlySelected)
        handleCalendlySelect(schedulerEvent[0])
    }, [isCalendlySelected]);


    useEffect(()=>{
        window.addEventListener('message', function(e){
            if(e.data.event && e.data.event.indexOf('calendly') === 0){
                if(e.data.event === "calendly.event_scheduled"){
                    router.push(`/schools/${schoolSlug}/tour-thanks/`);
                }
            }
        });
    }, []);

    const handleCalendlySelect = (value) => {
        let firstNameField = document.getElementById('field_1') as HTMLInputElement
        let lastNameField = document.getElementById('field_3') as HTMLInputElement
        let emailField = document.getElementById('field_5_5') as HTMLInputElement
        let phoneField = document.getElementById('field_4') as HTMLInputElement

        let firstName = firstNameField != null ? firstNameField.value : '';
        let lastName = lastNameField != null ? lastNameField.value : '';
        let calendlyEmail = emailField != null ? emailField.value : '';
        let calendlyPhone = phoneField != null ? phoneField.value : '';
        let calendlyName = encodeURIComponent((firstName + ' ' + lastName).trim());

        let prefillParams = '?embed_domain=www.primroseschools.com&embed_type=Inline&hide_gdpr_banner=1&name=' + calendlyName + '&email=' + calendlyEmail;

        if (value == 'In-Person Tour') {
            setCalendlyEvent(calendlyURLs.inPersonTour + prefillParams);
        } else if (value == 'Virtual Tour') {
            setCalendlyEvent(calendlyURLs.virtualTour + prefillParams + '&location=1' + calendlyPhone);
        } else if (value == 'Introduction Phone Call') {
            setCalendlyEvent(calendlyURLs.introductionPhoneCall + prefillParams + '&location=1' + calendlyPhone);
        }
    };

    if (calendlyEvent == '' && schedulerEvent != '') {
        handleCalendlySelect(schedulerEvent[0])
    }

    return (
        <div className='school schedule-a-tour'>
            <Head>
              <title>{metaTitle}</title>
              {metaDesc && <meta name={"description"} content={metaDesc}/>}
            </Head>
            <div className="container">
                <div className="row">
                    <div className="main-wrapper col-12 col-lg-8">
                        <div className="form-wrapper">
                            <div className="heading-wrapper">
                                <h1 id='sat-heading' className='heading green'>Schedule A Tour</h1>
                                <p className="desc b3">{formDescription}</p>
                            </div>
                            <CalendlyContext.Provider value={{ isCalendlySelected, setCalendlySelected }}>
                                <ScheduleATourForm {...hiddenFields} />
                            </CalendlyContext.Provider>
                            {corporate.usesCalendly &&
                                (calendlyURLs.inPersonTour != '' || calendlyURLs.virtualTour != '' || calendlyURLs.introductionPhoneCall != '') &&
                                (schedulerEvent != '') && (
                                <div id={'SAT-Calendly-Div'} className='calendly-widget hidden'>
                                    <DynamicRadioButtons skipURL={tourThanksSlug} options={schedulerEvent} onSelect={handleCalendlySelect}/>
                                    <CalendlyEmbed url={calendlyEvent} successUrl={tourThanksSlug} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="aside col-lg-3 offset-lg-1 d-none d-lg-flex flex-column">
                    {corporate && corporate.address && (
                        <div className="address b3 border-bottom pt-3 pb-3">
                            {corporate.address.streetAddress && <>{corporate.address.streetAddress}&nbsp;</>}
                            {corporate.address.streetAddress2 && <><br />{corporate.address.streetAddress2}</>}
                            {corporate.address.city && <><br />{corporate.address.city},&nbsp;</>}
                            {corporate.address.state && <>{corporate.address.state}<br /></>}
                            {corporate.address.zipcode && <>{corporate.address.zipcode}</>}
                        </div>
                    )}
                        {schoolHours && (
                            <div className="hours border-bottom pt-3 pb-3">

                                <div className='b3' dangerouslySetInnerHTML={{ __html: schoolHours }}></div>

                            </div>
                        )}
                        {corporate && corporate.phoneNumber && (
                            <div className="phone pt-3 pb-3">

                                <p className='b3'>{corporate.phoneNumber}</p>

                            </div>
                        )}
                        <div className="social">
                            <div className="h5 green">
                                Connect with Us
                            </div>
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} className="fb" target="_blank" rel="noopener noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
                                        <path d="M45 30.9418C45 22.6066 38.2846 15.85 30.0019 15.85C21.7154 15.8519 15 22.6066 15 30.9437C15 38.4746 20.4856 44.7176 27.6547 45.85V35.3044H23.8489V30.9437H27.6584V27.616C27.6584 23.8346 29.8988 21.7461 33.324 21.7461C34.9663 21.7461 36.6817 22.0405 36.6817 22.0405V25.7525H34.79C32.9284 25.7525 32.3472 26.9167 32.3472 28.1109V30.9418H36.5054L35.8418 35.3025H32.3453V45.8481C39.5144 44.7157 45 38.4728 45 30.9418Z" fill="black" />
                                    </svg>
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} className="ig" target="_blank" rel="noopener noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M36.7368 15.85H23.2848C18.7166 15.85 15 19.564 15 24.1289V37.5711C15 42.1361 18.7166 45.85 23.2848 45.85H36.7368C41.3054 45.85 45.0219 42.136 45.0219 37.5711V24.1289C45.0221 19.564 41.3054 15.85 36.7368 15.85ZM42.3584 37.5711C42.3584 40.6684 39.8366 43.1882 36.737 43.1882H23.2848C20.1853 43.1884 17.6637 40.6684 17.6637 37.5711V24.1289C17.6637 21.0317 20.1853 18.5117 23.2848 18.5117H36.7368C39.8364 18.5117 42.3583 21.0317 42.3583 24.1289V37.5711H42.3584ZM30.0141 23.1203C25.7484 23.1203 22.2782 26.588 22.2782 30.8505C22.2782 35.1129 25.7484 38.5804 30.0141 38.5804C34.2797 38.5804 37.75 35.1129 37.75 30.8505C37.75 26.588 34.2797 23.1203 30.0141 23.1203ZM30.0141 35.9185C27.2174 35.9185 24.9419 33.645 24.9419 30.8504C24.9419 28.0555 27.2172 25.7819 30.0141 25.7819C32.811 25.7819 35.0863 28.0555 35.0863 30.8504C35.0863 33.645 32.8108 35.9185 30.0141 35.9185ZM36.6956 21.4353C37.058 21.0715 37.5622 20.8639 38.0754 20.8639C38.5904 20.8639 39.0947 21.0715 39.4569 21.4353C39.821 21.7973 40.0288 22.3013 40.0288 22.8159C40.0288 23.3287 39.821 23.8327 39.4569 24.1964C39.0929 24.5584 38.5904 24.7678 38.0754 24.7678C37.5622 24.7678 37.0578 24.5584 36.6956 24.1964C36.3315 23.8327 36.122 23.3289 36.122 22.8159C36.122 22.3013 36.3314 21.7973 36.6956 21.4353Z" fill="black" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
