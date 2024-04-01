import { gql } from "@apollo/client";

import { SelectField as SelectFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";
import React, { useEffect, useRef, useState } from 'react';

export const SELECT_FIELD_FIELDS = gql`
  fragment SelectFieldFields on SelectField {
    id
    databaseId
    type
    label
    size
    description
    cssClass
    isRequired
    defaultValue
    placeholder
    choices {
      text
      value
    }
    conditionalLogic {
      actionType
      logicType
      rules {
        fieldId
        operator
        value
      }
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
  const selectedValue = fieldValue?.value || '1';
  const fieldRef = useRef<HTMLSelectElement>(null);

  let setDisabled = false;

  const [dynamicLabel, setDynamicLabel] = useState(label);

  if(field?.databaseId === 8 || field?.databaseId === 9 || field?.databaseId === 10 || 
    field?.databaseId === 15 || field?.databaseId === 16 || field?.databaseId === 17 ||
    field?.databaseId === 25 || field?.databaseId === 26 || field?.databaseId === 27 ||
    field?.databaseId === 29 || field?.databaseId === 30 || field?.databaseId === 31 ||
    field?.databaseId === 33 || field?.databaseId === 34 || field?.databaseId === 35 ||
    field?.databaseId === 37 || field?.databaseId === 38 || field?.databaseId === 39 ) {
    setDisabled = true;
  }

  useEffect(()=>{
    dispatch({
      type: ACTION_TYPES.updateSelectFieldValue,
      fieldValue: {
        id,
        value: fieldRef.current.value,
      },
    });

        if (databaseId == 8) {
          setDynamicLabel('Child #1 Birthdate')
        } else if (databaseId == 15) {
          setDynamicLabel('Child #2 Birthdate')
        } else if (databaseId == 25) {
          setDynamicLabel('Child #3 Birthdate')
        } else if (databaseId == 29) {
          setDynamicLabel('Child #4 Birthdate')
        } else if (databaseId == 33) {
          setDynamicLabel('Child #5 Birthdate')
        } else if (databaseId == 37) {
          setDynamicLabel('Child #6 Birthdate')
        }

  }, [fieldRef]
  );
  return (
    <div id={`g${htmlId}`}  className={`gfield gfield-${type}`} hidden>
      <label htmlFor={htmlId}>{dynamicLabel}</label>
      <div className="custom-select">
        <select
          //disabled={setDisabled}
          ref={fieldRef}
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
          {/* {<option value="" disabled hidden={!selectedValue}>{placeholder || 'Select an option'}</option>} */}
          {choices?.map((choice, index) => (   
            index === 0 ? <option key={`prm_${choice?.value}-${index}`} value={choice?.value || ''} disabled hidden>{placeholder || 'Select an option'}</option> :          
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
