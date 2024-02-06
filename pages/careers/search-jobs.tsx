import React, { useState, useEffect } from 'react';
import SelectDropdown from '../../app/components/molecules/SelectDropdown/SelectDropdown';
import Button from '../../app/components/atoms/Button/Button';
import JobTile from '../../app/components/organisms/JobTile/JobTile';
let $ = require('jquery');

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
    { label: 'Within 1 mile', value: '1', url: '#', target: '_self' },
    { label: 'Within 5 miles', value: '5', url: '#', target: '_self' },
    { label: 'Within 10 miles', value: '10', url: '#', target: '_self' },
    { label: 'Within 25 miles', value: '25', url: '#', target: '_self' },
    { label: 'Within 50 miles', value: '50', url: '#', target: '_self' },
    { label: 'Within 100 miles', value: '100', url: '#', target: '_self' },
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
      const response = await fetch(`/api/fetchJobs?position=${searchTerm}&distance=${distance}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const jobs = await response.json();
      setJobs(jobs); 
      totalPages = Math.ceil(jobs.length / perPage);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
    }
    setIsLoading(false);
  };

let totalPages = 0;
const currentPage = 1;
const perPage = 8;

 useEffect(() => {
    $(function(){
        
    });
 }, []);
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
                  placeholder="Enter zip code"
                  onChange={handleInputChange}
                />
                
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
            jobs.map((job, index) => (
              <JobTile key={index} page={Math.ceil((index+1)/perPage)} job={job} baseUrl={`/careers`} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
