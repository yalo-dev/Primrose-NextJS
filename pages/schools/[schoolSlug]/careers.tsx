import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import GallerySlider from '../../../app/components/modules/GallerySlider/GallerySlider';
import TestimonialsWithVideoOrImage from '../../../app/components/modules/TestimonialsWithVideoOrImage/TestimonialsWithVideoOrImage';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import JobTile from '../../../app/components/organisms/JobTile/JobTile';

interface Job {
    id: number;
    name: string;
    location: {
        name: string;
        city: string;
        state: string;
        street: string;
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
              ... on Testimonial {
                id
                testimonials {
                  name
                  title
                  testimonial
                  featuredImage {
                    sourceUrl
                    altText
                  }
                }
              }
            }
            jobPostings {
              jobTitle
              applicationLink
              hiringManagerEmail
              jobType
              jobDescription
              postDate
              socialShareButtons {
                email {
                  target
                  url
                  title
                }
                facebook {
                  target
                  title
                  url
                }
                linkedin {
                  url
                  target
                  title
                }
                twitter {
                  target
                  title
                  url
                }
              }
            }
          }
          schoolCorporateSettings {
            careerPlugSchoolId
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

        const school = response?.data?.school;
        if (!school) {
            return { notFound: true };
        }
        const careerPlugSchoolId = school.schoolCorporateSettings.careerPlugSchoolId;

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

export default function SchoolCareerPage({ school, careerPlugSchoolId }) {
    const testimonials = school.schoolAdminSettings.testimonialsCareers;
    const gallery = school.schoolAdminSettings.galleryCareers;
    const [schoolJobs, setSchoolJobs] = useState<Job[]>([]);
    const [cmsJobs, setCmsJobs] = useState(school.schoolAdminSettings.jobPostings || []);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (careerPlugSchoolId) {
            async function fetchJobs() {
                setIsLoading(true);
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
                } finally {
                    setIsLoading(false);
                }
            }
            fetchJobs();
        }
    }, [careerPlugSchoolId]);
    
    useEffect(() => {
        console.log("Updated Jobs State:", schoolJobs);
    }, [schoolJobs]);
    
    useEffect(() => {
        if (!careerPlugSchoolId) {
            const formattedCmsJobs = cmsJobs.map((job, index) => {
                let formattedDate = 'Date Not Available';
                if (job.postDate) {
                    const [day, month, year] = job.postDate.split('/').map(part => parseInt(part, 10));
                    const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const parsedDate = new Date(isoDate);
                    if (!isNaN(parsedDate.getTime())) {
                        formattedDate = parsedDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                        });
                    } else {
                        formattedDate = 'Invalid Date Format';
                    }
                }
                return {
                    id: index, // setting a unique number for key prop
                    name: job.jobTitle || 'No Job Title Available',
                    location: {
                        name: school.title,
                        city: school.schoolCorporateSettings.address.city,
                        state: school.schoolCorporateSettings.address.state,
                        street: '', // Make sure this is acceptable for your JobTile component
                    },
                    employment: {
                        name: job.jobType || 'Employment Type Not Specified'
                    },
                    created_at: formattedDate
                };
            });
        
            setSchoolJobs(formattedCmsJobs);
            setIsLoading(false);
        }
    }, [careerPlugSchoolId, cmsJobs, school]);

    

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
                    {jobsToRender.map((job, index) => (
                        <JobTile key={job.id || index} job={job} />
                        ))}
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
            const testimonial = item.testimonials;
    
            return {
                image: {
                    sourceUrl: testimonial.featuredImage?.sourceUrl,
                    altText: testimonial.featuredImage?.altText || 'Testimonial Image'
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
