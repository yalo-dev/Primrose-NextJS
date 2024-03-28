import React, { useEffect, useState } from 'react';
import { useMutation, gql } from "@apollo/client";
import {FormField, GfForm as GravityFormsFormType, GfForm} from "../../../../generated/graphql";
import getGravityForm from "../../../../utilities/gravity-forms";
//import GravityForm from '../../../../components/GravityForm';

const SUBMIT_FORM = gql`
  mutation submitForm($formId: ID!, $fieldValues: [FormFieldValuesInput]!) {
    submitGfForm(input: {
      id: $formId
      fieldValues: $fieldValues
      saveAsDraft: false
    }) {
      confirmation {
      url 
      }
      entry {
      id
      }
      errors {
        id
        message
      }
    }
  }
`;
interface GravityFormProps {
    formId?: string;
}
let fields = [];
let conditionals = [];

const GravityFormForm: React.FC<GravityFormProps> = ({ formId }) => {
    const [form, setForm] = useState<GfForm | null>(null);
    const [submitForm, { data, loading, error }] = useMutation(SUBMIT_FORM);
    const [status, setStatus] = useState<string>('form');
    function handleInvalid(e){
       
        e.target.classList.add('invalid');
    }
    function handleSubmit(e){
        e.preventDefault();
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        //do handle submit and mutation
        let fieldValues = [];
        let btn = e.currentTarget.getElementsByTagName('button')[0];
        btn.disabled = true;
        for(let i=0; i<e.target.elements.length; i++){
            let element = e.target.elements[i];
            //console.log(element.type);
            if(element.type == 'email' ){
                fieldValues.push({id:parseInt(element.name), emailValues:{value:element.value}});
            }else if(element.type == 'radio'){
                if(element.checked){
                    fieldValues.push({id:parseInt(element.name), value:element.value});
                }
            }else if(element.type != 'submit'){
                fieldValues.push({id:parseInt(element.name), value:element.value});
            }
        }
        let success = true;
        
        console.log('form validated');
       
        submitForm({
            variables: {
              formId: formId,
              fieldValues: fieldValues,
            }
          }).catch(error => {
            success = false;
            console.error(error);
          });
       
        if(success){
            setStatus('confirmation');
            window.scrollTo({top: 0})
        }
        
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
        if(status == 'form'){
            return (
                <div className="container gravity-form">
                    <div className="row">
                        <div className="form-wrapper">
                            {/* <div className="heading-wrapper">
                                <h1 className='heading green'>{form.title}</h1>
                                <p className="desc b3">{form.description}</p>
                            </div> */}

                            {form.formFields.nodes.length>0 && (
                            <form name={`gform_${formId}`} id={`gform_${formId}`} onInvalid={handleInvalid} onSubmit={handleSubmit}>
                                {form.formFields.nodes.map((field, index) => (
                                <GFInput key={field.id} field={field} />
                                ))}
                                <div className="submit"><button type="submit" form={`gform_${formId}`} value={form.submitButton.text}>{form.submitButton.text}</button></div>
                            </form>    
                            )
                            }
                        </div>
                    </div>
                </div>
            );
        }else if(status == 'confirmation'){
            return(
                <div className="container gravity-form pt-5">
                    <div className="row">
                        <div className="col-12 px-0">
                            <div className="heading-wrapper">
                                <h3 className='heading green'>{form.confirmations[0].message}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
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
        
        conditionals.forEach((conditional, index) =>{
            let field = document.getElementById('gform_' + conditional.field)
            if(conditional.trigger == e.currentTarget.name){
                if(conditional.operator == "IS"){
                    if(e.currentTarget.value == conditional.value){
                        field.classList.remove('hide');
                    }else{
                        field.classList.add('hide');
                    }
                }
            }
        });
        //check conditionals and see if field is in conditionals array
    }
    switch(field.field.type){
        case 'SELECT':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <select defaultValue={""} onChange={handleFieldChange} name={field.field.id} id={field.field.id} required={field.field.isRequired}>
                    <option key={-1} disabled value={""}>{field.field.placeholder}</option>
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
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='email' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'PHONE':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='tel' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'PHONE':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='tel' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'TEXT':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <input onChange={handleFieldChange} type='text' name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'TEXTAREA':
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <textarea onChange={handleFieldChange} rows={10} name={field.field.id} id={field.field.id} placeholder={field.field.placeholder} required={field.field.isRequired} />
            </div>
            );
        break;
        case 'RADIO':
           
            return(
            <div key={field.field.id} id={`gform_${field.field.id}`} className={classes}>
                <label className={field.field.isRequired? 'required':''} htmlFor={field.field.id}>{field.field.label}</label>
                <div>
                {field.field.choices.map((choice, index)=>(
                    <div key={index}>
                    <input className={classes} onChange={handleFieldChange} type='radio' checked={field.field.isSelected} name={field.field.id} id={`${field.field.id}_${index}`} value={choice.value} />
                    <label htmlFor={`${field.field.id}_${index}`}>{choice.text}</label>
                    </div>
                ))}
                </div>
                
            </div>
            );
        break;
        case 'HIDDEN':
           
            return(
            <input type='hidden' name={field.field.id} id={field.field.id} />
            );
        break;
        default:
        break;
    }
    

    //return(<div>{field.field.TYPE}</div>)
}