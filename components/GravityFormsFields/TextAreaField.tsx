import { gql } from "@apollo/client";

import { TextAreaField as TextAreaFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";
import React, { useEffect, useRef, useState } from 'react';

export const TEXTAREA_FIELD_FIELDS = gql`
  fragment TextAreaFieldFields on TextAreaField {
    id
    databaseId
    type
    label
    description
    size
    cssClass
    isRequired
    placeholder
    visibility
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
  field: TextAreaFieldType;
  fieldErrors: FieldError[];
}

const DEFAULT_VALUE = '';

export default function TextAreaField({ field, fieldErrors }: Props) {
  const { id, databaseId, type, label, description, cssClass, isRequired, placeholder } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  let setDisabled = false;

  if(field?.databaseId === 7 || field?.databaseId === 18 || field?.databaseId === 24 || field?.databaseId === 28 || field?.databaseId === 32 || field?.databaseId === 36) {
    setDisabled = true;
  }

  useEffect(()=>{
    dispatch({
      type: ACTION_TYPES.updateTextFieldValue,
      fieldValue: {
        id,
        value: fieldRef.current.value,
      },
    })
  }, [fieldRef]
  );

  return (
    <div id={`g${htmlId}`}  className={`gfield gfield-${type}`} hidden>
      <label htmlFor={htmlId}>{label}</label>
      <textarea
        ref={fieldRef}
        disabled={setDisabled}
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
