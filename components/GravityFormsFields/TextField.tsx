import { gql } from "@apollo/client";

import { TextField as TextFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";

export const TEXT_FIELD_FIELDS = gql`
  fragment TextFieldFields on TextField {
    id
    databaseId
    type
    label
    description
    cssClass
    isRequired
    placeholder
    visibility
  }
`;

interface Props {
  field: TextFieldType;
  fieldErrors: FieldError[];
}

const DEFAULT_VALUE = '';

export default function TextField({ field, fieldErrors }: Props) {
  const { id, databaseId, type, label, description, cssClass, isRequired, placeholder } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  let setDisabled = false;

  if(field?.databaseId === 7 || field?.databaseId === 18 || field?.databaseId === 24 || field?.databaseId === 28 || field?.databaseId === 32 || field?.databaseId === 36) {
    setDisabled = true;
  }

  return (
    <div id={`g${htmlId}`}  className={`gfield gfield-${type}`} hidden>
      <label htmlFor={htmlId}>{label}</label>
      <input
        disabled={setDisabled} 
        type="text"
        name={String(id)}
        id={htmlId}
        required={Boolean(isRequired)}
        placeholder={placeholder || ''}
        value={value}
        onChange={event => {
          dispatch({
            type: ACTION_TYPES.updateTextFieldValue,
            fieldValue: {
              id,
              value: event.target.value,
            },
          })
        }}
      />
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </div>
  );
}
