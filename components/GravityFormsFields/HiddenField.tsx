import { gql } from "@apollo/client";

import {CheckboxFieldInput, HiddenField} from "../../generated/graphql";
import useGravityForm, {ACTION_TYPES, CheckboxFieldValue, FieldValue} from "../../hooks/useGravityForm";

export const CHECKBOX_FIELD_FIELDS = gql`
  fragment HiddenFieldFields on HiddenField {
    id
    databaseId
    label
    value
  }
`;

interface Props {
    field: HiddenField;
}

export default function HiddenField({ field }: Props) {
    const { id, databaseId, type, value , label } = field;
    const htmlId = `field_${databaseId}_${id}`;
    const { state, dispatch } = useGravityForm();
    const fieldValue = state.find((fieldValue: FieldValue) => fieldValue.id === id) as CheckboxFieldValue | undefined;


    return (
        <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type}`.trim()}>
            <input
                type="hidden"
                name={String(label)}
                id={`input_${databaseId}_${id}`}
                value={String(value)}
            />
        </fieldset>
    );
}