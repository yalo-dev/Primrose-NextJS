import { useJsApiLoader } from "@react-google-maps/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MapSearch from "../app/components/modules/MapSearch/MapSearch";
import { GOOGLE_MAP_LIBRARIES } from "../constants/google-maps";
import getSchoolsOverview from "../queries/getSchoolsOverview";

export async function getStaticProps() {
  const schoolsOverview = await getSchoolsOverview();
  return {
    props: { schoolsOverview },
    revalidate: 600,
  };
}

const FindASchool = ({ schoolsOverview }) => {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  let geocoder = null;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
    libraries: GOOGLE_MAP_LIBRARIES,
  });
  const geocodeSearchTerm = async (searchTerm: string) => {
    //console.log(searchTerm);
    if (geocoder) {
      geocoder.geocode({ address: searchTerm }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          //console.log(results[0]);
          setPlace(results[0]);
          return results[0];
        } else {
          return null;
        }
      });
    }
  };
  useEffect(() => {
    if (!geocoder && isLoaded) {
      geocoder = new window.google.maps.Geocoder();
    }
    if (router.query) {
      if (router.query.latitude && router.query.longitude) {
        setCenter({
          latitude: Number(router.query.latitude),
          longitude: Number(router.query.longitude),
        });
      }

      geocodeSearchTerm(router.query.search_string as string).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isLoaded]);

  if (!loading) {
    let fas_props: any = {
      place: place,
      schoolsOverview,
    };
    if (center !== null) {
      fas_props = {
        center: center,
        place: place,
      };
    }

    return (
      <>
        <Head>
          <title>Find a Primrose School Near You</title>
          <meta
            name={"description"}
            content={`View all the different Primrose School locations and find the best infant care, preschool program or private kindergarten classroom nearest to you.`}
          />
        </Head>
        <MapSearch {...fas_props} />
      </>
    );
  }
};

export default FindASchool;
