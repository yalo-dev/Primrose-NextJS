import { useMutation, gql } from "@apollo/client";

import { GfForm as GravityFormsFormType, FormField, FieldError } from "../generated/graphql";
import useGravityForm from "../hooks/useGravityForm";
import GravityFormsField from "./GravityFormsField";
import Router from 'next/router';

const SUBMIT_FORM = gql`
  mutation submitForm($formId: ID!, $fieldValues: [FormFieldValuesInput]!) {
    submitGfForm(input: {
      id: $formId
      fieldValues: $fieldValues
      saveAsDraft: false
    }) {
      confirmation {
      url 
      }
      entry {
      id
      }
      errors {
        id
        message
      }
    }
  }
`;

interface Props {
  form: GravityFormsFormType;
}

export default function GravityFormsForm({ form }: Props) {
  const [submitForm, { data, loading, error }] = useMutation(SUBMIT_FORM);
  const haveEntryId = Boolean(data?.submitGfForm?.entry?.id);
  const haveFieldErrors = Boolean(data?.submitGfForm?.errors?.length);
  const wasSuccessfullySubmitted = haveEntryId && !haveFieldErrors;
  //const defaultConfirmation = form.confirmations?.find(confirmation => confirmation?.isDefault);
  const formFields = form?.formFields?.nodes || [];
  const { state } = useGravityForm();

// state.forEach((fieldValue: any) => {
//   if (fieldValue.id === 11) {
//     fieldValue.value = schoolSlugInput;
//     console.log('fieldValue.value: ', fieldValue.value);
//   }
// }
// );
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    submitForm({
      variables: {
        formId: form.formId,
        fieldValues: state,
      }
    }).catch(error => {
      console.error(error);
    })
  }

  function getFieldErrors(id: number): FieldError[] {
    if (!haveFieldErrors) return [];
    return data.submitGfForm.errors.filter((error: FieldError) => error.id === id);
  }

  if (wasSuccessfullySubmitted) {
    Router.push('/schedule-a-tour-thank-you');
  }

  console.log('error ', data?.submitGfForm?.errors);
  console.log('state: ', state);
  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="heading-wrapper">              
        {form?.title ? <h1 className='heading green'>{form.title}</h1> : null}
        {form?.description ? <p className="desc b3">{form.description}</p> : null}
      </div>
      {formFields.map((field: FormField) => (
        <GravityFormsField
          key={field.id}
          field={field}
          fieldErrors={getFieldErrors(field.id)}
        />
      ))}
      {error ? (
        <p className="error-message">{error.message}</p>
      ) : null}
      <button type="submit" disabled={loading}>
        {form?.submitButton?.text || 'Submit'}
      </button>
    </form>
  );
}
