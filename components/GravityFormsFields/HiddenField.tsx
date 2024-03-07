import { gql } from "@apollo/client";
import {v4 as uuidv4} from 'uuid'
import {HiddenField} from "../../generated/graphql";
import { usePathname } from "next/navigation";
import useGravityForm, { ACTION_TYPES, FieldValue, HiddenFieldValues } from "../../hooks/useGravityForm";

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

    let dynamicFieldValue = ''
    if (label == "IP Address") {
        dynamicFieldValue = hiddenFields.ipAddress
    } else if (label == "User Agent") {
        dynamicFieldValue = hiddenFields.userAgent
    } else if (label == "Event Source URL") {
        dynamicFieldValue = hiddenFields.referer
    } else if (label == "UUID") {
        dynamicFieldValue = uuidv4();
    } else if (label == "Procare") {
        dynamicFieldValue = hiddenFields.procare;
    } else if (label == "School") {
        dynamicFieldValue = hiddenFields.schoolID;
    } else if (label == "School Name") {
        dynamicFieldValue = hiddenFields.schoolName;
    }

    return (
        <fieldset id={`g${htmlId}`}  className={`gfield gfield-${type} hidden`.trim()}>
            <input
                type="hidden"
                name={String(label)}
                id={`input_${id}`}
                value={String(dynamicFieldValue)}
                onLoad={event => {
                    dispatch({
                        type: ACTION_TYPES.updateHiddenFieldValue,
                        fieldValue: {
                            id,
                            value: event,
                        },
                    });
                }}
            />
        </fieldset>
    );
}