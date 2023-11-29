import React, { useEffect, useState } from 'react';
import { GfForm } from "../../../generated/graphql";
import getGravityForm from "../../../utilities/gravity-forms";
import GravityForm from '../../../components/GravityForm';

export default function ScheduleATourForm() {
    const [form, setForm] = useState<GfForm | null>(null);

    useEffect(() => {
      const fetchForm = async () => {
        try {
            const fetchedForm = await getGravityForm(3);
            if (fetchedForm === undefined) {
                setForm(null);
            } else {
                setForm(fetchedForm);
            }
        } catch (error) {
            console.error("Error fetching form:", error);
            setForm(null); 
        }
    };
    
        fetchForm();
    }, []);

    if (!form) {
        return <div></div>; 
    }

    return (
        <main>
            <GravityForm form={form} />
        </main>
    );
}
