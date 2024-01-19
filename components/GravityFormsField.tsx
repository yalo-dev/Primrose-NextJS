import { FormField, FieldError } from "../generated/graphql";

import CheckboxField from "./GravityFormsFields/CheckboxField";
import EmailField from "./GravityFormsFields/EmailField";
import PhoneField from "./GravityFormsFields/PhoneField";
import RadioField from "./GravityFormsFields/RadioField";
import TextField from "./GravityFormsFields/TextField";
import SelectField from "./GravityFormsFields/SelectField";
import HiddenField from "./GravityFormsFields/HiddenField";

interface Props {
  field: FormField;
  fieldErrors: FieldError[];
}

export default function GravityFormsField({ field, fieldErrors }: Props) {
  switch (field.type) {
    case "CHECKBOX":
      return <CheckboxField field={field} fieldErrors={fieldErrors} />;
    case "EMAIL":
      return <EmailField field={field} fieldErrors={fieldErrors} />;
    case "PHONE":
      return <PhoneField field={field} fieldErrors={fieldErrors} />;
    case "RADIO":
      return <RadioField field={field} fieldErrors={fieldErrors} />;
    case "SELECT":
      return <SelectField field={field} fieldErrors={fieldErrors} />;
    case "TEXT":
      return <TextField field={field} fieldErrors={fieldErrors} />;
    case "HIDDEN":
      return <HiddenField field={field} />
    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
