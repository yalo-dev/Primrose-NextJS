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
  const { id, databaseId, type, label, description, cssClass, isRequired, defaultValue, choices } = field;
  const htmlId = `field_${databaseId}`;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as StringFieldValue | undefined;
  const value = fieldValue?.value || String(defaultValue);
  const options = choices?.map(choice => ({ value: choice?.value, label: choice?.text })) || [];

  const isVisible = isFieldVisible(field.conditionalLogic, state);

  function isFieldVisible(conditionalLogic, formState) {
    if (!conditionalLogic || !conditionalLogic.rules || !conditionalLogic.rules.length) {
      return true; // Show the field if there's no conditional logic
    }
  
    const evaluateRule = (rule) => {
      const targetField = formState.find(field => field.id === rule.fieldId);
      if (!targetField) return false;
  
      const targetValue = targetField.value;
      switch (rule.operator) {
        case 'is':
          return targetValue === rule.value;
        case 'isnot':
          return targetValue !== rule.value;
        // Add more cases for other operators as needed
        default:
          return false;
      }
    };
  
    if (conditionalLogic.logicType === 'all') {
      return conditionalLogic.rules.every(evaluateRule);
    } else { // 'any'
      return conditionalLogic.rules.some(evaluateRule);
    }
  }
  if (!isVisible) {
    return null; // Don't render the field if conditions are not met
  }
  
  
  return (
    <div id={htmlId} className={`gfield gfield-${type} ${cssClass}`.trim()}>
      <label htmlFor={htmlId}>{label}</label>
      <select
        name={String(id)}
        id={htmlId}
        required={Boolean(isRequired)}
        value={value}
        onChange={event => {
          dispatch({
            type: ACTION_TYPES.updateSelectFieldValue,
            fieldValue: {
              id,
              value: event.target.value,
            },
          })
        }}
      >
        {choices?.map(choice =>
          <option key={`prm_${choice?.text}` || ''} value={choice?.value || ''}>{choice?.text || ''}</option>
        )}
      </select>
      {description ? <p className="field-description">{description}</p> : null}
      {fieldErrors?.length ? fieldErrors.map(fieldError => (
        <p key={fieldError.id} className="error-message">{fieldError.message}</p>
      )) : null}
    </div>
  );
}
