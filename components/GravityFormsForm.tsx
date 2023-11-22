import { useMutation, gql } from "@apollo/client";

import { GfForm as GravityFormsFormType, FormField, FieldError } from "../generated/graphql";
import useGravityForm from "../hooks/useGravityForm";
import GravityFormsField from "./GravityFormsField";

const SUBMIT_FORM = gql`
  mutation submitForm($formId: ID!, $fieldValues: [FormFieldValuesInput]!) {
    submitGfForm(input: {
      id: $formId
      fieldValues: $fieldValues
      saveAsDraft: false
    }) {
      confirmation {
      type    
      message 
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
    return <p>{'Form successfully submitted - thank you.'}</p>
  }

  console.log('form: ', form?.formFields?.nodes);
  console.log('state: ', state);
  return (
    <form method="post" onSubmit={handleSubmit}>
      {form?.title ? <h2>{form.title}</h2> : null}
      {form?.description ? <p>{form.description}</p> : null}
      
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
