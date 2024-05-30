import { gql } from "@apollo/client";
import { client } from "../app/lib/apollo";

const GET_SCHOOL_DETAILS = gql`
  query GetSchoolDetails($id: ID!) {
    school(id: $id, idType: URI) {
      id
      slug
      uri
      title
      schoolCorporateSettings {
        usesCalendly
        schoolOfAtOn
        phoneNumber
        address {
          googlePlaceUrl
        }
      }
      schoolAdminSettings {
        classroomsOffered
        extraCareOffered
        staffMembers {
          name
        }
      }
    }
  }
`;

export default async function getSchoolsNav(schoolSlug) {
  const { data } = await client.query({
    query: GET_SCHOOL_DETAILS,
    variables: { id: schoolSlug },
  });

  return data;
}
