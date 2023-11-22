import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

export interface FieldValue {
  id: number;
}


export interface StringFieldValue extends FieldValue {
  value: string;
}

export interface StringFieldValues extends FieldValue {
  values: string[];
}

export type FieldValueUnion =  StringFieldValue | StringFieldValues;

interface Action {
  type: ACTION_TYPES;
  fieldValue: FieldValueUnion;
}

export enum ACTION_TYPES {
  updateSelectFieldValue = 'updateSelectFieldValue',
  updateTextFieldValue = 'updateTextFieldValue',
}

function reducer(state: FieldValueUnion[], action: Action) {
  const getOtherFieldValues = (id: number) => state.filter(fieldValue => fieldValue.id !== id);

  switch (action.type) {
    case ACTION_TYPES.updateSelectFieldValue:
    case ACTION_TYPES.updateTextFieldValue: {
      const { id, value } = action.fieldValue as StringFieldValue;
      return [...getOtherFieldValues(id), { id, value }];
    }
    default:
      throw new Error(`Field value update operation not supported: ${action.type}.`);
  }
}

const DEFAULT_STATE: FieldValueUnion[] = [];

const GravityFormContext = createContext<{
  state: FieldValueUnion[];
  dispatch: Dispatch<Action>;
}>({
  state: DEFAULT_STATE,
  dispatch: () => null
});

export function GravityFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  return (
    <GravityFormContext.Provider value={{ state, dispatch }}>
      {children}
    </GravityFormContext.Provider>
  );
}

const useGravityForm = () => useContext(GravityFormContext);

export default useGravityForm;
