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
import Head from "next/head";


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
          title
          schoolCorporateSettings {
              homepageMeta {
                description
                fieldGroupName
                title
              }
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
              franchiseOwner {
                bio
                multipleOwners
                name
                image {
                  altText
                  sourceUrl
                  mediaItemUrl
                }
              }
              classroomsOffered
              extraCareOffered
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
                image {
                  sourceUrl
                }
                imageAlt
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
    const metaTitle = corporateSettings?.homepageMeta?.title ?? `Primrose School of ${school?.title}`
    const metaDesc = corporateSettings?.homepageMeta?.description
    const adminSettings = school?.schoolAdminSettings;
    const satImages = adminSettings?.satImages?.filter((imgObj) => imgObj && imgObj.image)
        .map((imgObj) => ({url: imgObj.image.sourceUrl, altText: imgObj.altText}))
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const defaultImages =[
        {url: '/schoolsHomeDefault/scrollies-1.jpg', altText: "A child and teacher's hand on a book",},
        {url: '/schoolsHomeDefault/scrollies-2.jpg', altText: 'A young boy playing with toys',},
        {url: '/schoolsHomeDefault/scrollies-3.jpg', altText: 'A young boy playing to the floor looking up at camera',},
        {url: '/schoolsHomeDefault/scrollies-4.jpg', altText: 'A young boy smiling at camera',},
        {url: '/schoolsHomeDefault/scrollies-5.jpg', altText: 'A young boy looking at camera',}
    ]

    return (
        <div className='school school-home'>
            <Head>
                <title>{metaTitle}</title>
                {metaDesc && <meta name={"description"} content={metaDesc}/>}
            </Head>
            <EmergencyAlert/>
            <HeroWithSlider corporateSettings={corporateSettings}
                            adminSettings={adminSettings} schoolSlug={schoolSlug}/>
            <FirstFive adminSettings={adminSettings}
                       corporateSettings={corporateSettings} schoolSlug={schoolSlug}/>
            <SchoolNewsSlider adminSettings={adminSettings} isClient={isClient} />
            <TestimonialSection adminSettings={adminSettings} />
            {adminSettings?.gallery?.length && <GallerySlider gallery={adminSettings.gallery} uniqueId="gallerySlider"/>}
            <ScheduleATourSlider schoolSlug={schoolSlug} images={defaultImages}/>
        </div>
    );
}
