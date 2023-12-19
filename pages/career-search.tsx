import React, { useState } from 'react';
import SelectDropdown from '../app/components/molecules/SelectDropdown/SelectDropdown';

const SearchComponent = () => {
    const [distance, setDistance] = useState(null);
    const [position, setPosition] = useState(null);
  
    const distanceOptions = [
      { label: 'Within 5 miles', url: '#', target: '_self' },
      { label: 'Within 10 miles', url: '#', target: '_self' },
      { label: 'Within 25 miles', url: '#', target: '_self' },
      // ... add more options as needed
    ];
  
    const positionOptions = [
      { label: 'All Positions', url: '#', target: '_self' },
      { label: 'Teaching Positions', url: '#', target: '_self' },
      { label: 'Administrative Positions', url: '#', target: '_self' },
      // ... add more options as needed
    ];

  return (
    <div className="career-search-page">
        <div className="container pt-5 pb-5">
      <h1 className="search-heading green">Find Current Job<br/>Openings Near You</h1>
      <div className="search-box">
      <input
          className="search-input"
          type="text"
          placeholder="Enter address, city and state, or zip"
        />
        <SelectDropdown 
          options={distanceOptions} 
          placeholder="Select distance"
        
        />
        <SelectDropdown 
          options={positionOptions} 
          placeholder="Select position"
       
        />
        <button className="primary">Search Positions</button>
      </div>
      <p className="search-disclaimer b2">
        Each Primrose school is a privately owned and operated franchise, and the respective Franchise Owner is the employer at each school. Franchise Owners set their own wage and benefit programs, which vary among Franchise Owners.
      </p>
    </div>
    </div>
  );
};

export default SearchComponent;
