import MapSearch from '../app/components/modules/MapSearch/MapSearch';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useJsApiLoader} from '@react-google-maps/api';


const FindASchool = () =>{
  const router = useRouter();
  const {query} = router.query;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({
    lat: 39.8283,
    lng: -98.5795
  });
  let geocoder = null;
  
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
    libraries: ['places'],
});
  const geocodeSearchTerm = async (searchTerm: string) => {
    console.log(searchTerm);
    if (geocoder) {
      geocoder.geocode({'address': searchTerm}, (results, status) => {
          if (status === 'OK' && results && results[0]) {
              console.log(results[0]);
              setPlace(results[0]);
              return results[0];
              setLoading(false);
          } else {
              return null;
              setPlace(null);
              setLoading(false);
          }
      });
    }
  }
  useEffect(() => {
    if (!geocoder) {
        geocoder = new window.google.maps.Geocoder();
    }
    if(router.query){
      console.log('running search');
      if(router.query.latitude && router.query.longitude){
        setCenter({lat: Number(router.query.latitude), lng: Number(router.query.longitude)})
      }
      geocodeSearchTerm(router.query.search_string as string).then(()=>{
        console.log(place);
        
        setLoading(false);
      });  
    }else{
      setLoading(false);
    }
  }, [isLoaded]);
  
    if(!loading){
      console.log(center);
      let fas_props:any = {
        place: place,
        }
        if(center){
    
          fas_props = {
            center: center,
            place:place,
          }
        }
        console.log(fas_props);
      return (
        <MapSearch {...fas_props} />
      );
    }
}
  

export default FindASchool;