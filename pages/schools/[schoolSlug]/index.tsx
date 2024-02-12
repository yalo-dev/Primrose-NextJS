import {client} from '../../../app/lib/apollo';
import {gql} from '@apollo/client';

import React, {useEffect, useRef, useState} from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GallerySlider from '../../../app/components/modules/GallerySlider/GallerySlider';
import EmergencyAlert from '../../../app/components/modules/EmergencyAlert/EmergencyAlert';
import HeroWithSlider from "../../../components/schools/HeroWithSlider";
import FirstFive from "../../../components/schools/FirstFive";
import SchoolNewsSlider from "../../../components/schools/SchoolNewsSlider";
import TestimonialSection from "../../../components/schools/TestimonialSection";
import ScheduleATourSlider from "../../../components/schools/ScheduleATourSlider";


export async function getServerSideProps(context) {
    const {schoolSlug} = context.params;

    const GET_SCHOOLS = gql`
    query GetSchoolDetails($id: ID!) {
        siteSettings {
          siteSettings {
            defaultStaffPhoto {
              altText
              mediaItemUrl
              sourceUrl
            }
          }
        }
        school(id: $id, idType: URI) {
          id
          slug
          uri
          schoolCorporateSettings {
              accreditations {
                ... on Accreditation {
                  id
                  title
                  accreditations {
                    image {
                      altText
                      mediaItemUrl
                    }
                  }
                }
              }
              address {
                streetAddress
                streetAddress2
                zipcode
                state
                city
                googlePlaceUrl
                latitude
                longitude
              }
              emailAddress
              phoneNumber
              preopening
              schoolName
              virtualTourUrl
              homepageHeroImage {
                altText
                mediaItemUrl
              }
              openingIn {
                season
                year
              }
              homepageSubheadline {
                description
                title
              }
              corporateChildcare
              careerplugSchoolId
            }
            schoolAdminSettings {
              accreditation {
                imageAlt
                image {
                  mediaItemUrl
                }
              }
              classroomsOffered
              displayEmergencyAlert
              emergencyMessage {
                message
                expirationDate
              }
              enrollingNow
              facebookLink
              instagramLink
              gallery {
                caption
                title
                imageAlt
                image {
                  mediaItemUrl
                  sourceUrl
                }
              }
              hiringNow
              hoursOfOperation {
                closingTime
                openingTime
              }
              satImages {
                image {
                  mediaItemUrl
                  sourceUrl
                }
                imageAlt
              }
              yelpLink
              newsItems {
                content
                expires
                newsImage {
                  imageAlt
                  image {
                    mediaItemUrl
                  }
                }
                publishDate
                shortDescription
                title
              }
              googleLink
              meetStaffImage{
                mediaItemUrl
              }
              testimonials {
                ... on Testimonial {
                  id
                  featuredImage {
                    node {
                      altText
                      mediaItemUrl
                      sourceUrl
                    }
                  }
                  title
                  testimonials {
                    title
                    testimonial
                    heading
                    name
                  }
                }
              }
            }
 
        }
      }
    `;
    try {
        const response = await client.query({
            query: GET_SCHOOLS,
            variables: {id: `/schools/${schoolSlug}/`},
            errorPolicy: "all"
        });

        console.log("School Data:", response.data.school);

        const school = response?.data?.school;
        if (!school) {
            return {notFound: true};
        }

        return {
            props: {
                school,
                schoolSlug,
            },
        };
    } catch (error) {
        console.error('getServerSideProps Error:', error);
        return {props: {hasError: true}};
    }
}

export default function SchoolMainPage({school, schoolSlug}) {
    const corporateSettings = school?.schoolCorporateSettings;
    const adminSettings = school?.schoolAdminSettings;
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className='school school-home'>
            <EmergencyAlert/>
            <HeroWithSlider corporateSettings={corporateSettings}
                            adminSettings={adminSettings} schoolSlug={schoolSlug}/>
            <FirstFive adminSettings={adminSettings}
                       corporateSettings={corporateSettings} schoolSlug={schoolSlug}/>
            <SchoolNewsSlider adminSettings={adminSettings} isClient={isClient} />
            <TestimonialSection adminSettings={adminSettings} />
            {adminSettings?.gallery?.length && <GallerySlider gallery={adminSettings.gallery} uniqueId="gallerySlider"/>}
            <ScheduleATourSlider adminSettings={adminSettings} schoolSlug={schoolSlug}/>
        </div>
    );
}
