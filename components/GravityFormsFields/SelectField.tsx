import { gql } from "@apollo/client";

import { SelectField as SelectFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";

export const SELECT_FIELD_FIELDS = gql`
  fragment SelectFieldFields on SelectField {
    id
    databaseId
    type
    label
    description
    cssClass
    isRequired
    defaultValue
    placeholder
    choices {
      text
      value
    }
  }
`;

interface Props {
  field: SelectFieldType;
  fieldErrors: FieldError[];
}

export default function SelectField({ field, fieldErrors }: Props) {
  const { id, databaseId, type, label, description, cssClass, isRequired, defaultValue, choices, placeholder } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || String(defaultValue);
  const options = choices?.map(choice => ({ value: choice?.value, label: choice?.text })) || [];
  const selectedValue = fieldValue?.value || '';
  let setDisabled = false;
  
  if(field?.databaseId === 8 || field?.databaseId === 9 || field?.databaseId === 10 || 
    field?.databaseId === 15 || field?.databaseId === 16 || field?.databaseId === 17 ||
    field?.databaseId === 25 || field?.databaseId === 26 || field?.databaseId === 27 ||
    field?.databaseId === 29 || field?.databaseId === 30 || field?.databaseId === 31 ||
    field?.databaseId === 33 || field?.databaseId === 34 || field?.databaseId === 35 ||
    field?.databaseId === 37 || field?.databaseId === 38 || field?.databaseId === 39 ) {
    setDisabled = true;
  }

  return (
    <div id={`g${htmlId}`}  className={`gfield gfield-${type}`} hidden>
      <label htmlFor={htmlId}>{label}</label>
      <div className="custom-select">
        <select
          disabled={setDisabled}
          name={String(id)}
          id={htmlId}
          required={Boolean(isRequired)}
          value={selectedValue}
          onChange={event => {
            dispatch({
              type: ACTION_TYPES.updateSelectFieldValue,
              fieldValue: {
                id,
                value: event.target.value,
              },
            });
          }}
        >
          {/* Always render the placeholder */}
          <option value="" disabled hidden={!selectedValue}>{placeholder || 'Select an option'}</option>
          {choices?.map((choice, index) => (
            <option key={`prm_${choice?.value}-${index}`} value={choice?.value || ''}>{choice?.text || ''}</option>
          ))}
        </select>
      </div>
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </div>
  );
}
