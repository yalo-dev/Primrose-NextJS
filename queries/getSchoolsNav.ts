import { gql, useQuery } from "@apollo/client";

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

export default function getSchoolsNav(schoolSlug) {
  const { data } = useQuery(GET_SCHOOL_DETAILS, {
    variables: { id: schoolSlug },
  });

  return data;
}
