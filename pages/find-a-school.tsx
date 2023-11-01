import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import schools from '../app/data/schoolsData';
import Button from '../app/components/atoms/Button/Button';

const containerStyle = {
  width: '100%',
  height: '350px'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

const GOOGLE_MAP_LIBRARIES: ("places")[] = ['places'];

type School = {
  id: number;
  name: string;
  address: string;
  hours: string;
  notes: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};


const svgIcon = (index, color = '#5E6738', isHovered = false) => {
  const fillColor = isHovered ? '#FF9E1B' : color;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="40" viewBox="0 0 33 40" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.8307 4.84967C-1.61023 11.3164 -1.61023 21.8168 4.8307 28.2831L16.5 40L28.1693 28.2831C34.6102 21.8168 34.6102 11.3164 28.1693 4.84967C21.7292 -1.61656 11.2708 -1.61656 4.8307 4.84967Z" fill="${fillColor}"/>
      <text x="16" y="23" font-family="Arial" font-size="14px" fill="white" text-anchor="middle">${index}</text>
    </svg>
  `;
};

const FindASchool = () => {
  const [autocomplete1, setAutocomplete1] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocomplete2, setAutocomplete2] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [activeTab, setActiveTab] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searched, setSearched] = useState(false);
  const nearInputRef = useRef<HTMLInputElement>(null);
  const alongInputRef = useRef<HTMLInputElement>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  let geocoder;
  const MAX_DISTANCE = 10;
  const [hoveredSchoolId, setHoveredSchoolId] = useState<number | null>(null);
  //const [nearbySchools, setNearbySchools] = useState<School[]>([]);
  //const [hoveredLocationId, setHoveredLocationId] = useState<number | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 0.621371; // Convert km to miles
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onPlaceSelected = (place) => {
    console.log('Selected Place:', place);
    if (place && place.geometry && place.geometry.location) {
      let newMapCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      
      setMapCenter(newMapCenter);
      setZoomLevel(10);  
      setHasSearched(true);
      setShowMap(true);
      setSearched(true);
    }
};

  const filteredSchools = schools.filter(school => {
    const distance = calculateDistance(
      mapCenter.lat,
      mapCenter.lng,
      school.coordinates.lat,
      school.coordinates.lng
    );
    return distance <= MAX_DISTANCE;
  });

  const handleInputChange = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current && ref.current.value === '') {
      setSearched(false);
    } else {
      setSearched(true);
    }
  };

  const getCurrentLocation = () => {
    if (!geocoder) {
      geocoder = new google.maps.Geocoder();
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        geocoder.geocode({ 'location': pos }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            if (nearInputRef.current) {
              nearInputRef.current.value = results[0].formatted_address;
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        });
        setUserLocation(pos);
        setMapCenter(pos);
        setZoomLevel(10);
        setShowMap(true);
        setSearched(true);
        setHasSearched(true);
      },
        () => {
          alert("Error getting location. Please ensure location services are enabled.");
        });
    } else {
      alert("Your browser doesn't support geolocation.");
    }
  };

  useEffect(() => {
    if (nearInputRef.current) {
      nearInputRef.current.addEventListener("input", () => {
        if (nearInputRef.current && nearInputRef.current.value === "") {
          setSearched(false);
        }
      });
    }
    return () => {
      if (nearInputRef.current) {
        nearInputRef.current.removeEventListener("input", () => { });
      }
    };
  }, []);

  const handleLocationIconClick = () => {
    getCurrentLocation();
  };

  const sortedSchools = [...filteredSchools].map((school, index) => {
    const dist = calculateDistance(mapCenter.lat, mapCenter.lng, school.coordinates.lat, school.coordinates.lng);
    return { ...school, index: index + 1, distance: dist };
  }).sort((a, b) => a.distance - b.distance);


  return (
    <div className='find-a-school-container'>

      <LoadScript
        googleMapsApiKey="AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw"
        libraries={GOOGLE_MAP_LIBRARIES}
      >
        <div className='search-box-container'>
          <div className='tabs'>
            <div className='tab-labels'>
              <div
                className={`tab-label tab-label-1 ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                <div className='b3'>Find a School Near You</div>
              </div>
              <div
                className={`tab-label tab-label-2 ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveTab(2)}
              >
                <div className='b3'>Search Along Route</div>
              </div>
            </div>
            <div className={`tab-content tab-content-1 ${activeTab === 1 ? 'active' : ''}`}>
              <div className='input-wrapper'>
                <Autocomplete
                  onLoad={autocomplete => {
                    console.log("Autocomplete1 loaded (tab-content-1)");
                    setAutocomplete1(autocomplete);
                  }}
                  onPlaceChanged={() => {
                    if (autocomplete1) {
                      const selectedPlace = autocomplete1.getPlace();
                      onPlaceSelected(selectedPlace);
                    }
                  }}
                >
                  <input
                    id="near"
                    type="text"
                    placeholder="Enter address, city and state, or zip"
                    ref={nearInputRef}
                    onChange={() => handleInputChange(nearInputRef)}
                  />
                </Autocomplete>
                <div className='location-icon' style={{ opacity: searched ? '0' : '1' }} onClick={handleLocationIconClick}>
                  <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" strokeWidth="1.5" />
                  </svg>

                </div>
                <div className='search-icon' style={{ opacity: searched ? '0' : '1' }}>
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="21" fill="#5E6738" />
                    <circle cx="20.1596" cy="19.3198" r="7.06" stroke="white" />
                    <path d="M24.5332 24.7798L29.7559 30.0025" stroke="white" />
                  </svg>
                </div>
                <div className='clear-icon'
                  style={{ opacity: searched ? '1' : '0' }}
                  onClick={() => {
                    setSearched(false);
                    if (nearInputRef.current) nearInputRef.current.value = '';
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14.8516" cy="14.8492" r="9.75" transform="rotate(45 14.8516 14.8492)" stroke="#5E6738" strokeWidth="1.5" />
                    <rect x="17.5781" y="11.2129" width="1.28571" height="9" transform="rotate(45 17.5781 11.2129)" fill="#5E6738" />
                    <rect x="11.2188" y="12.1211" width="1.28571" height="9" transform="rotate(-45 11.2188 12.1211)" fill="#5E6738" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`tab-content tab-content-2 ${activeTab === 2 ? 'active' : ''}`}>
              <div className='search-icon'>
                <Autocomplete
                  onLoad={autocomplete => {
                    console.log("Autocomplete2 loaded (tab-content-2)");
                    setAutocomplete2(autocomplete);
                  }}
                  onPlaceChanged={() => {
                    if (autocomplete2) {
                      const selectedPlace = autocomplete2.getPlace();
                      onPlaceSelected(selectedPlace);
                    }
                  }}
                >
                  <input
                    id="along"
                    type="text"
                    placeholder="Search by address, city, state, ZIP"
                    ref={alongInputRef}
                    onChange={() => handleInputChange(alongInputRef)}
                  />

                </Autocomplete>
              </div>
            </div>
          </div>
        </div>
        <div className={`google-map-container ${isMobile ? (!showMap || !hasSearched ? 'hidden' : '') : (hasSearched ? 'shift' : '')}`}>
          <GoogleMap center={mapCenter} zoom={zoomLevel} mapContainerStyle={containerStyle} onLoad={(map) => {
            mapRef.current = map;
          }}>
            {sortedSchools.map((school) => (
              <Marker
                key={school.id}
                position={school.coordinates}
                icon={{
                  url: `data:image/svg+xml,${encodeURIComponent(svgIcon(school.index, '#5E6738', school.id === hoveredSchoolId))}`,
                  scaledSize: new google.maps.Size(30, 30),
                }}
                onMouseOver={() => setHoveredSchoolId(school.id)}
                onMouseOut={() => setHoveredSchoolId(null)}
              />
            ))}
          </GoogleMap>
        </div>
        <div
          style={{ opacity: (!isMobile && hasSearched) ? '1' : '0' }}
          className="list-scroller"
        >
          <div className="nearby-schools-list">
            {sortedSchools.map((school) => (
              <div key={school.id} className="school-list">
                <a href={`/school/${school.id}`}>

                  <div
                    key={school.id}
                    className={`school-list-item ${hoveredSchoolId === school.id ? 'hovered' : ''}`}
                    onMouseOver={() => setHoveredSchoolId(school.id)}
                    onMouseOut={() => setHoveredSchoolId(null)}
                  >
                    <div className='name h5 w-100 d-flex justify-content-between'>
                      <div className='wrap d-flex justify-content-center align-items-center'>
                        <div className='marker'
                          dangerouslySetInnerHTML={{
                            __html: svgIcon(school.index, '#5E6738', hoveredSchoolId === school.id)
                          }}
                          style={{ width: '33px', height: '40px', marginRight: '10px' }}
                        >
                        </div>

                        {school.name}
                      </div>
                      <div className='d-flex justify-content-center align-items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730891 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722867 1.56412 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.2597 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="#373A36"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='wrap'>
                      <span className='distance'>{calculateDistance(
                        mapCenter.lat,
                        mapCenter.lng,
                        school.coordinates.lat,
                        school.coordinates.lng
                      ).toFixed(2)}mi</span>&nbsp;·&nbsp;
                      <span className='address'>{school.address}</span>
                    </div>
                    <div className='hours'>{school.hours}</div>
                    <ul className='notes'><li>{school.notes}</li></ul>
                    <div className='button-wrap d-flex'>
                      <Button variant="primary">Schedule a Tour</Button>
                      <div className='phone ms-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                          <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3" />
                          <path d="M30.5831 27.4384L30.5833 27.4385L32.1465 28.3071L33.7097 29.1756C34.3736 29.5442 34.6663 30.3311 34.4052 31.044L30.5831 27.4384ZM30.5831 27.4384C29.9087 27.0639 29.0985 27.1531 28.5217 27.6656L28.5217 27.6657M30.5831 27.4384L28.5217 27.6657M27.9429 33.7124L27.7715 34.1821C22.5741 32.285 18.715 28.4259 16.8179 23.2285L16.8179 23.2285C15.8177 20.4881 17.2584 17.5823 19.9558 16.5949L27.9429 33.7124ZM27.9429 33.7124L27.7715 34.1821C30.5119 35.1823 33.4177 33.7416 34.4051 31.0442L27.9429 33.7124ZM21.8247 17.2899L21.825 17.2903C22.4034 18.3323 22.9825 19.3748 23.5615 20.4167L23.5616 20.4169C23.936 21.0911 23.8471 21.9019 23.3343 22.4783L21.8247 17.2899ZM21.8247 17.2899C21.4556 16.6266 20.669 16.3336 19.956 16.5948L21.8247 17.2899ZM28.5217 27.6657L28.5197 27.6674C28.0523 28.0828 27.5847 28.4983 27.1174 28.9139C24.9301 27.9282 23.0718 26.0699 22.0861 23.8826M28.5217 27.6657L22.0861 23.8826M22.0861 23.8826C22.5022 23.4148 22.9182 22.9466 23.3341 22.4785L22.0861 23.8826Z" stroke="#5E6738" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default FindASchool;