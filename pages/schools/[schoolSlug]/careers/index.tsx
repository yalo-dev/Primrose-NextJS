import { client } from '../../../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import GallerySlider from '../../../../app/components/modules/GallerySlider/GallerySlider';
import TestimonialsWithVideoOrImage from '../../../../app/components/modules/TestimonialsWithVideoOrImage/TestimonialsWithVideoOrImage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JobTile from '../../../../app/components/organisms/JobTile/JobTile';
import Button from '../../../../app/components/atoms/Button/Button';

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
          schoolAdminSettings {
            galleryCareers {
              image {
                altText
                sourceUrl
              }
              title
              caption
            }
            testimonialsCareers {
                headline
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
              jobTitle
              jobType
              jobDescription
              postDate
              
            }
          }
          schoolCorporateSettings {
            schoolName
            careerplugSchoolId
            address {
              city
              state
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
    
export default function SchoolCareerPage({ school, careerPlugSchoolId }) {
    const testimonials = school.schoolAdminSettings.testimonialsCareers;
    const gallery = school.schoolAdminSettings.galleryCareers;
    const [schoolJobs, setSchoolJobs] = useState<Job[]>([]);
    const [cmsJobs, setCmsJobs] = useState(school.schoolAdminSettings.jobPostings || []);
    const [isLoading, setIsLoading] = useState(true);
    const { city, state } = school.schoolCorporateSettings.address || {};

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch(`/api/fetchJobs`);
                const data = await response.json();
                const schoolId = parseInt(careerPlugSchoolId);
                const filteredJobs = data.filter(job => {
                    const accountId = parseInt(job.location?.account?.id);
                    return accountId === schoolId;
                });
                setSchoolJobs(filteredJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }

        setIsLoading(true);
        if (careerPlugSchoolId) {
            fetchJobs().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [careerPlugSchoolId]);

    useEffect(() => {
        console.log("Updated Jobs State:", schoolJobs);
    }, [schoolJobs]);

    const jobPosts = () => {
        const jobsToRender = careerPlugSchoolId ? schoolJobs : cmsJobs;
        if (isLoading) {
            return <p></p>;
        }
        if (!jobsToRender || jobsToRender.length === 0) {
            return <p>No job postings available.</p>;
        }

        return (
            <div className='jobs-container'>
                <div className='container'>
                    <div className='heading-wrapper pt-5 pb-5'>
                        <h1>Open Positions</h1>
                        <p className='b3'>We're growing. And we're looking for dedicated individuals who are as excited about helping children develop and learn as we are. If you're passionate about education and nurturing children and are looking for an environment with high standards for health and safety, consider a career with us.</p>
                    </div>

                    <div className='job-tile-wrapper pt-5 pb-5'>
                        {careerPlugSchoolId ? (
                            // Map over schoolJobs and render with JobTile if careerPlugSchoolId is present
                            schoolJobs.length > 0 ? (
                                schoolJobs.map((job, index) => (
                                    <JobTile key={index} job={job} baseUrl={`/schools/${school.slug}/careers`} />
                                ))
                            ) : (
                                <p>No job postings available.</p>
                            )
                        ) : (
                            // Map over cmsJobs and render with a different layout if careerPlugSchoolId is not present
                            cmsJobs.length > 0 ? (
                                cmsJobs.map((job, index) => (
                                    <div key={index} className="job-tile">
                                        <h5>{job.jobTitle || 'No Title'}</h5>
                                        <p className='b3 green mb-2'>{school.title || 'No School Name'}</p>
                                        <p className='b2'>{`${city || 'No City'}, ${state || 'No State'}`}</p>
                                        <p className="employment-type mb-3">{job.jobType || 'No Type'}</p>
                                        <p className='b2 post-date'>Posted: {job.postDate || 'No Date'}</p>
                                        <Button variant='primary' href={`/schools/${school.slug}/careers/${job.jobId}`}>
                                            Learn More
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p>No job postings available.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        );

    };

    const testimonialSection = () => {
        const testimonialsData = testimonials;

        if (!testimonialsData) {
            return null;
        }

        const sliderItems = testimonialsData.map(item => {
            const testimonial = item;

            return {
                image: {
                    sourceUrl: testimonial.testimonialImage?.image?.sourceUrl,
                    altText: testimonial.testimonialImage?.altText || 'Testimonial Image'
                },
                testimonial: testimonial.testimonial,
                title: testimonial.name,
                position: testimonial.title,
                imageOrVideo: 'image', // Set this based on your data
                // Add 'video' property if applicable
            };
        });

        return (
            <section className="module Page_Modules_Modules_TestimonialsWithVideoOrImage" id="Page_Modules_Modules_TestimonialsWithVideoOrImage4">

                <TestimonialsWithVideoOrImage
                    slider={sliderItems}
                    heading="A Teacher’s Perspective" // Replace with dynamic heading if available
                    subheading="Lorem ipsum dolor sit amet consectetur. Erat aliquet justo donec tellus mi. Rhoncus congue facilisi ultrices scelerisque accumsan pharetra." // Replace with dynamic subheading if available
                // Add other props as required
                />

            </section>
        );
    };

    const gallerySlider = () => {
        const galleryData = gallery;

        if (!galleryData || galleryData.length === 0) {
            return null;
        }

        return (
            <GallerySlider gallery={galleryData} uniqueId="gallerySlider" />
        );
    }

    return (
        <div className='school school-careers'>
            {jobPosts()}
            {testimonialSection()}
            {gallerySlider()}
        </div>
    );
}


