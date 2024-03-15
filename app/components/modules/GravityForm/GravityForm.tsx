import React, { useEffect, useState } from 'react';
import {FormField, GfForm as GravityFormsFormType, GfForm} from "../../../../generated/graphql";
import getGravityForm from "../../../../utilities/gravity-forms";
//import GravityForm from '../../../../components/GravityForm';

interface GravityFormProps {
    formId?: string;
}
let fields = [];
let conditionals = [];

const GravityFormForm: React.FC<GravityFormProps> = ({ formId }) => {
    const [form, setForm] = useState<GfForm | null>(null);

    function handleSubmit(e){
        //do handle submit and mutation
        let fieldValues = [];
        e.target.map((field, index)=>{
            /* if(field.)
            fieldValues.push */
        });
        console.log(e.target);
        e.preventDefault();
    }
    useEffect(() => {
        async function fetchForm() {
            
            try {
                const fetchedForm = await getGravityForm(parseInt(formId));
                if (fetchedForm === undefined) {
                    setForm(null);
                } else {
                    setForm(fetchedForm);
                }
                //console.log(fetchedForm);

            } catch (error) {
                console.error("Error fetching form:", error);
                setForm(null);
            }
        }
        fetchForm();

    }, [formId]);
    if(!form){
        return(<></>)
    }else{
        return (
            <div className="container gravity-form">
                <div className="row">
                    <div className="form-wrapper">
                        <div className="heading-wrapper">
                            <h1 className='heading green'>{form.title}</h1>
                            <p className="desc b3">{form.description}</p>
                        </div>

                        {form.formFields.nodes.length>0 && (
                        <form name={`gform_${form.id}`} id={`gform_${form.id}`} onSubmit={handleSubmit}>
                            {form.formFields.nodes.map((field, index) => (
                            <GFInput key={field.id} field={field} />
                            )
                            )}
                            <div><button type="submit" form={`gform_${form.id}`} value={form.submitButton.text}>{form.submitButton.text}</button></div>
                        </form>    
                        )
                        }
                    </div>
                </div>
            </div>
        );
            
            
    }
    
}

export default GravityFormForm;

const GFInput = (field)=>{
    
    let classes = `gfield gfield-${field.field.type} ${field.field.size != undefined? field.field.size.toLowerCase() :""}`;
    
    if(field.field.conditionalLogic){
        classes += ' hide'
        conditionals.push({trigger:field.field.conditionalLogic.rules[0].fieldId, field: field.field.id, operator: field.field.conditionalLogic.rules[0].operator, value: field.field.conditionalLogic.rules[0].value});
    }
    const handleFieldChange = (e)=>{
        console.log(conditionals);
        //check conditionals and see if field is in conditionals array
    }
    switch(field.field.type){
        case 'SELECT':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label htmlFor={field.field.id}>{field.field.label}</label>
                <select onChange={handleFieldChange} name={field.field.id} id={field.field.id}>

                    {field.field.choices.map((choice, index)=>(
                    <option key={index} value={choice.value} dangerouslySetInnerHTML={{__html: choice.text}}></option>
                    ))}

                </select>
            </div>
            );
        break;
        case 'EMAIL':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='email' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'TEXT':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='text' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'TEXTAREA':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label htmlFor={field.field.id}>{field.field.label}</label>
                <textarea onChange={handleFieldChange} rows={10} name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'RADIO':
           
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label htmlFor={field.field.id}>{field.field.label}</label>
                {field.field.choices.map((choice, index)=>(
                    <span key={index}>
                    <input className={classes} onChange={handleFieldChange} type='radio' checked={field.field.isSelected} name={field.field.id} id={`${field.field.id}_${index}`} value={choice.value} />
                    <label htmlFor={`${field.field.id}_${index}`}>{choice.text}</label>
                    </span>
                ))}
                
            </div>
            );
        break;
        default:
        break;
    }
    

    //return(<div>{field.field.TYPE}</div>)
}