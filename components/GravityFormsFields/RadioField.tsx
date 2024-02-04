import { gql } from "@apollo/client";

import { RadioField as RadioFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";

export const RADIO_FIELD_FIELDS = gql`
  fragment RadioFieldFields on RadioField {
    id
    databaseId
    label
    description
    cssClass
    choices {
      text
      value
    }
  }
`;

interface Props {
  field: RadioFieldType;
  fieldErrors: FieldError[];
}

const DEFAULT_VALUE = '';

export default function RadioField({ field, fieldErrors }: Props) {
  const { id, databaseId, type, label, description, cssClass, choices } = field;
  const htmlId = `field_${databaseId}_${id}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: ACTION_TYPES.updateRadioFieldValue,
      fieldValue: {
        id,
        value: event.target.value,
      },
    });
  }

  return (
    <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} ${cssClass}`.trim()}>
      <legend>{label}</legend>
      <div className="input-wrappers">
        {choices?.map(input => {
          const text = input?.text || '';
          const inputValue = input?.value || '';
          return (
            <div className="input-wrapper" key={inputValue}>
              <input
                type="radio"
                name={String(id)}
                id={`choice_${databaseId}_${id}_${inputValue}`}
                value={inputValue}
                onChange={handleChange}
              />
              <span className="radio-style"></span>
              <label htmlFor={`choice_${databaseId}_${id}_${inputValue}`}>{text}</label>
            </div>
          );
        }
        )}
      </div>
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </fieldset>
  );
}
