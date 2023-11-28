import { gql } from "@apollo/client";
import { GfForm } from "../generated/graphql";

import { client } from "../app/lib/apollo";
import { PHONE_FIELD_FIELDS } from "../components/GravityFormsFields/PhoneField";
import { RADIO_FIELD_FIELDS } from "../components/GravityFormsFields/RadioField";
import { TEXT_FIELD_FIELDS } from "../components/GravityFormsFields/TextField";
import { SELECT_FIELD_FIELDS } from "../components/GravityFormsFields/SelectField";

const GET_FORM = gql`
  query getForm($formId: ID!) {
    gfForm(id: $formId, idType: DATABASE_ID) {
      formId
      title
      description
      submitButton {
        text
      }
      confirmations {
        isDefault
        message
      }
      formFields(first: 50) {
        nodes {
          id
          type
          ... on PhoneField {
            ...PhoneFieldFields
          }
          ... on RadioField {
            ...RadioFieldFields
          }
          ... on TextField {
            ...TextFieldFields
          }
          ... on SelectField {
            ...SelectFieldFields
          }
        }
      }
    }
  }
  ${PHONE_FIELD_FIELDS}
  ${RADIO_FIELD_FIELDS}
  ${TEXT_FIELD_FIELDS}
  ${SELECT_FIELD_FIELDS}
`;

export default async function getGravityForm(formId: number): Promise<GfForm | undefined> {
  const result = await client
    .query({
      query: GET_FORM,
      variables: { formId },
    });

  return result?.data?.gfForm; // Changed 'gravityFormsForm' to 'gfForm' to match the query
  
}
