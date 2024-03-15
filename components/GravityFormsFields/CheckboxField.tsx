import { gql } from "@apollo/client";
import React, { useEffect, useRef, useState } from 'react';

import { CheckboxField as CheckboxFieldType, CheckboxFieldInput, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, CheckboxFieldValue } from "../../hooks/useGravityForm";

export const CHECKBOX_FIELD_FIELDS = gql`
  fragment CheckboxFieldFields on CheckboxField {
    id
    databaseId
    label
    description
    cssClass
    inputs {
      id
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
    choices {
      text
      value
    }
  }
`;

interface Props {
  field: CheckboxFieldType;
  fieldErrors: FieldError[];
}

const DEFAULT_VALUE: CheckboxFieldInput[] = [];

export default function CheckboxField({ field, fieldErrors }: Props) {
  const { id, databaseId, type, label, description, cssClass, inputs, choices } = field;
  const checkboxInputs = choices?.map((choice, index) => ({ ...choice, id: inputs?.[index]?.id })) || [];
  const htmlId = `field_${databaseId}_${id}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as CheckboxFieldValue | undefined;
  const checkboxValues = fieldValue?.checkboxValues || DEFAULT_VALUE;
  const fieldRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('change event');
    const { name, value, checked } = event.target;
    const otherCheckboxValues = checkboxValues.filter(
      (checkboxValue: CheckboxFieldInput) => checkboxValue.inputId !== Number(name)
    );
    const newCheckboxValues = checked ?
      [...otherCheckboxValues, { inputId: Number(name), value }]
      :
      otherCheckboxValues;

    dispatch({
      type: ACTION_TYPES.updateCheckboxFieldValue,
      fieldValue: {
        id,
        checkboxValues: newCheckboxValues,
      },
    });
  }
  useEffect(()=>{
    const { name, value, checked } = fieldRef.current;
    const otherCheckboxValues = checkboxValues.filter(
      (checkboxValue: CheckboxFieldInput) => checkboxValue.inputId !== Number(name)
    );
    const newCheckboxValues = checked ?
      [...otherCheckboxValues, { inputId: Number(name), value }]
      :
      otherCheckboxValues;

    dispatch({
      type: ACTION_TYPES.updateCheckboxFieldValue,
      fieldValue: {
        id,
        checkboxValues: newCheckboxValues,
      },
    });
  }, [fieldRef]
  );
  

  return (
    <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} ${cssClass}`.trim()}>
      <legend>{label}</legend>
      {checkboxInputs.map(({ id: inputId, text, value }) =>
        <div key={inputId}>
          <input
            type="checkbox"
            name={String(inputId)}
            id={`input_${databaseId}_${id}_${inputId}`}
            value={String(value)}
            onChange={handleChange}
            ref={fieldRef}
          />
          <span className="checkbox-style"></span>
          <label htmlFor={`input_${databaseId}_${id}_${inputId}`}>{text}</label>
        </div>
      )}
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </fieldset>
  );
}
