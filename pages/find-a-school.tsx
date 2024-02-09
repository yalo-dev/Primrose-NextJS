import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import schools from '../app/data/schoolsData';
import Button from '../app/components/atoms/Button/Button';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


const containerStyle = {
  width: '100%',
  height: '350px'
};

const center = {
  lat: 39.8283,
  lng: -98.5795
};

const GOOGLE_MAP_LIBRARIES: ("places")[] = ['places'];

type Location = {
  lat: number;
  lng: number;
};

type Waypoint = {
  id: number;
  location: Location | null;
};

type InputField = {
  id: string;
  originalType: 'start' | 'waypoint' | 'destination';
  type: 'start' | 'waypoint' | 'destination';
  ref: React.RefObject<HTMLInputElement>;
  autocomplete: any; 
  location: Location | null;
  address: string;
};

type LocationData = {
  start: { lat: number; lng: number; } | null;
  waypoints: Waypoint[];
  destination: { lat: number; lng: number; } | null;
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

const svgIconEnd = `
<svg width="34" height="39" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" fill="#555F68" stroke-width="1.5"/>
</svg>
`;

const svgIconStart = `
<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8.5" cy="9.34973" r="7.75" fill="#5E6738" stroke="#5E6738" stroke-width="1.5"/>
</svg>

`;

const FindASchool = () => {
  const [autocomplete1, setAutocomplete1] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocomplete2, setAutocomplete2] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocomplete3, setAutocomplete3] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [activeTab, setActiveTab] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searched, setSearched] = useState(false);
  const nearInputRef = useRef<HTMLInputElement>(null);
  const routeInputRef1 = useRef<HTMLInputElement>(null);
  const routeInputRef2 = useRef<HTMLInputElement>(null);
  const routeInputRef3 = useRef<HTMLInputElement>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  let geocoder;
  const MAX_DISTANCE = 10;
  const DEFAULT_ZOOM = 5;
  const [hoveredSchoolId, setHoveredSchoolId] = useState<number | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [autocompleteInstances, setAutocompleteInstances] = useState({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [start, setStart] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [waypoint, setWaypoint] = useState<{ lat: number; lng: number } | null>(null);
  const svgMarkerIconStart = `data:image/svg+xml;utf8,${encodeURIComponent(svgIconStart)}`;
  const svgMarkerIconEnd = `data:image/svg+xml;utf8,${encodeURIComponent(svgIconEnd)}`;
  const [waypointRefs, setWaypointRefs] = useState<Record<number, React.RefObject<HTMLInputElement>>>({});
  const [markers, setMarkers] = useState([]);
  const [searchText, setSearchText] = useState('');


  const [inputFields, setInputFields] = useState<InputField[]>([
    { id: 'start', originalType: 'start', type: 'start', ref: routeInputRef1, autocomplete: null, location: null, address: '' },
    { id: 'destination', originalType: 'destination', type: 'destination', ref: routeInputRef2, autocomplete: null, location: null, address: ''  },
  ]);
  

  const handleNewWaypoint = (newWaypoint) => {
    setWaypoints([...waypoints, newWaypoint]);
  
    const newRef = React.createRef<HTMLInputElement>();
    waypointRefs[newWaypoint.id] = newRef;
  
    const newWaypointField: InputField = {
      id: `waypoint-${newWaypoint.id}`,
      originalType: 'waypoint',
      type: 'waypoint',
      ref: newRef,
      autocomplete: null,
      location: null,
      address: '' 
    };
  
    setInputFields(prevFields => [...prevFields, newWaypointField]);
  
    console.log("New waypoint ref added", newRef, "for waypoint", newWaypoint.id);
  };
  

  const [locationData, setLocationData] = useState<LocationData>({
    start: null,
    waypoints: [],
    destination: null
  });


  const [updateCount, setUpdateCount] = useState(0);


  useEffect(() => {
    console.log("Updated refs", waypointRefs);
    console.log("Update count", updateCount);
  }, [waypointRefs, updateCount]);
  

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


  const handleAutocompleteLoad = (key, autocomplete) => {
    setAutocompleteInstances(prev => ({
      ...prev,
      [key]: autocomplete
    }));
  };
 

  const handleAddMoreClick = () => {
    setIsAdded(true);
    const defaultLocation: Location = {
      lat: 0,
      lng: 0
    };
  
    const newWaypointId = waypoints.length;
    const newWaypoint = { id: newWaypointId, location: defaultLocation };
  
    setWaypoints(prevWaypoints => [...prevWaypoints, newWaypoint]);
  
    setWaypointRefs(prevRefs => {
      return { ...prevRefs, [newWaypoint.id]: React.createRef() };
    });
  
    handleNewWaypoint(newWaypoint);

    if (!isMobile) {
      const container = document.querySelector('.find-a-school-container') as HTMLElement;
      if (container) {
        if (getComputedStyle(container).getPropertyValue('--view-height') === '100%') {
          // Switch from percentage to pixel value on first waypoint added
          let currentPixelHeight = container.offsetHeight;
          container.style.setProperty('--view-height', `${currentPixelHeight + 100}px`);
        } else {
          // If already using pixel values
          let currentHeight = parseInt(getComputedStyle(container).getPropertyValue('--view-height'));
          container.style.setProperty('--view-height', `${currentHeight + 100}px`);
        }

        // Trigger the Google Maps resize event after changing the height
        setTimeout(() => {
          if (mapRef.current) {
            google.maps.event.trigger(mapRef.current, 'resize');
          }
        }, 100);
      }
    }
    setUpdateCount(count => count + 1);

  };


  const [showCurrentLocationPin, setShowCurrentLocationPin] = useState(true);


  const handleClearIconClick = (idToRemove: number) => {
    setWaypoints(prevWaypoints => {
      const updatedWaypoints = prevWaypoints.filter(waypoint => waypoint.id !== idToRemove);

      setIsAdded(updatedWaypoints.length > 0);

      return updatedWaypoints;
    });

    // Remove the ref associated with the removed waypoint
    setWaypointRefs(prevRefs => {
      const updatedRefs = { ...prevRefs };
      delete updatedRefs[idToRemove];
      return updatedRefs;
    });

    if (!isMobile) {
      const container = document.querySelector('.find-a-school-container') as HTMLElement;
      if (container) {
        let currentHeight = parseInt(getComputedStyle(container).getPropertyValue('--view-height'));
        container.style.setProperty('--view-height', `${currentHeight - 100}px`);

        // Trigger the Google Maps resize event after changing the height
        setTimeout(() => {
          if (mapRef.current) {
            google.maps.event.trigger(mapRef.current, 'resize');
          }
        }, 100);
      }
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

            if (activeTab === 1) { 
                if (nearInputRef.current) {
                    nearInputRef.current.value = "Current Location";
                }
                setStart(pos);
                setShowCurrentLocationPin(false);
            } else {
                // Geocoding logic for other tabs
                geocoder.geocode({ 'location': pos }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        if (routeInputRef1.current) {
                            routeInputRef1.current.value = results[0].formatted_address;
                        }
                        setStart(pos);
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            }

            setUserLocation(pos);
            setMapCenter(pos);
            setZoomLevel(11);
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


  const handleLocationIconClick = () => {
    getCurrentLocation();
  };

 
  const handleInputChange = (event, fieldId) => {
    const newValue = event.target.value;
  
    // Update the address of the corresponding field
    setInputFields(prevFields =>
      prevFields.map(field => {
        if (field.id === fieldId) {
          return { ...field, address: newValue };
        }
        return field;
      })
    );
  };


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 0.621371;
  };
  
 
  const renderRoute = () => {
    console.log("inputFields in renderRoute():", inputFields);
    const startField = inputFields.find(f => f.type === 'start');
    const waypointFields = inputFields.filter(f => f.type === 'waypoint');
    const destinationField = inputFields.find(f => f.type === 'destination');
  
    if (!window.google || !window.google.maps) {
      console.log("Google Maps API not loaded yet.");
      return;
    }

    if (!start || (typeof start !== 'string' && (typeof start !== 'object' || !start.lat || !start.lng))) {
      //console.log("Start location is not defined or not in the correct format.");
      return;
    }

    if (!destination || (typeof destination !== 'string' && (typeof destination !== 'object' || !destination.lat || !destination.lng))) {
      //console.log("Destination location is not defined or not in the correct format.");
      return;
    }

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#474E4D',
          strokeOpacity: 1.0,
          strokeWeight: 3
        }
      });
    } else {
      directionsRendererRef.current.setOptions({
        polylineOptions: {
          strokeColor: '#474E4D',
          strokeOpacity: 1.0,
          strokeWeight: 3
        }
      });
    }

    if (mapRef.current && directionsRendererRef.current) {
      directionsRendererRef.current.setMap(mapRef.current);
    }

    const directionsService = new window.google.maps.DirectionsService();

    const mappedWaypoints: google.maps.DirectionsWaypoint[] = waypoints
    .filter(waypoint => waypoint.location) 
    .map(waypoint => {
      if (waypoint.location) {
        return {
          location: new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng),
          stopover: true
        } as google.maps.DirectionsWaypoint;
      }
      return undefined;
    })
    .filter((waypoint): waypoint is google.maps.DirectionsWaypoint => waypoint !== undefined);

  const route: google.maps.DirectionsRequest = {
    origin: new google.maps.LatLng(start.lat, start.lng),
    destination: new google.maps.LatLng(destination.lat, destination.lng),
    waypoints: mappedWaypoints,
    travelMode: window.google.maps.TravelMode.DRIVING,
    optimizeWaypoints: true,
  };

    directionsService.route(route, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current?.setDirections(result);
      } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
        console.log("No route could be found between the origin and destination.");
      } else {
        console.log("Directions request failed due to " + status);
      }
    });
  };


  const onWaypointSelected = (waypointId, selectedPlace) => {
    if (selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location) {
      let newMapCenter = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      };
  
      const formattedPlaceName = selectedPlace.name ? `${selectedPlace.name}, ${selectedPlace.formatted_address}` : selectedPlace.formatted_address;
  
      setInputFields(prevFields =>
        prevFields.map(field => {
          if (field.id === `waypoint-${waypointId}`) {
            return { ...field, location: newMapCenter, address: formattedPlaceName };
          }
          return field;
        })
      );
  
      setWaypoints(prevWaypoints => prevWaypoints.map(waypoint => {
        if (waypoint.id === waypointId) {
          return { ...waypoint, location: newMapCenter };
        }
        return waypoint;
      }));
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


  const filteredSchools = schools.filter(school => {
    const distance = calculateDistance(
      mapCenter.lat,
      mapCenter.lng,
      school.coordinates.lat,
      school.coordinates.lng
    );
    return distance <= MAX_DISTANCE;
  });


  const sortedSchools = [...filteredSchools].map((school) => {
    const dist = calculateDistance(mapCenter.lat, mapCenter.lng, school.coordinates.lat, school.coordinates.lng);
    return { ...school, distance: dist };
  }).sort((a, b) => a.distance - b.distance)
    .map((school, index) => ({ ...school, index: index + 1 }));


  function onPlaceSelected(place, type = 'defaultType') {
    if (place && place.geometry && place.geometry.location) {
      let newMapCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMapCenter(newMapCenter);
      setZoomLevel(11);
      setHasSearched(true);
      setShowMap(true);
      setSearched(true);
  
      const formattedPlaceName = place.name ? `${place.name}, ${place.formatted_address}` : place.formatted_address;
      
      
      
      setInputFields(prevFields =>
        prevFields.map(field => {
          if (field.type === type) {
            return { ...field, location: newMapCenter, address: formattedPlaceName };
          }
          return field;
        })
      );
    
      
      
      if (type === 'start') {
        console.log('New start position:', newMapCenter);
        setStart(newMapCenter);
      } else if (type === 'destination') {
        console.log('New destination position:', newMapCenter);
        setDestination(newMapCenter);
      } else if (type.startsWith('waypoint_')) {
        const waypointId = parseInt(type.split('_')[1], 10);
        setWaypoints(prevWaypoints => prevWaypoints.map(waypoint => {
          if (waypoint.id === waypointId) {
            return { ...waypoint, location: newMapCenter };
          }
          return waypoint;
        }));
      }
    }
  };

  const onEnterKeyPressed = (type = 'near', waypointId?: number) => {
    if (mapRef.current) {
      const map = mapRef.current;
      let inputValue;
      let inputRef;

      switch (type) {
        case 'near':
          inputRef = nearInputRef;
          break;
        case 'start':
          inputRef = routeInputRef1;
          break;
        case 'destination':
          inputRef = routeInputRef2;
          break;
        case 'waypoint':
          inputRef = waypointRefs[waypointId!];
          type = `waypoint_${waypointId}`;
          break;
        default:
          console.log('Invalid input type');
          return;
      }

      if (!inputRef.current || !inputRef.current.value) {
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Input reference is not available or input is empty`);
        return;
      }

      inputValue = inputRef.current.value;
      console.log('Input value:', inputValue);

      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions({
        input: inputValue,
        componentRestrictions: { country: 'us' },
      },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.log('Error: ' + status);
            return;
          }

          if (!predictions || predictions.length === 0) {
            console.log('No predictions found');
            return;
          }

          const placesService = new google.maps.places.PlacesService(map);
          placesService.getDetails({ placeId: predictions[0].place_id }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              console.log('Calling onPlaceSelected with location type:', type);
              onPlaceSelected(place, type);
              if (inputRef.current) {
                inputRef.current.value = predictions[0].description;
              }
            } else {
              console.log('Error getting place details: ' + status);
            }
            return place;
          }
          );
        });
    } else {
      console.log('Map reference is not available');
    }
  };

  const onEnterKeyPressedForWaypoint = async (waypointId: number) => {
    const place = await onEnterKeyPressed('waypoint', waypointId);
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    setHasSearched(false);
    setSearched(false);
    setShowMap(false);
    setIsAdded(false);
    setMapCenter(center);
    setZoomLevel(DEFAULT_ZOOM);
    setMarkers([]);

    if (tabIndex === 1) {
      window.location.hash = 'nearby';
    } else if (tabIndex === 2) {
      window.location.hash = 'alongroute';
    }

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }

    setHoveredSchoolId(null);

    if (nearInputRef.current) nearInputRef.current.value = '';
    if (routeInputRef1.current) routeInputRef1.current.value = '';
    if (routeInputRef2.current) routeInputRef2.current.value = '';

    setWaypoints([]);

    setSearchText('');

    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(DEFAULT_ZOOM);
    }

    Object.values(waypointRefs).forEach(ref => {
      if (ref && ref.current) ref.current.value = '';
    });

    setDirections(null);
    setStart(null);
    setWaypoint(null);
    setDestination(null);
  };

useEffect(() => {
  const hash = window.location.hash;
  if (hash === '#nearby') {
    setActiveTab(1);
    // Additional setup for Tab 1
  } else if (hash === '#alongroute') {
    setActiveTab(2);
    // Additional setup for Tab 2
  }
}, []);


  const handleDragEnd = (result) => {
    if (!result.destination) return;
  

    const items = Array.from(inputFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  

    setInputFields(items.map(item => {
      const currentRefValue = waypointRefs[item.id]?.current?.value;
      return {
        ...item,
        address: currentRefValue || item.address
      };
    }));
  
    const newRefs = {};
    items.forEach(item => {
      newRefs[item.id] = waypointRefs[item.id];
    });
    setWaypointRefs(newRefs); 
    updateLocationData(items);
  };

  const updateLocationData = (items) => {
    const newStart = items[0].location;
    const newDestination = items[items.length - 1].location;
    const newWaypoints = items.slice(1, -1).map(item => ({ id: item.id, location: item.location }));
  
    setStart(newStart);
    setDestination(newDestination);
    setWaypoints(newWaypoints);
  
    // Update inputFields to preserve addresses and other properties
    setInputFields(items.map(item => {
      const originalField = inputFields.find(field => field.id === item.id);
      return { ...item, address: originalField ? originalField.address : '' };
    }));
  
    console.log("Updated locations and input fields:", { newStart, newWaypoints, newDestination });
  };
  
  useEffect(() => {
    renderRoute();
  }, [start, waypoints, destination]);


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
                onClick={() => handleTabClick(1)}
              >
                <div className='b3'>Find a School Near You</div>
              </div>
              <div
                className={`tab-label tab-label-2 ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => handleTabClick(2)}
              >
                <div className='b3'>Search Along Route</div>
              </div>
            </div>
            <div className={`tab-content tab-content-1 ${activeTab === 1 ? 'active' : ''}`}>
              <div className='input-wrapper'>

                <Autocomplete
                  onLoad={autocomplete => {
                    autocomplete.setComponentRestrictions({ country: 'us' });
                    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
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
                    onChange={(e) => handleInputChange(e, '')}

                    //onChange={() => handleInputChange(nearInputRef, '')}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onEnterKeyPressed();
                      }
                    }}
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
                <div className='clear-icon' style={{ opacity: searched ? '1' : '0' }}
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

              <div className={`input-wrapper ${isAdded ? 'added' : ''}`}>
                <div
                  className={`add-more ${isAdded ? 'added' : ''}`}
                  onClick={handleAddMoreClick}>
                  <div className='add'>
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="13.4141" cy="13.6251" r="13.3359" fill="white" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.5 24.0001C18.299 24.0001 23 19.2991 23 13.5001C23 7.70113 18.299 3.00012 12.5 3.00012C6.70101 3.00012 2 7.70113 2 13.5001C2 19.2991 6.70101 24.0001 12.5 24.0001ZM11.8594 9.00012H13.1451V12.857H17V14.1427H13.1451V18.0001H11.8594V14.1427H8V12.857H11.8594V9.00012Z" fill="#FF9E1B" />
                    </svg>
                  </div>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="routeInputs">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className={`input-wrapper ${isAdded ? 'added' : ''}`}>

                        <div className='first-input'>
                          <div className='start'>
                          </div>
                          <Draggable key='start' draggableId='start' index={0}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Autocomplete
                                  onLoad={autocomplete => {
                                    autocomplete.setComponentRestrictions({
                                      country: 'us'
                                    });
                                    setAutocomplete2(autocomplete);
                                  }}
                                  onPlaceChanged={() => {
                                    if (autocomplete2) {
                                      const selectedPlace = autocomplete2.getPlace();
                                      onPlaceSelected(selectedPlace, 'start');
                                    }
                                  }}
                                >

                                  <input
                                    ref={routeInputRef1}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        onEnterKeyPressed('start');
                                      }
                                    }}
                                    id="along"
                                    type="text"
                                    placeholder="Search by address, city, state, ZIP"
                                    value={inputFields.find(field => field.type === 'start')?.address || ''}
                                    onChange={(e) => handleInputChange(e, 'start')}
                                    />


                                </Autocomplete>
                              </div>
                            )}
                          </Draggable>
                          <div className='location-icon' style={{ opacity: searched ? '0' : '1' }} onClick={handleLocationIconClick}>
                            <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" strokeWidth="1.5" />
                            </svg>
                          </div>
                          <div className='drag-icon'>
                            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="1" y1="1" x2="19" y2="1" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                              <line x1="1" y1="9" x2="19" y2="9" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>

                        {waypoints.map((waypoint, index) => {
                        const waypointInputField = inputFields.find(field => field.id === `waypoint-${waypoint.id}`);
                        const inputFieldId = `waypoint-${waypoint.id}`;

                          return (
                          <div key={waypoint.id} className='waypoint-input'>
                            <div className='start'>
                            </div>
                            <Draggable key={waypoint.id} draggableId={`waypoint-${waypoint.id}`} index={index + 1}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <Autocomplete
                                    onLoad={autocomplete => {
                                      autocomplete.setComponentRestrictions({ country: 'us' });
                                      handleAutocompleteLoad(`waypoint_${waypoint.id}`, autocomplete);
                                    }}
                                    onPlaceChanged={() => {
                                      const selectedPlace = autocompleteInstances[`waypoint_${waypoint.id}`].getPlace();
                                      onWaypointSelected(waypoint.id, selectedPlace);
                                    }}
                                  >

                                    <input
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          onEnterKeyPressedForWaypoint(waypoint.id);
                                        }
                                      }}
                                      ref={waypointRefs[waypoint.id]}
                                      //onChange={(e) => handleInputChange(e, inputFieldId)}
                                      id={`input_${inputFieldId}`}
                                      type="text"
                                      value={waypointInputField?.address || ''}
                                      onChange={(e) => handleInputChange(e, `waypoint-${waypoint.id}`)}
                                      placeholder="Search by address, city, state, ZIP"
                                    />

                                  </Autocomplete>
                                </div>
                              )}
                            </Draggable>

                            <div className='drag-icon'>
                              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="1" y1="1" x2="19" y2="1" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                                <line x1="1" y1="9" x2="19" y2="9" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div className='clear-icon' onClick={() => handleClearIconClick(waypoint.id)}>
                              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14.8516" cy="14.8492" r="9.75" transform="rotate(45 14.8516 14.8492)" stroke="#5E6738" strokeWidth="1.5" />
                                <rect x="17.5781" y="11.2129" width="1.28571" height="9" transform="rotate(45 17.5781 11.2129)" fill="#5E6738" />
                                <rect x="11.2188" y="12.1211" width="1.28571" height="9" transform="rotate(-45 11.2188 12.1211)" fill="#5E6738" />
                              </svg>
                            </div>
                          </div>
                          )
                          })}
                        
                        <div className='second-input'>
                          <div className='end'>
                            <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" strokeWidth="1.5" />
                            </svg>
                          </div>
                          <Draggable key='destination' draggableId='destination' index={waypoints.length + 1}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Autocomplete
                                  onLoad={autocomplete => {
                                    autocomplete.setComponentRestrictions({
                                      country: 'us'
                                    });
                                    setAutocomplete3(autocomplete);
                                  }}
                                  onPlaceChanged={() => {
                                    if (autocomplete3) {
                                      const selectedPlace = autocomplete3.getPlace();
                                      onPlaceSelected(selectedPlace, 'destination');
                                    }
                                  }}
                                >
                                  <input
                                    id="alongEnd"
                                    type="text"
                                    placeholder="Search by address, city, state, ZIP"
                                    value={inputFields.find(field => field.type === 'destination')?.address || ''}
                                    ref={routeInputRef2}
                                    onChange={(e) => handleInputChange(e, 'destination')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        onEnterKeyPressed('destination');
                                      }
                                    }}
                                  />

                                </Autocomplete>
                              </div>
                            )}
                          </Draggable>

                          <div className='drag-icon'>
                            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="1" y1="1" x2="19" y2="1" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                              <line x1="1" y1="9" x2="19" y2="9" stroke="#5E6738" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

            </div>
          </div>

          <div
            style={{ opacity: (hasSearched) ? '1' : '0' }}
            className="list-scroller desktop"
          >
            <div className="nearby-schools-list">
            {sortedSchools.map((school) => {
              return (
                <div key={school.id} className="school-list">
                  <a href={`${school.uri}`}>
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
                        ).toFixed(2)}&nbsp;mi</span>&nbsp;·&nbsp;
                        <span className='address'>{school.address}</span>
                      </div>
                      <div className='hours'>{school.hours}</div>
                      <ul className='notes'><li>{school.notes}</li></ul>
                      <div className='button-wrap d-flex'>
                        <Button variant="primary">Schedule a Tour</Button>
                        <a href={`tel:${school.phone}`} className='phone ms-2'>
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738"/>
                        </svg>
                        </a>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
            </div>
          </div>
        </div>
        <div className={`google-map-container ${isMobile ? (!showMap || !hasSearched ? 'hidden' : '') : (hasSearched ? 'shift' : '')}`}>
          <GoogleMap
            center={mapCenter}
            zoom={zoomLevel}
            mapContainerStyle={containerStyle}
            onLoad={(map) => {
              mapRef.current = map;
              directionsRendererRef.current = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                preserveViewport: true
              });
              directionsRendererRef.current.setMap(map);
            }}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'all',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
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

            {start && showCurrentLocationPin && (
                <Marker
                    position={start}
                    icon={{
                        url: svgMarkerIconStart,
                        scaledSize: new google.maps.Size(25, 25),
                    }}
                />
            )}

            {waypoints && waypoints
              .filter((waypoint): waypoint is { id: number; location: Location } => waypoint.location !== null)
              .map((waypoint, index) => (
                <Marker
                  key={index}
                  position={waypoint.location} 
                  icon={{
                    url: svgMarkerIconStart,
                    scaledSize: new google.maps.Size(25, 25),
                  }}
                />
            ))}

            {destination && (
              <Marker
                position={destination}
                icon={{
                  url: svgMarkerIconEnd,
                  scaledSize: new google.maps.Size(25, 25),
                }}
              />
            )}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{ suppressMarkers: true }}
              />
            )}
          </GoogleMap>
        </div>
        <div
          style={{ opacity: (hasSearched) ? '1' : '0' }}
          className="list-scroller mobile"
        >
          <div className="nearby-schools-list">
            {sortedSchools.map((school) => (
              <div key={school.id} className="school-list">
                <a href={`${school.uri}`}>
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
                      ).toFixed(2)}&nbsp;mi</span>&nbsp;·&nbsp;
                      <span className='address'>{school.address}</span>
                    </div>
                    <div className='hours'>{school.hours}</div>
                    <ul className='notes'><li>{school.notes}</li></ul>
                    <div className='button-wrap d-flex'>
                      <Button variant="primary">Schedule a Tour</Button>
                      <a href={`tel:${school.phone}`} className='phone ms-2'>
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738"/>
                        </svg>
                      </a>
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