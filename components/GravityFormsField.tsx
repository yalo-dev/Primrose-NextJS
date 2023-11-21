import { FormField, FieldError } from "../generated/graphql";

import TextField from "./GravityFormsFields/TextField";

interface Props {
  field: FormField;
  fieldErrors: FieldError[];
}

export default function GravityFormsField({ field, fieldErrors }: Props) {
  switch (field.type) {
    case "TEXT":
      return <TextField field={field} fieldErrors={fieldErrors} />;
    default:
      return <p>{`Field type not supported: ${field.type}.`}</p>;
  }
}
