import { gql } from "@apollo/client";

import { RadioField as RadioFieldType, FieldError } from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, StringFieldValue } from "../../hooks/useGravityForm";
import React, {useContext, useEffect, useRef, useState} from 'react';
import {CalendlyContext} from "../../pages/schools/[schoolSlug]/schedule-a-tour";

export const RADIO_FIELD_FIELDS = gql`
  fragment RadioFieldFields on RadioField {
    id
    databaseId
    label
    description
    cssClass
    choices {
      ... on RadioFieldChoice{
        text
        value
        isSelected
      }
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
  field: RadioFieldType;
  fieldErrors: FieldError[];
  hiddenFields: any;
}

const DEFAULT_VALUE = '';

export default function RadioField({ field, fieldErrors, hiddenFields }: Props) {
  const { id, databaseId, type, label, description, cssClass, choices } = field;
  const htmlId = `field_${databaseId}_${id}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || DEFAULT_VALUE;
  const submitBtn = document.querySelector<HTMLElement>('.form-wrapper button[type="submit"]');
  const form = document.querySelector<HTMLElement>('.form-wrapper form');
  const fieldRef = useRef<HTMLInputElement>(null);
  const usesCalendly = hiddenFields.usesCalendly;
  const calendlyEvents = hiddenFields.hasCalendlyEvent;
  const {calendlySelected, setCalendlySelected} = useContext(CalendlyContext)

  const introductionCallOnly = 'Would you like to schedule your introduction call now?';
  const inPersonOrVirtualTourOnly = 'Would you like to schedule your tour now?';
  const introductionCallAndTours = 'Would you like to schedule your tour or introduction call now?';

  useEffect(()=>{
    dispatch({
      type: ACTION_TYPES.updateRadioFieldValue,
      fieldValue: {
        id,
        value: fieldRef.current.value,
      },
    });
  }, [fieldRef]
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {

    if(event.target.value == 'Yes') {
      setCalendlySelected('true')
      submitBtn.innerText = 'Continue to Scheduler';
    } else {
      setCalendlySelected('false')
      submitBtn.innerText = 'Submit';
    }

    dispatch({
      type: ACTION_TYPES.updateRadioFieldValue,
      fieldValue: {
        id,
        value: event.target.value,
      },
    });
  }
  // console.log(calendlyEvents)

  if (
      hiddenFields.usesCalendly != '0' &&
      (hiddenFields.calendlyURLs.inPersonTour != '' || hiddenFields.calendlyURLs.virtualTour != '' || hiddenFields.calendlyURLs.introductionPhoneCall != '') &&
      (hiddenFields.hasCalendlyEvent != '')
  ) {
    let schedulerLabel = '';
    let hasIntroPhoneCall = hiddenFields.hasCalendlyEvent.includes('Introduction Phone Call');
    let hasVirtualTour = hiddenFields.hasCalendlyEvent.includes('Virtual Tour')
    let hasInPersonTour = hiddenFields.hasCalendlyEvent.includes('In-Person Tour')
    if ( (hasIntroPhoneCall == false) && ( (hasVirtualTour == true) || (hasInPersonTour == true) ) ) {
      schedulerLabel = inPersonOrVirtualTourOnly;
    } else if ( (hasIntroPhoneCall == true) && ( (hasVirtualTour == false) && (hasInPersonTour == false) ) ) {
      schedulerLabel = introductionCallOnly;
    } else {
      schedulerLabel = introductionCallAndTours;
    }
    return (
        <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} ${cssClass}`.trim()}>
          <legend>{schedulerLabel}</legend>
          <div className="input-wrappers">
            {choices?.map(input => {
                  const text = input?.text || '';
                  const inputValue = input?.value || '';
                  return (
                      <div className="input-wrapper" key={inputValue}>
                        <input
                            ref={fieldRef}
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
  } else {
    return <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} ${cssClass}`.trim()} hidden>
      <legend>{label}</legend>
      <div className="input-wrappers">
        {choices?.map(input => {
          const text = input?.text || '';
          const inputValue = input?.value || '';
          return (
            <div className="input-wrapper" key={inputValue}>
              <input
                ref={fieldRef}
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
  }
}
