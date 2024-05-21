import { gql } from "@apollo/client";
import { client } from "../app/lib/apollo";

export interface School {
  id: any;
  uri: string;
  slug: string;
  name: string;
  address: string;
  hours: string;
  notes: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default async function getSchoolsOverview() {
  const GET_SCHOOLS = gql`
    query GetSchools {
      schools(first: 1000) {
        nodes {
          id
          slug
          uri
          title
          schoolAdminSettings {
            hoursOfOperation {
              closingTime
              openingTime
            }
          }
          schoolCorporateSettings {
            schoolOfAtOn
            phoneNumber
            address {
              streetAddress
              streetAddress2
              zipcode
              state
              city
              googlePlaceUrl
              latitude
              longitude
            }
            preopening
            openingIn {
              fieldGroupName
              season
              year
            }
            corporateChildcare
          }
        }
      }
    }
  `;

  const response = await client.query({ query: GET_SCHOOLS });
  const schoolsArray = response?.data?.schools?.nodes;

  const _schools = [];
  schoolsArray.map((school, index) => {
    if (school.schoolCorporateSettings.address) {
      let schoolAddress =
        school.schoolCorporateSettings.address.streetAddress +
        " " +
        school.schoolCorporateSettings.address.city +
        ", " +
        school.schoolCorporateSettings.address.state +
        "  " +
        school.schoolCorporateSettings.address.zipcode;
      let hours = "";
      if (school.schoolAdminSettings?.hoursOfOperation?.openingTime) {
        hours = `M-F ${school.schoolAdminSettings.hoursOfOperation.openingTime}-${school.schoolAdminSettings.hoursOfOperation.closingTime}`;
      }
      _schools.push({
        id: school.id,
        slug: school.slug,
        uri: school.uri,
        name:
          "Primrose School " +
          school.schoolCorporateSettings.schoolOfAtOn +
          " " +
          school.title,
        address: schoolAddress,
        hours: hours,
        phone: school.schoolCorporateSettings?.phoneNumber,
        preopening: school.schoolCorporateSettings?.preopening,
        openingInSeason: school.schoolCorporateSettings?.openingIn?.season,
        openingInYear: school.schoolCorporateSettings?.openingIn?.year,
        corporateChildcare: school.schoolCorporateSettings?.corporateChildcare,
        coordinates: {
          lat: school.schoolCorporateSettings.address.latitude,
          lng: school.schoolCorporateSettings.address.longitude,
        },
      });
    }
  });

  return _schools;
}
