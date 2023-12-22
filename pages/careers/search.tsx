import React, { useState } from 'react';
import SelectDropdown from '../../app/components/molecules/SelectDropdown/SelectDropdown';
import Button from '../../app/components/atoms/Button/Button';
import JobTile from '../../app/components/organisms/JobTile/JobTile';


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


const SearchComponent = () => {
  const [distance, setDistance] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const distanceOptions = [
    { label: 'Within 1 miles', url: '#', target: '_self' },
    { label: 'Within 5 miles', url: '#', target: '_self' },
    { label: 'Within 10 miles', url: '#', target: '_self' },
    { label: 'Within 25 miles', url: '#', target: '_self' },
    { label: 'Within 50 miles', url: '#', target: '_self' },
    { label: 'Within 100 miles', url: '#', target: '_self' },
    // ... add more options as needed
  ];

  const handleDistanceChange = (selectedDistance: string) => {
    setDistance(selectedDistance);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSearch = async () => {
    setError(null);
    setIsLoading(true);
    setSearchPerformed(true); 
    try {
      const response = await fetch(`/api/fetchJobs?&distance=${distance}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const jobs = await response.json();
      setJobs(jobs); 
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
    }
    setIsLoading(false);
  };



  return (
    <div className="career-search-page">
      <div className={`container pt-5 pb-5 ${searchPerformed ? 'searched' : ''}`}>
        <div className={`search-container ${searchPerformed ? 'searched' : ''}`}>
          <div className="search-box-container">
            <h1 className="green">Find Current Job<br />Openings Near You</h1>
            <div className="search-box">
              <div className="input-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Enter address, city and state, or zip"
                />
                <div className='icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.16391 4.20281C-0.0546377 8.47353 -0.0546377 15.4082 4.16391 19.6786L11.8068 27.4167L19.4498 19.6786C23.6683 15.4082 23.6683 8.47353 19.4498 4.20281C15.2318 -0.0676034 8.3819 -0.0676034 4.16391 4.20281ZM11.9509 16.5565C14.4973 16.5565 16.5618 14.4539 16.5618 11.8602C16.5618 9.26653 14.4973 7.16391 11.9509 7.16391C9.4046 7.16391 7.34007 9.26653 7.34007 11.8602C7.34007 14.4539 9.4046 16.5565 11.9509 16.5565Z" stroke="#5E6738" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="select-wrapper">
                <SelectDropdown
                  options={distanceOptions}
                  placeholder="Select distance"
                  onSelect={handleDistanceChange}
                  returnFullOption={false}
                />
              </div>
              <Button onClick={handleSearch} 
                variant="primary" label="Search Positions" />
            </div>
          </div>
          <p className="search-disclaimer b2 green">
            Each Primrose school is a privately owned and operated franchise, and the respective Franchise Owner is the employer at each school. Franchise Owners set their own wage and benefit programs, which vary among Franchise Owners.
          </p>
        </div>

        <div className="search-results">
          {isLoading ? (
            <p></p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            jobs.map(job => (
              <JobTile job={job} baseUrl={`/careers`} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
