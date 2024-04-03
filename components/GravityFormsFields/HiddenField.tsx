import { gql } from "@apollo/client";
import {v4 as uuidv4} from 'uuid'
import {HiddenField} from "../../generated/graphql";
import useGravityForm, { ACTION_TYPES, FieldValue, HiddenFieldValues } from "../../hooks/useGravityForm";
import React, { useEffect, useRef, useState } from 'react';

export const HIDDEN_FIELD_FIELDS = gql`
  fragment HiddenFieldFields on HiddenField {
    id
    databaseId
    label
    value
  }
`;

interface Props {
    field: HiddenField;
    hiddenFields: any
}

export default function HiddenField({ field, hiddenFields }: Props) {
    const { id, databaseId, type, value , label } = field;
    const htmlId = `field_${databaseId}_${id}`;
    const { state, dispatch } = useGravityForm();
    const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as HiddenFieldValues | undefined;
    const fieldRef = useRef<HTMLInputElement>(null);
    const UserSessionAnalytics = document.cookie.split("; ").find((row) => row.startsWith("UserSession="))?.split("=")[1] || '';

    function setAnalyticsValue(field) {
        let value = ''
        let utmParameters = UserSessionAnalytics.split('%26')
        // console.log('utmParameters: ', utmParameters)
        for (let x in utmParameters) {
            // console.log('utmParam: ', utmParameters[x])
            let utmValue = utmParameters[x].split('%3D')
            // console.log('Inside setAnalyticsValue', utmValue)
            if (utmValue[0] == field) {
                value = utmValue[1]
            }
        }
        return value
    }

    let dynamicFieldValue = ''
    if (label == "IP Address") {
        dynamicFieldValue = hiddenFields.ipAddress
    } else if (label == "User Agent") {
        dynamicFieldValue = hiddenFields.userAgent
    } else if (label == "Event Source URL") {
        dynamicFieldValue = window.location.href
    } else if (label == "UUID") {
        dynamicFieldValue = uuidv4();
    } else if (label == "Procare") {
        dynamicFieldValue = hiddenFields.procare;
    } else if (label == "School") {
        dynamicFieldValue = hiddenFields.schoolID;
    } else if (label == "School Name") {
        dynamicFieldValue = hiddenFields.schoolName;
    } else if (label == "School URL") {
        dynamicFieldValue = hiddenFields.uri;
    } else if (label == "Uses Calendly") {
        dynamicFieldValue = hiddenFields.usesCalendly;
    } else if (label == "ga_source") {
        dynamicFieldValue = setAnalyticsValue('source')
    } else if (label == "ga_medium") {
        dynamicFieldValue = setAnalyticsValue('medium')
    } else if (label == "ga_term") {
        dynamicFieldValue = setAnalyticsValue('term')
    } else if (label == "ga_content") {
        dynamicFieldValue = setAnalyticsValue('content')
    } else if (label == "ga_campaign") {
        dynamicFieldValue = setAnalyticsValue('campaign')
    }
    // console.log(document.cookie)
    useEffect(()=>{
        dispatch({
            type: ACTION_TYPES.updateHiddenFieldValue,
            fieldValue: {
                id,
                value: fieldRef.current.value,
            },
        });
      }, [fieldRef]
    );
    return (
        <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} hidden`.trim()}>
            <input
                ref={fieldRef}
                type="hidden"
                name={String(label)}
                id={`input_${id}`}
                value={String(dynamicFieldValue)}
                onChange={event => {
                    dispatch({
                        type: ACTION_TYPES.updateHiddenFieldValue,
                        fieldValue: {
                            id,
                            value: event.target.value,
                        },
                    });
                }}
            />
        </fieldset>
    );
}