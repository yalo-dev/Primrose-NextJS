import { useMutation, gql } from "@apollo/client";
import useSessionStorage from "../hooks/useSessionStorage";
import { GfForm as GravityFormsFormType, FormField, FieldError } from "../generated/graphql";
import useGravityForm from "../hooks/useGravityForm";
import GravityFormsField from "./GravityFormsField";
import Router from 'next/router';
import {useForceUpdate} from "@react-spring/shared";

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
  hiddenFields: any
}

export default function GravityFormsForm({ form, hiddenFields }: Props) {
  const [submitForm, { data, loading, error }] = useMutation(SUBMIT_FORM);
  const haveEntryId = Boolean(data?.submitGfForm?.entry?.id);
  const haveFieldErrors = Boolean(data?.submitGfForm?.errors?.length);
  const wasSuccessfullySubmitted = haveEntryId && !haveFieldErrors;
  const formFields = form?.formFields?.nodes || [];
  const { state } = useGravityForm();

  // this.forceUpdate()
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
    Router.push(`/schools/${hiddenFields.slug}/tour-thanks`);
  }

  console.log('error ', data?.submitGfForm?.errors);
  console.log('state: ', state);
  console.log('form', data)

  return (
    <form method="post" onSubmit={handleSubmit}>
      {formFields.map((field: FormField) => (
        <GravityFormsField
          key={field.id}
          field={field}
          fieldErrors={getFieldErrors(field.id)}
          hiddenFields={hiddenFields}
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
