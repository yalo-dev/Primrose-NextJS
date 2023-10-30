import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import schools from '../app/data/schoolsData';
import Heading from '../app/components/atoms/Heading/Heading';


const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

const FindASchool = () => {
  // const [autocomplete, setAutocomplete] = useState(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState(center);


  const onPlaceSelected = (place) => {
    if (place.geometry) {
      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  return (
    <div className='find-a-school-container'>
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey="AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={5}
        >
          <div className='search-box-container'>
            <div className='tabs'>
              <div className='tab-labels'>
                <div className='tab-label'>
                  <Heading level='h5'>Find a School Near You</Heading>
                </div>
                <div className='tab-label'>
                  <Heading level='h5'>Search Along Route</Heading>
                </div>
              </div>
              <div className='tab-content tab-content-1'>
                <Autocomplete
                  onLoad={autocomplete => setAutocomplete(autocomplete)}
                  onPlaceChanged={() => {
                    if (autocomplete !== null) {
                      onPlaceSelected((autocomplete as google.maps.places.Autocomplete).getPlace());
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter address, city and state, or zip"
                    style={{
                      boxSizing: `border-box`,
                      border: `1px solid transparent`,
                      width: `240px`,
                      height: `32px`,
                      marginTop: `10px`,
                      padding: `0 12px`,
                      borderRadius: `3px`,
                      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                      fontSize: `14px`,
                      outline: `none`,
                      textOverflow: `ellipses`,
                      position: "relative",
                      left: "50%",
                      marginLeft: "-120px"
                    }}
                  />
                </Autocomplete>
                <div className='location-icon'>
                  <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" stroke-width="1.5" />
                  </svg>

                </div>
                <div className='search-icon'>
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#5E6738" />
                    <circle cx="20.1596" cy="19.3198" r="7.06" stroke="white" />
                    <path d="M24.5332 24.7798L29.7559 30.0025" stroke="white" />
                  </svg>
                </div>
              </div>
              <div className='tab-content tab-content-2'>
                <Autocomplete
                  onLoad={autocomplete => setAutocomplete(autocomplete)}
                  onPlaceChanged={() => {
                    if (autocomplete !== null) {
                      onPlaceSelected((autocomplete as google.maps.places.Autocomplete).getPlace());
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search by address, city, state, ZIP "
                    style={{
                      boxSizing: `border-box`,
                      border: `1px solid transparent`,
                      width: `240px`,
                      height: `32px`,
                      marginTop: `10px`,
                      padding: `0 12px`,
                      borderRadius: `3px`,
                      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                      fontSize: `14px`,
                      outline: `none`,
                      textOverflow: `ellipses`,
                      position: "relative",
                      left: "50%",
                      marginLeft: "-120px"
                    }}
                  />
                </Autocomplete>
              </div>
            </div>



          </div>


          {schools.map(school => (
            <Marker
              key={school.id}
              position={school.coordinates}
              title={school.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default FindASchool;