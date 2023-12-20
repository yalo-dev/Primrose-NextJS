import React from 'react';
import Button from '../../atoms/Button/Button';

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

const JobTile: React.FC<{ job: Job }> = ({ job }) => {
    // Format date from created_at
    const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    return (
        <div className="job-tile">
            <h5>{job.name}</h5>
            <p className='b3 green mb-2'>{job.location.name}</p>
            <p className='b2'>{`${job.location.city}, ${job.location.state}`}</p>
            <p className="employment-type mb-3">{job.employment.name}</p>
            <p className='b2 post-date'>Posted: {postedDate}</p>
            <Button variant='primary' href={`/jobs/${job.id}`}>
                Learn More
            </Button>
        </div>
    );
};

export default JobTile;
