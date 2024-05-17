import { FieldError, FormField } from "../generated/graphql";

import CheckboxField from "./GravityFormsFields/CheckboxField";
import EmailField from "./GravityFormsFields/EmailField";
import HiddenField from "./GravityFormsFields/HiddenField";
import PhoneField from "./GravityFormsFields/PhoneField";
import RadioField from "./GravityFormsFields/RadioField";
import SelectField from "./GravityFormsFields/SelectField";
import TextAreaField from "./GravityFormsFields/TextAreaField";
import TextField from "./GravityFormsFields/TextField";

interface Props {
  field: FormField;
  fieldErrors?: FieldError[];
  hiddenFields?: any;
}

export default function GravityFormsField({
  field,
  fieldErrors,
  hiddenFields,
}: Props) {
  switch (field.type) {
    case "CHECKBOX":
      return <CheckboxField field={field} fieldErrors={fieldErrors} />;
    case "EMAIL":
      return <EmailField field={field} fieldErrors={fieldErrors} />;
    case "PHONE":
      return <PhoneField field={field} fieldErrors={fieldErrors} />;
    case "RADIO":
      return (
        <RadioField
          field={field}
          fieldErrors={fieldErrors}
          hiddenFields={hiddenFields}
        />
      );
    case "SELECT":
      return <SelectField field={field} fieldErrors={fieldErrors} />;
    case "TEXT":
      return <TextField field={field} fieldErrors={fieldErrors} />;
    case "TEXTAREA":
      return <TextAreaField field={field} fieldErrors={fieldErrors} />;
    case "HIDDEN":
      return <HiddenField field={field} hiddenFields={hiddenFields} />;
    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
