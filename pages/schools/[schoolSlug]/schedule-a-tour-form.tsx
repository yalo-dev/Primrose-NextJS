import React, { useEffect, useState } from 'react';
import { FormField, GfForm } from "../../../generated/graphql";
import getGravityForm from "../../../utilities/gravity-forms";
import GravityForm from '../../../components/GravityForm';

export default function ScheduleATourForm({ onFormLoaded, handleHiddenFields, schoolSlug }) {
    console.log('schoolSlug: ', schoolSlug); 
    const [form, setForm] = useState<GfForm | null>(null);
    const [appendSchoolID, setappendSchoolID] = useState(schoolSlug);
    console.log('appendSchoolID: ', appendSchoolID);

    useEffect(() => {
      const fetchForm = async () => {
        try {
            const fetchedForm = await getGravityForm(6);
            if (fetchedForm === undefined) {
                setForm(null);
            } else {
                setForm(fetchedForm);
            }
            
            if (form?.formFields?.nodes) {
                form.formFields.nodes.forEach((field: FormField) => {
                  if (field.type === 'TEXT' && field.databaseId === 11) {
                    
                    //setappendSchoolID(schoolSlug);
                    //field['value'] === appendSchoolID;
                    //field['value'] === schoolSlug;
                    console.log(field['value'])
                  }
                });
              }
            console.log( appendSchoolID);
        } catch (error) {
            console.error("Error fetching form:", error);
            setForm(null); 
        }
    };
      if (form) {
        onFormLoaded();
        handleHiddenFields();
      }
        fetchForm();
    }, [form]);

    if (!form) {
        return <div></div>; 
    }

    return (
        <main>
            <GravityForm form={form} />
        </main>
    );
}
