import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import Button from '../../atoms/Button/Button';
import {getSchools} from "../../../lib/schoolsData";

const containerStyle = {
  width: '100%',
  height: '350px'
};

type Location = {
  lat: number;
  lng: number;
};
const map_center = {
  lat: 39.8283,
  lng: -98.5795
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

const svgIcon = (index, color = '#5E6738', isHovered = false) => {
  const fillColor = isHovered ? '#FF9E1B' : color;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="39" height="48" viewBox="0 0 39 48" fill="none">
      <path d="M20.5628 44.0585L32.232 32.3417C32.2321 32.3416 32.2321 32.3416 32.2321 32.3416C39.256 25.29 39.2559 13.8431 32.2321 6.79113C25.2057 -0.263722 13.7943 -0.263744 6.76792 6.79113C-0.255928 13.8431 -0.256007 25.29 6.76788 32.3416C6.76791 32.3416 6.76793 32.3416 6.76796 32.3417L18.4372 44.0585L19.5 45.1257L20.5628 44.0585Z" fill="${fillColor}" stroke="white" stroke-width="3"/>
      <circle cx="19.5" cy="19.5" r="12" fill="#ffffff"/>
      <text x="19.5" y="25" font-family="Arial" font-size="14px" fill="#5E6738" text-anchor="middle">${index}</text>
    </svg>
  `;
};

const svgIconEnd = `
<svg width="34" height="39" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#FF9E1B" fill="#FF9E1B" stroke-width="1.5"/>
</svg>
`;

const svgIconStart = `
<svg width="12" height="12" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8.5" cy="9.34973" r="7.75" fill="none" stroke="#5E6738" stroke-width="1.5"/>
</svg>
`;


interface FindASchoolMapProps{
  title?: string;
  center?: any;
  place?: any;
  cta?:any;
}

const FindASchoolMap: React.FC<FindASchoolMapProps> = (props) => {
  let{
    title,
    center,
    place,
    cta
  } = props;
  cta = cta ?? {href:'schedule-a-tour', title:'Schedule a Tour'}

  const [autocomplete1, setAutocomplete1] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocomplete2, setAutocomplete2] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocomplete3, setAutocomplete3] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState(map_center);
  const [route, setRoute] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [showMap, setShowMap] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [searched, setSearched] = useState(false);
  const nearInputRef = useRef<HTMLInputElement>(null);
  const routeInputRef1 = useRef<HTMLInputElement>(null);
  const routeInputRef2 = useRef<HTMLInputElement>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  let geocoder;
  const [MAX_DISTANCE, set_MAX_DISTANCE] = useState<number>(2800);
  const DEFAULT_ZOOM = 11;
  const [hoveredSchoolId, setHoveredSchoolId] = useState<number | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [isAdded, setIsAdded] = useState(true);
  const [autocompleteInstances, setAutocompleteInstances] = useState({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [start, setStart] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const svgMarkerIconStart = `data:image/svg+xml;utf8,${encodeURIComponent(svgIconStart)}`;
  const svgMarkerIconEnd = `data:image/svg+xml;utf8,${encodeURIComponent(svgIconEnd)}`;
  const [waypointRefs, setWaypointRefs] = useState<Record<number, React.RefObject<HTMLInputElement>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showCurrentLocationPin, setShowCurrentLocationPin] = useState(true);
  const [schools, setSchools] = useState([]);
  const [inputFields, setInputFields] = useState<InputField[]>([
    { id: 'start', originalType: 'start', type: 'start', ref: routeInputRef1, autocomplete: null, location: null, address: '' },
    { id: 'destination', originalType: 'destination', type: 'destination', ref: routeInputRef2, autocomplete: null, location: null, address: ''  },
  ]);
  const defaultRouteProps = [
    { id: 'start', originalType: 'start', type: 'start', ref: routeInputRef1, autocomplete: null, location: null, address: '' },
    { id: 'destination', originalType: 'destination', type: 'destination', ref: routeInputRef2, autocomplete: null, location: null, address: ''  },
  ];
  //console.log(schools);
  useEffect(() =>{
    if(center !== undefined && center !== map_center){
      if(center?.latitude){
        center.lat = center.latitude;
        center.lng = center.longitude;
        setMapCenter(center);
        setSearched(true);
        set_MAX_DISTANCE(50)
      }
      setZoomLevel(DEFAULT_ZOOM);
    }

    if (nearInputRef.current) {
      nearInputRef.current.addEventListener("input", () => {
        if (nearInputRef.current && nearInputRef.current.value === "") {
          setSearched(false);
        }
      });
    }

    const hash = window.location.hash;
    if (hash === '#nearby') {
      setActiveTab(1);
      document.body.classList.remove('alongroute');
      // Additional setup for Tab 1
    } else if (hash === '#alongroute') {
      setActiveTab(2);
      document.body.classList.add('alongroute');
      // Additional setup for Tab 2
    }

    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (nearInputRef.current) {
        nearInputRef.current.removeEventListener("input", () => { });
      }
      window.removeEventListener('resize', handleResize);
    };
  },[]);
  useEffect(() => {
  getSchools()
    .then((result) =>{
        setSchools(result);
        setLoading(false);
        onPlaceSelected(place);
    })
  }, [place]);

  useEffect(() => {
    onPlaceSelected(place);
  }, [place, nearInputRef]);

  useEffect(()=>{
    window.onresize = setMapScrollerHeight;
    setMapScrollerHeight();
    function setMapScrollerHeight(){
      var scroller = document.getElementById('school-list-scroller');
      if(scroller && scroller.offsetHeight){
        scroller.style.transition = 'none';
        var map = document.getElementById('map');
        var scrollerParent = scroller.offsetParent as HTMLElement;
        scroller.style.height = map.offsetHeight - (scroller.offsetTop + scrollerParent.offsetTop) + "px";
      }
    }
  }, [window])
  useEffect(() => {
    renderRoute();
  }, [start, waypoints, destination]);

  const handleAutocompleteLoad = (key, autocomplete) => {
    setAutocompleteInstances(prev => ({
      ...prev,
      [key]: autocomplete
    }));
  };
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
    const googleMapsNotLoaded = (!window.google || !window.google.maps)
    const startLocationNotFormatted = (!start || (typeof start !== 'string' && (typeof start !== 'object' || !start.lat || !start.lng)))
    const destinationNotDefined = (!destination || (typeof destination !== 'string' && (typeof destination !== 'object' || !destination.lat || !destination.lng)))
    if (googleMapsNotLoaded || startLocationNotFormatted || destinationNotDefined) return

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
        let routeBounds = directionsRendererRef.current.getDirections().routes[0].bounds;
        let routeCenter = {lng: routeBounds.getCenter().lng(), lat:routeBounds.getCenter().lat()};
        setMapCenter(routeCenter);
        setRoute(result);
      } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
        //console.log("No route could be found between the origin and destination.");
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

  function getSortedSchools(schools){
    if(!schools || !searched){
      return [];
    }else{
    const filteredSchools = schools.filter(school => {
      const distance = calculateDistance(
        mapCenter.lat,
        mapCenter.lng,
        school.coordinates?.lat,
        school.coordinates?.lng
      );
      return distance <= MAX_DISTANCE;
    });
    
    const sortedSchools = [...filteredSchools].map((school) => {
      let dist
      if(activeTab === 2 && route!= null){
        let path_points = route.routes[0].overview_path;
        let distances = path_points.map((point)=>{
          return(calculateDistance(point.lat(), point.lng(), school.coordinates.lat, school.coordinates.lng));
        });
        dist = Math.min.apply(Math,distances);
      }else{
        dist = calculateDistance(mapCenter.lat, mapCenter.lng, school.coordinates.lat, school.coordinates.lng);
      }
      
      return { ...school, distance: dist };
    }).sort((a, b) => a.distance - b.distance)
      .map((school, index) => ({ ...school, index: index + 1 }));
      //console.log('sortedSchools');
      return(sortedSchools);
    }
  }
  function onPlaceSelected(place, type = 'text') {
    if (place && place.geometry && place.geometry.location) {
      let newMapCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      if(route!=null){
        let routeCenter = {lat:route.routes[0].bounds.getCenter().lat, lng: route.routes[0].bounds.getCenter().lng} ;
        setMapCenter(routeCenter);
      }else{
        setMapCenter(newMapCenter);
      }
      
      setZoomLevel(11);
      set_MAX_DISTANCE(50);
      setHasSearched(true);
      setShowMap(true);
      setSearched(true);
      const formattedPlaceName = place.name && place.formatted_address ? `${place.name}, ${place.formatted_address}` : place.formatted_address;

      setInputFields(prevFields =>
        prevFields.map(field => {
          if (field.type === type) {
            return { ...field, location: newMapCenter, address: formattedPlaceName };
          }
          return field;
        })
      );
            
      
      if (type === 'start') {
        setStart(newMapCenter);
      } else if (type === 'destination') {
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
  }

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
          //console.log('Invalid input type');
          return;
      }

      if (!inputRef.current || !inputRef.current.value) {
        //console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Input reference is not available or input is empty`);
        return;
      }

      inputValue = inputRef.current.value;
      //console.log('Input value:', inputValue);

      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions({
        input: inputValue,
        componentRestrictions: { country: 'us' },
      },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            //console.log('Error: ' + status);
            return;
          }

          if (!predictions || predictions.length === 0) {
            //console.log('No predictions found');
            return;
          }

          const placesService = new google.maps.places.PlacesService(map);
          placesService.getDetails({ placeId: predictions[0].place_id }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              //console.log('Calling onPlaceSelected with location type:', type);
              onPlaceSelected(place, type);
              if (inputRef.current) {
                inputRef.current.value = predictions[0].description;
              }
            } else {
              //console.log('Error getting place details: ' + status);
            }
            return place;
          }
          );
        });
    } else {
      //console.log('Map reference is not available');
    }
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    setHasSearched(false);
    setSearched(false);
    setShowMap(false);
    setIsAdded(false);
    setZoomLevel(5);
    setRoute(null);
    setInputFields(defaultRouteProps as InputField[]);
    if (tabIndex === 1) {
      window.location.hash = 'nearby';
      document.body.classList.remove('alongroute');
    } else if (tabIndex === 2) {
      window.location.hash = 'alongroute';
      document.body.classList.add('alongroute');
    }

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }

    setHoveredSchoolId(null);

    if (nearInputRef.current) nearInputRef.current.value = '';
    routeInputRef1.current.value = '';
    routeInputRef2.current.value = '';
    setWaypoints([]);

    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(5);
    }

    Object.values(waypointRefs).forEach(ref => {
      if (ref && ref.current) ref.current.value = '';
    });

    setDirections(null);
    setStart(null);
    setDestination(null);
  };

  const handleMarkerClick = (schoolId) =>{
    var scroller = document.getElementById('school-list-scroller');
    scroller.scrollTop = document.getElementById(schoolId).offsetTop;
    //console.log(document.getElementById(schoolId).offsetTop);
    if(window.innerWidth < 991){
      window.scroll(0, document.getElementById("mobile_"+schoolId).offsetTop);
      //console.log(document.getElementById(schoolId))
    }
  }

  if (loading) return <p></p>;
  if (error) return <div className='container pt-5 pb-5'>Error: {error}</div>;

  return (
    <div id="map" className={'find-a-school-container ' + (title? 'title': '')}>
      {title && (
        <div className="map-title">
          <h3>{title}</h3>
        </div>
      )}
      
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
                
                <div>
                  <div >
                      <div className={`input-wrapper ${isAdded ? 'added' : ''}`}>

                        <div className='first-input'>
                          <div className='start'>
                          </div>
                          <div key='start'>
                              <div >
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
                                    onChange={(e) => handleInputChange(e, 'start')}
                                    />


                                </Autocomplete>
                              </div>
                          </div>
                          <div className='location-icon' style={{ opacity: searched ? '0' : '1' }} onClick={handleLocationIconClick}>
                            <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" stroke="#555F68" strokeWidth="1.5" />
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
                            <div key={waypoint.id}>
                                <div>
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
                          <div key='destination' >
                              <div>
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
                          </div>

                          
                        </div>

                      </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div
            id="school-list-scroller"
            style={{ opacity: (hasSearched) ? '1' : '0' }}
            className="list-scroller desktop"
          >
            <div className="nearby-schools-list">
              {getSortedSchools(schools).map((school, index) => (
                <div key={index} className="school-list" id={school.id}>
                  <a href={`${school.uri}`}>

                    <div
                      key={index}
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
                        ).toFixed(2)}&nbsp;mi &nbsp;·&nbsp;</span>
                        <span className='address'>{school.address}</span>
                      </div>
                      <div className='hours'>{school.hours}</div>
                      {/* <ul className='notes'><li>{school.notes}</li></ul> */}
                      <ul className='options'>
                        {school.preopening && (
                          <li className="text-capitalize">Opening {school.openingInSeason} {school.openingInYear}</li>
                        )}
                        {school.corporateChildcare && (
                          <li>Corporate Child Care</li>
                        )}
                      </ul>
                      <div className='button-wrap d-flex'>
                          <Button
                            className="button primary"
                            href={"/schools/" + school.slug + "/" + cta.href}
                          >
                            {cta.title}
                          </Button>
                          <a href={`tel:${school.phone}`} className='phone ms-2'>
                            <svg className="me-2" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738" />
                            </svg>
                            {school.phone}
                          </a>
                        </div>
                    </div>
                  </a>
                </div>
              ))}
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
            {getSortedSchools(schools).map((school, index) => (
              <Marker
                key={index}
                options={{optimized: false}}
                position={school.coordinates}
                icon={{
                  url: `data:image/svg+xml,${encodeURIComponent(svgIcon(school.index, '#5E6738', school.id === hoveredSchoolId))}`,
                }}
                onMouseOver={() => setHoveredSchoolId(school.id)}
                onMouseOut={() => setHoveredSchoolId(null)}
                onClick={() => handleMarkerClick(school.id)}
              />
            ))}

            {start && showCurrentLocationPin && (
                <Marker
                    position={start}
                    icon={{
                        url: svgMarkerIconStart,
                        scaledSize: new google.maps.Size(16, 16),
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
                    scaledSize: new google.maps.Size(16, 16),
                  }}
                />
            ))}

            {destination && (
              <Marker
                position={destination}
                icon={{
                  url: svgMarkerIconEnd,
                  scaledSize: new google.maps.Size(20, 25),
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
            {getSortedSchools(schools).map((school, index) => (
              <div key={index} className="school-list" id={`mobile_${school.id}`}>
                <a href={`${school.uri}`}>

                  <div
                    key={index}
                    
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
                    {/* <ul className='notes'><li>{school.notes}</li></ul> */}
                    {school.notes && (
                            <ul className='notes'>
                              {school.notes.split(', ').map((note, noteIndex) => (
                                  <li key={noteIndex}>{note}</li>
                              ))}
                            </ul>
                        )}
                      <ul className='options'>
                        {school.preopening && (
                          <li className="text-capitalize">Opening {school.openingInSeason} {school.openingInYear}</li>
                        )}
                        {school.corporateChildcare && (
                          <li>Corporate Child Care</li>
                        )}
                      </ul>
                    <div className='button-wrap d-flex'>
                            <Button
                            className="button primary"
                            href={"/schools/" + school.slug + "/" + cta.href}
                          >
                            {cta.title}
                          </Button>
                          <a href={`tel:${school.phone}`} className='phone ms-2'>
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738" />
                            </svg>
                          </a>
                        </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default FindASchoolMap;