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
    { label: 'Within 1 miles', value: '1', url: '#', target: '_self' },
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
const Pagination = () => {
        return (
            <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
                <Button
                    className='prev'
                    disabled={currentPage <= 1}
                    onClick={() => {
                        setCurrentPage(prev => prev - 1);
                        scrollToAllResources();
                    }} label={''}                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
                    </svg>
                </Button>
                <div className="page-numbers">
                </div>
                <Button
                    className='next'
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                        setCurrentPage(prev => prev + 1);
                        scrollToAllResources();
                    }} label={''}                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
                    </svg>
                </Button>
            </div>
        );
    };
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
