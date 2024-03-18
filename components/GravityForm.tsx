import { GfForm as GravityFormsFormType } from "../generated/graphql";
import { GravityFormProvider } from "../hooks/useGravityForm";
import GravityFormsForm from "./GravityFormsForm";

interface Props {
  form: GravityFormsFormType;
  hiddenFields: any;
}

export default function GravityForm(props: Props) {
  return (
    <GravityFormProvider>
      <GravityFormsForm {...props} />
    </GravityFormProvider>
  );
}
