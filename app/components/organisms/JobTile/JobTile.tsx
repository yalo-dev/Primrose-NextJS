import React from 'react';
import Button from '../../atoms/Button/Button';

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

interface JobTileProps {
    job: Job;
    baseUrl: string; // Add this prop
    page?: number;
}

const JobTile: React.FC<JobTileProps> = ({ job, baseUrl, page }) => {
    // Format date from created_at
    const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    // Handling possible differences in the job data structure
    const jobName = job.name || 'No Job Title Available';
    const jobLocationName = job.location?.name || 'Location Not Specified';
    const jobCity = job.location?.city || 'City Not Specified';
    const jobState = job.location?.state || 'State Not Specified';
    const jobEmploymentType = job.employment?.name || 'Employment Type Not Specified';

    return (
        <div data-page={page} className="job-tile">
            <a href={`${baseUrl}/${job.id}`}>
                <h5>{jobName}</h5>
            </a>
            <p className='b3 green mb-2'>{jobLocationName}</p>
            <p className='b2'>{`${jobCity}, ${jobState}`}</p>
            <p className="employment-type mb-3">{jobEmploymentType}</p>
            <p className='b2 post-date'>Posted: {postedDate}</p>
            <Button variant='primary' href={`${baseUrl}/${job.id}`}>
                Learn More
            </Button>
        </div>
    );
};


export default JobTile;
