import { useJsApiLoader } from "@react-google-maps/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { GOOGLE_MAP_LIBRARIES } from "../../../../constants/google-maps";
import { School } from "../../../../generated/graphql";
import { SchoolsContext } from "../../../../pages";
import getSchoolsOverview from "../../../../queries/getSchoolsOverview";
import Button from "../../atoms/Button/Button";

export default function GoogleMapForm({
  setUserLocation,
  setNearestSchool,
  setNearestSchoolInfoClass,
  setSearchAddress,
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
    libraries: GOOGLE_MAP_LIBRARIES,
  });
  const router = useRouter();
  const schoolsOverview = useContext(SchoolsContext);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [searchFieldClass, setSearchFieldClass] = useState("");
  const [inputValue, setInputValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [schoolData, setSchoolData] = useState(schoolsOverview);

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        if (!schoolData) {
          getSchoolsOverview().then((result) => {
            setSchoolData(result);
          });
        }
        enableLocationServices();
      } else {
        setLocationServicesEnabled(false);
      }
    });
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    const distanceInMiles = distanceInKm * 0.621371;
    return distanceInMiles;
  };
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const enableLocationServices = () => {
    if (schoolData.length > 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          const nearest = findNearestSchool(userLoc);
          setNearestSchool(nearest);
          setLocationServicesEnabled(true);
        },
        (error) => {
          console.error("Error getting user location", error);
          setLocationServicesEnabled(false);
        },
      );
    } else {
      setLocationServicesEnabled(false);
    }
  };
  const findNearestSchool = (userLoc) => {
    let nearestSchool: School | null = null;
    let minDistance = Infinity;
    schoolData.forEach((school) => {
      const distance = calculateDistance(
        userLoc.lat,
        userLoc.lng,
        school.coordinates.lat,
        school.coordinates.lng,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestSchool = { ...school, distance: distance.toFixed(2) };
      }
    });

    if (nearestSchool) {
      setNearestSchoolInfoClass("nearest-school-found");
      setSearchFieldClass("search-field-active");
    } else {
      setNearestSchoolInfoClass("");
      setSearchFieldClass("");
    }

    return nearestSchool;
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      router.push(
        `/find-a-school${searchInputRef.current?.value && `?query=${searchInputRef.current?.value}`}`,
      );
    }
  };

  useEffect(() => {
    if (searchInputRef.current && isLoaded) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
      );
      autocompleteRef.current.addListener("place_changed", () => {
        router.push(
          `/find-a-school${searchInputRef.current?.value && `?query=${searchInputRef.current?.value}`}`,
        );
      });
    }
  }, [searchInputRef.current]);

  return (
    <div
      className={`find-a-location-hero ${searchFieldClass} ${locationServicesEnabled ? "" : "location-disabled"}`}
    >
      <h5 className="heading">
        <span className="pin-icon me-2">
          <svg
            width="18"
            height="22"
            viewBox="0 0 18 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.63493 2.66732C-0.878309 6.224 -0.878309 11.9993 2.63493 15.5557L9 22L15.3651 15.5557C18.8783 11.9993 18.8783 6.224 15.3651 2.66732C11.8523 -0.889107 6.14769 -0.889107 2.63493 2.66732ZM9.12 12.9556C11.2406 12.9556 12.9599 11.2045 12.9599 9.04447C12.9599 6.88442 11.2406 5.13335 9.12 5.13335C6.9994 5.13335 5.28005 6.88442 5.28005 9.04447C5.28005 11.2045 6.9994 12.9556 9.12 12.9556Z"
              fill="#FF9E1B"
            />
          </svg>
        </span>
        Find a School Near You
      </h5>
      <div
        className={`search-field  ${locationServicesEnabled ? "location-enabled" : ""}`}
      >
        <input
          type="search"
          placeholder="Search by address, city, state, ZIP"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
        />
        <span
          className="icon location-icon me-2"
          onClick={enableLocationServices}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="29"
            viewBox="0 0 24 29"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.05454 4.20281C-0.164013 8.47353 -0.164013 15.4082 4.05454 19.6786L11.6975 27.4167L19.3404 19.6786C23.5589 15.4082 23.5589 8.47353 19.3404 4.20281C15.1224 -0.0676034 8.27253 -0.0676034 4.05454 4.20281ZM11.8415 16.5565C14.3879 16.5565 16.4524 14.4539 16.4524 11.8602C16.4524 9.26653 14.3879 7.16391 11.8415 7.16391C9.29522 7.16391 7.23069 9.26653 7.23069 11.8602C7.23069 14.4539 9.29522 16.5565 11.8415 16.5565Z"
              stroke="#555F68"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <Link
          href={`/find-a-school${searchInputRef.current?.value && `?query=${searchInputRef.current?.value}`}`}
          className="icon search-icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="43"
            viewBox="0 0 43 43"
            fill="none"
          >
            <circle cx="21.2344" cy="21.5" r="21" fill="#5E6738" />
            <circle cx="20.3959" cy="19.8178" r="7.06" stroke="white" />
            <path d="M24.7656 25.2773L29.9883 30.5001" stroke="white" />
          </svg>
        </Link>
        <Button
          href={`/find-a-school${searchInputRef.current?.value && `?query=${searchInputRef.current?.value}`}`}
          className="primary"
        >
          Search
        </Button>
      </div>
      <div className="link">
        <span className="icon me-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.25 21C15.9109 21 20.5 16.4109 20.5 10.75C20.5 5.08908 15.9109 0.5 10.25 0.5C4.58908 0.5 0 5.08908 0 10.75C0 16.4109 4.58908 21 10.25 21ZM9.61719 6.35938H10.8723V10.1199H14.6373V11.375H10.8723V15.1451H9.61719V11.375H5.85156V10.1199H9.61719V6.35938Z"
              fill="#555F68"
            />
          </svg>
        </span>
        <a href="/find-a-school#alongroute">Search Along Route</a>
      </div>
    </div>
  );
}
