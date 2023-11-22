import { GfForm } from "../../../generated/graphql";
import getGravityForm from "../../../utilities/gravity-forms";
import GravityForm from '../../../components/GravityForm';


interface Props {
    form: GfForm;
  }

  export default function ScheduleATourForm({ form }: Props) {
    //const { title, description } = form;
  
    return (
      <main>
        {/* <h1>{title}</h1>
        <p>{description}</p> */}
        <GravityForm form={form} />
        
      </main>
    );
  }
  export async function getStaticPaths() {
    return {
      paths: [],
      fallback: false,
    }
  }
  export async function getStaticProps() {
    const form = await getGravityForm(3);
  
    return {
      props: { form },
    };
  }
  