import { client } from '../../../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import GallerySlider from '../../../../app/components/modules/GallerySlider/GallerySlider';
import TestimonialsWithVideoOrImage from '../../../../app/components/modules/TestimonialsWithVideoOrImage/TestimonialsWithVideoOrImage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JobTile from '../../../../app/components/organisms/JobTile/JobTile';
import Button from '../../../../app/components/atoms/Button/Button';
import Head from "next/head";
import Script from "next/script";

interface Job {
    id: number;
    name: string;
    location: {
        name: string;
        city: string;
        state: string;
    };
    employment: {
        name: string;
    };
    created_at: string;
}

export async function getServerSideProps(context) {

    const { schoolSlug } = context.params;

    const GET_SCHOOLS = gql`
    query GetSchoolDetails($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          title
          seo {
            fullHead
          }
          schoolAdminSettings {
            careersIntroCopy
            galleryCareers {
              image {
                altText
                sourceUrl
              }
              title
              caption
            }
            testimonialsCareers {
                name
                title
                testimonial
                testimonialImage {
                  altText
                  image {
                    mediaItemUrl
                    sourceUrl
                  }
                }
              }
            jobPostings {
              title
              slug
              jobType
              jobDescription
              postDate
              
            }
          }
          schoolCorporateSettings {
            usesCareerplug
            careerplugIframeUrl
            address {
              city
              state
            }
            careersMeta {
              description
              fieldGroupName
              title
            }
          }
        }
      }
    `;
    try {
        const response = await client.query({
            query: GET_SCHOOLS,
            variables: { id: `/schools/${schoolSlug}/` },
        });
        console.log("!!!!! repsonse !!!!!")
        console.log(response);
        const school = response?.data?.school;
        if (!school) {
            return { notFound: true };
        }
        const careerPlugSchoolId = school.schoolCorporateSettings.careerplugSchoolId || null;


        return {
            props: {
                school,
                schoolSlug,
                careerPlugSchoolId,
            },
        };

    } catch (error) {
        console.error('getServerSideProps Error:', error);
        return { props: { hasError: true } };
    }
}
const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
export default function SchoolCareerPage({ school }) {
    const testimonials = school.schoolAdminSettings.testimonialsCareers;
    const gallery = school.schoolAdminSettings.galleryCareers;
    const cmsJobs = school?.schoolAdminSettings?.jobPostings ?? [];
    const { city, state } = school.schoolCorporateSettings.address || {};
    const metaTitle = school.schoolCorporateSettings?.careersMeta?.title ?? `Careers | Primrose School of ${school?.title}`
    const metaDesc = school.schoolCorporateSettings?.careersMeta?.description
    const { usesCareerplug, careerplugIframeUrl } = school.schoolCorporateSettings;
    const sliderItems = testimonials?.map(testimonial => ({
        image: {
            sourceUrl: testimonial?.testimonialImage?.image?.sourceUrl,
            altText: testimonial?.testimonialImage?.altText || 'Testimonial Image'
        },
        testimonial: testimonial?.testimonial,
        title: testimonial?.name,
        position: testimonial?.title,
        imageOrVideo: 'image', // Set this based on your data
        // Add 'video' property if applicable
    }));

    return (
        <div className='school school-careers'>
            <Head>
              <title>{metaTitle}</title>
              {metaDesc && <meta name={"description"} content={metaDesc}/>}
            </Head>

            {/* Start Open Positions Section  */}
            <div className='jobs-container'>
                <div className='container'>
                    <div className='heading-wrapper pt-5 pb-5'>
                        <h1>Open Positions</h1>
                        {school.schoolAdminSettings?.careersIntroCopy
                            ? <div className='b3' dangerouslySetInnerHTML={{__html: school.schoolAdminSettings?.careersIntroCopy}} />
                            : (
                                <p className='b3'>
                                    We're growing. And we're looking for dedicated individuals who are as excited about
                                    helping children develop and learn as we are. If you're passionate about education and
                                    nurturing children and are looking for an environment with high standards for health and
                                    safety, consider a career with us.
                                </p>
                            )
                        }
                    </div>
                    {/* Show Careerplug or school jobs */}
                    {usesCareerplug
                        ? careerplugIframeUrl && (
                            <section className="careerplug-section">
                                <iframe
                                    id='cpatsframe'
                                    src={`https://${careerplugIframeUrl}/?embed=1`}
                                    title="Current Openings"
                                    width="100%"
                                    height="600px"
                                    style={{ border: 'none', position: 'relative'}}
                                />
                                <Script src={"https://cpats.s3.amazonaws.com/assets/embed.js"} />
                            </section>
                        ) : (
                            <div className='job-tile-wrapper pt-5 pb-5'>
                                {cmsJobs.length > 0
                                    ? cmsJobs.map((job, index) => (
                                        <div key={index} className="job-tile">
                                            <h5>{job.title ?? 'No Title'}</h5>
                                            <p className='b3 green mb-2'>{school.title ?? 'No School Name'}</p>
                                            <p className='b2'>{`${city ?? 'No City'}, ${state ?? 'No State'}`}</p>
                                            <p className="employment-type mb-3">{job.jobType ?? 'No Type'}</p>
                                            <p className='b2 post-date'>Posted: {job.postDate ?? 'No Date'}</p>
                                            <Button variant='primary' href={`/schools/${school.slug}/careers/${job.slug}`}>
                                                Learn More
                                            </Button>
                                        </div>
                                    ))
                                    : <p>No job postings available.</p>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            {/* End Open Positions Section */}

            {/* Start Testimonials Section */}
            {sliderItems && (
                <section className="module Page_Modules_Modules_TestimonialsWithVideoOrImage"
                         id="Page_Modules_Modules_TestimonialsWithVideoOrImage4"
                >
                    <TestimonialsWithVideoOrImage
                        slider={sliderItems}
                        heading="A Teacher’s Perspective" // Replace with dynamic heading if available
                        // subheading="Lorem ipsum dolor sit amet consectetur. Erat aliquet justo donec tellus mi. Rhoncus congue facilisi ultrices scelerisque accumsan pharetra." // Replace with dynamic subheading if available
                        // Add other props as required
                    />
                </section>
            )}
            {/* End Testimonials Section */}

            {/* Start Gallery Section */}
            {gallery?.length && <GallerySlider gallery={gallery} uniqueId="gallerySlider"/>}
            {/* End Gallery Section */}
        </div>
    );
}
