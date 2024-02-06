import React, { useState, useRef, useEffect } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';
import SchoolData from '../../../../app/data/schoolsData';

interface School {
    id: any;
    slug: string,
    uri: string, 
    name: string;
    address: string;
    hours: string;
    notes: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    distance?: string;
}

interface HomeHeroWithVideoProps {
    leftColumn: {
        heading?: string;
        headingColor?: string;
        subheading?: string;
        subheadingColor?: string;
    };
    rightColumn: {
        videoOrImage?: string;
        video?: {
            url?: string;
        };
        image?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
    switchColumnOrderOnDesktop?: boolean;
    centerModule?: boolean;
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        backgroundColor?: string;
    };
}

const loadGoogleMapsScript = (callback) => {
    if (window.google) {
        callback();
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => callback();
    document.head.appendChild(script);
};

const HomeHeroWithVideo: React.FC<HomeHeroWithVideoProps> = ({ switchColumnOrderOnDesktop, centerModule, leftColumn, rightColumn, customizations }) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [nearestSchool, setNearestSchool] = useState<any>(null);
    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [nearestSchoolInfoClass, setNearestSchoolInfoClass] = useState('');
    const [searchFieldClass, setSearchFieldClass] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceInKm = R * c; 
        const distanceInMiles = distanceInKm * 0.621371; 
        return distanceInMiles;
    };
    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const enableLocationServices = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLoc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(userLoc);
                    const nearest = findNearestSchool(userLoc);
                    setNearestSchool(nearest);
                    setLocationServicesEnabled(true);
                },
                (error) => {
                    console.error("Error enabling location services:", error);
                    setLocationServicesEnabled(false);
                    setIsModalOpen(true);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            setLocationServicesEnabled(false);
        }
    };
    useEffect(() => {
        enableLocationServices();
    }, []);

    const findNearestSchool = (userLoc) => {
        let nearestSchool: School | null = null;
        let minDistance = Infinity;

        SchoolData.forEach((school) => {
            const distance = calculateDistance(userLoc.lat, userLoc.lng, school.coordinates.lat, school.coordinates.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSchool = { ...school, distance: distance.toFixed(2) };
            }
        });

        if (nearestSchool) {
            setNearestSchoolInfoClass('nearest-school-found');
            setSearchFieldClass('search-field-active');
        } else {
            setNearestSchoolInfoClass('');
            setSearchFieldClass('');
        }

        return nearestSchool;
    };

    useEffect(() => {
        console.log("Nearest School State in useEffect:", nearestSchool);
    }, [nearestSchool]);

    useEffect(() => {
        enableLocationServices();
        loadGoogleMapsScript(() => {
            if (searchInputRef.current) {
                autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current);
                autocompleteRef.current.addListener("place_changed", () => {
                    const place = autocompleteRef.current?.getPlace();
                    if (place && place.geometry) {
                        const fullAddress = `${place.name}, ${place.formatted_address}`;
                        handleAddressSearch(fullAddress);
                    }
                });

            }
        });
    }, []);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchInput = searchInputRef.current ? searchInputRef.current.value : '';
            if (searchInput) {
                handleAddressSearch(searchInput);
            }
        }
    };

    const geocodeAddress = async (address) => {
        console.log("Geocoding Address:", address);
        return new Promise((resolve, reject) => {
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, (results, status) => {
                if (status === 'OK' && results) {
                    const location = results[0].geometry.location;
                    resolve({ lat: location.lat(), lng: location.lng() });
                } else {
                    reject("Geocode was not successful for the following reason: " + status);
                }
            });
        });
    };

    const handleAddressSearch = async (address) => {
        try {
            const location = await geocodeAddress(address);
            if (location) {
                const nearest = findNearestSchool(location);
                setNearestSchool(nearest);
                setInputValue(address);
            }
        } catch (error) {
            console.error('Error in handleAddressSearch:', error);
        }
    };

    return (
        <>
            {isModalOpen && (
                <div className="hp-popup-modal open">
                    <button onClick={() => setIsModalOpen(false)}>X</button>
                    <div>User denied geolocation. Please allow access to your location in your browser settings to find the nearest school to your current location.</div>
                </div>
            )}

            <div className="container">
                <Customizations
                    topPaddingMobile={customizations?.topPaddingMobile}
                    topPaddingDesktop={customizations?.topPaddingDesktop}
                    bottomPaddingMobile={customizations?.bottomPaddingMobile}
                    bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                    colorLabel={customizations?.backgroundColor}
                >
                    <div className={`home-hero-with-video ${switchColumnOrderOnDesktop ? 'reverse-column' : ''} ${centerModule ? 'center-module' : ''}`}>
                        <div className='left-column col-12 col-lg-6'>
                            <div className='heading-wrapper d-none d-lg-block pt-5'>
                                {leftColumn.heading && <Heading level='h1' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
                                {leftColumn.subheading && <Subheading level='h5' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                            </div>
                            <div className={`find-a-location-hero ${searchFieldClass} ${locationServicesEnabled ? '' : 'location-disabled'}`}>
                                <h5 className='heading'>
                                    <span className='pin-icon me-2'>
                                        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.63493 2.66732C-0.878309 6.224 -0.878309 11.9993 2.63493 15.5557L9 22L15.3651 15.5557C18.8783 11.9993 18.8783 6.224 15.3651 2.66732C11.8523 -0.889107 6.14769 -0.889107 2.63493 2.66732ZM9.12 12.9556C11.2406 12.9556 12.9599 11.2045 12.9599 9.04447C12.9599 6.88442 11.2406 5.13335 9.12 5.13335C6.9994 5.13335 5.28005 6.88442 5.28005 9.04447C5.28005 11.2045 6.9994 12.9556 9.12 12.9556Z" fill="#FF9E1B" />
                                        </svg>
                                    </span>Find a School Near You
                                </h5>
                                <div className={`search-field  ${locationServicesEnabled ? 'location-enabled' : ''}`}>
                                    <input
                                        type="search"
                                        placeholder='Search by address, city, state, ZIP'
                                        value={inputValue}
                                        onChange={(e) => {
                                            console.log("OnChange Value:", e.target.value);
                                            setInputValue(e.target.value);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        ref={searchInputRef}
                                    />
                                    <span className='icon location-icon me-2' onClick={enableLocationServices}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M4.05454 4.20281C-0.164013 8.47353 -0.164013 15.4082 4.05454 19.6786L11.6975 27.4167L19.3404 19.6786C23.5589 15.4082 23.5589 8.47353 19.3404 4.20281C15.1224 -0.0676034 8.27253 -0.0676034 4.05454 4.20281ZM11.8415 16.5565C14.3879 16.5565 16.4524 14.4539 16.4524 11.8602C16.4524 9.26653 14.3879 7.16391 11.8415 7.16391C9.29522 7.16391 7.23069 9.26653 7.23069 11.8602C7.23069 14.4539 9.29522 16.5565 11.8415 16.5565Z" stroke="#555F68" strokeWidth="1.5" />
                                        </svg>
                                    </span>
                                    <span className='icon search-icon'
                                        onClick={() => {
                                            const searchInput = searchInputRef.current;
                                            if (searchInput && searchInput.value) {
                                                handleAddressSearch(searchInput.value);
                                            }
                                        }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                            <circle cx="21.2344" cy="21.5" r="21" fill="#5E6738" />
                                            <circle cx="20.3959" cy="19.8178" r="7.06" stroke="white" />
                                            <path d="M24.7656 25.2773L29.9883 30.5001" stroke="white" />
                                        </svg>
                                    </span>
                                    <Button
                                        className='primary'
                                        onClick={() => {
                                            const searchInput = searchInputRef.current;
                                            if (searchInput && searchInput.value) {
                                                handleAddressSearch(searchInput.value);
                                            }
                                        }}
                                    >Search</Button>

                                </div>
                                <div className='link'>
                                    <span className='icon me-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.25 21C15.9109 21 20.5 16.4109 20.5 10.75C20.5 5.08908 15.9109 0.5 10.25 0.5C4.58908 0.5 0 5.08908 0 10.75C0 16.4109 4.58908 21 10.25 21ZM9.61719 6.35938H10.8723V10.1199H14.6373V11.375H10.8723V15.1451H9.61719V11.375H5.85156V10.1199H9.61719V6.35938Z" fill="#555F68" />
                                        </svg>
                                    </span><a href='/find-a-school#alongroute'>Search Along Route</a>
                                </div>
                            </div>
                            <div className={`nearest-school-info ${nearestSchoolInfoClass}`}>
                                {nearestSchool && (
                                    <>
                                        <div className='name-wrapper d-flex justify-content-between'>
                                            <a href={nearestSchool.uri} className='name'><h5>{nearestSchool.name}</h5></a>
                                            <div className='icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="#555F68" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='b2 pb-2'>{nearestSchool.distance} mi · {nearestSchool.address}</div>
                                        <p className='hours'>{nearestSchool.hours}</p>
                                        <div className='phone-wrapper'>
                                            <div className='b2'><Button className='primary me-2' href={`/school/${nearestSchool.slug}/schedule-a-tour`}>Schedule a Tour</Button>
                                                <a href={`tel:${nearestSchool.phone}`} className='phone'>
                                                    <span className='me-2'>
                                                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="25" cy="25" r="24.5" fill="white" stroke="#DFE2D3" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z" stroke="#5E6738" />
                                                        </svg>
                                                    </span>
                                                    <span className='d-none d-lg-inline'>{nearestSchool.phone}</span>
                                                </a>
                                            </div>
                                        </div>
                                        <a className='green underline pt-4 d-block' href='/find-a-school'>View all locations nearest you</a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='right-column col-12 col-lg-6'>
                            <div className='heading-wrapper d-block d-lg-none'>
                                {leftColumn.heading && <Heading level='h1' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
                                {leftColumn.subheading && <Subheading level='h5' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                            </div>
                            {rightColumn.videoOrImage === "Video" && rightColumn.video?.url && (
                                <div className='video-wrapper'>
                                    <video
                                        ref={videoRef}
                                        src={rightColumn.video.url}
                                        autoPlay
                                        muted
                                        loop
                                    />
                                </div>
                            )}

                            {rightColumn.videoOrImage === "Image" && rightColumn.image?.sourceUrl && (
                                <div className='image-wrapper mb-4 mb-lg-0'>
                                    <img
                                        src={rightColumn.image?.sourceUrl}
                                        alt={rightColumn.image?.altText}
                                    />
                                </div>
                            )}
                        </div>


                    </div>
                </Customizations>
            </div>
        </>
    );
}

export default HomeHeroWithVideo;
