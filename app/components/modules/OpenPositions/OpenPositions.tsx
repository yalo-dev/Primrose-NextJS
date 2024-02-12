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


const OpenPositions = ({ careerPlugId }) => {
    const [schoolJobs, setSchoolJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch(`/api/fetchJobs`);
                const data = await response.json();
                const schoolId = parseInt(careerPlugId);
                const filteredJobs = data.filter(job => {
                    const accountId = parseInt(job.location?.account?.id);
                    return true;
                });
                setSchoolJobs(filteredJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }

        setIsLoading(true);
        if (careerPlugId) {
            fetchJobs().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [careerPlugId]);

    useEffect(() => {
        console.log("Updated Jobs State:", schoolJobs);
    }, [schoolJobs]);

    const jobPosts = () => {
        const jobsToRender = schoolJobs ;
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
                        <p className='b3'>Ready to start your Primrose career and make a difference in your community and beyond? Check out open teaching jobs below.</p>
                    </div>

                    <div className='job-tile-wrapper pt-5 pb-5'>
                        {careerPlugId ? (
                            // Map over schoolJobs and render with JobTile if careerPlugSchoolId is present
                            schoolJobs.length > 0 ? (
                                schoolJobs.map((job, index) => (
                                    <JobTile key={index} job={job} baseUrl={`/careers`} />
                                ))
                            ) : (
                                <p>No job postings available.</p>
                            )): (
                                <p>No job postings available.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        );

                    }

    return (
        <div className='school school-careers' id="jobs">
            {jobPosts()}
        </div>
    );
}

export default OpenPositions;