import React, { useEffect, useState } from 'react';
import { FormField, GfForm } from "../../../generated/graphql";
import getGravityForm from "../../../utilities/gravity-forms";
import GravityForm from '../../../components/GravityForm';

export default function ScheduleATourForm({  }) {
    const [form, setForm] = useState<GfForm | null>(null); 

useEffect(() => {
      const fetchForm = async () => {
        try {
            const fetchedForm = await getGravityForm(6);
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

    if(form) {
        const selectField                   = document.getElementById('field_6')    as HTMLSelectElement;

        const firstChildName                = document.getElementById('field_7')    as HTMLInputElement;
        const secondChildName               = document.getElementById('field_18')   as HTMLInputElement;
        const thirdChildName                = document.getElementById('field_24')   as HTMLInputElement;
        const forthChildName                = document.getElementById('field_28')   as HTMLInputElement;
        const fifthChildName                = document.getElementById('field_32')   as HTMLInputElement;
        const sixthChildName                = document.getElementById('field_36')   as HTMLInputElement;
        
        const firstChildMonth               = document.getElementById('field_8')    as HTMLSelectElement;
        const firstChildDay                 = document.getElementById('field_9')    as HTMLSelectElement;
        const firstChildYear                = document.getElementById('field_10')   as HTMLSelectElement;

        const secondChildMonth              = document.getElementById('field_15')   as HTMLSelectElement;
        const secondChildDay                = document.getElementById('field_16')   as HTMLSelectElement;
        const secondChildYear               = document.getElementById('field_17')   as HTMLSelectElement;

        const thirdChildMonth               = document.getElementById('field_25')   as HTMLSelectElement;
        const thirdChildDay                 = document.getElementById('field_26')   as HTMLSelectElement;
        const thirdChildYear                = document.getElementById('field_27')   as HTMLSelectElement;

        const forthChildMonth               = document.getElementById('field_29')   as HTMLSelectElement;
        const forthChildDay                 = document.getElementById('field_30')   as HTMLSelectElement;
        const forthChildYear                = document.getElementById('field_31')   as HTMLSelectElement;

        const fifthChildMonth               = document.getElementById('field_33')   as HTMLSelectElement;
        const fifthChildDay                 = document.getElementById('field_34')   as HTMLSelectElement;
        const fifthChildYear                = document.getElementById('field_35')   as HTMLSelectElement;

        const sixthChildMonth               = document.getElementById('field_37')   as HTMLSelectElement;
        const sixthChildDay                 = document.getElementById('field_38')   as HTMLSelectElement;
        const sixthChildYear                = document.getElementById('field_39')   as HTMLSelectElement;


        if(selectField) {
            selectField.onchange = function() {
                
                let enableFirstChildName = true , enableSecondChildName = true
                let enableThirdChildName = true , enableForthChildName  = true
                let enableFifthChildName = true , enableSixthChildName  = true;

                let enableFirstMonth    = true, enableFirstDay  = true, enableFirstYear     = true;
                let enableSecondMonth   = true, enableSecondDay = true, enableSecondYear    = true;
                let enableThirdMonth    = true, enableThirdDay  = true, enableThirdYear     = true;
                let enableForthMonth    = true, enableForthDay  = true, enableForthYear     = true;
                let enableFifthMonth    = true, enableFifthDay  = true, enableFifthYear     = true;
                let enableSixthMonth    = true, enableSixthDay  = true, enableSixthYear     = true;

                console.log("selectField.options.selectedIndex: ", selectField.options.selectedIndex);
                switch(selectField.options.selectedIndex){
                    case 2:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;

                        enableSecondChildName       = true;
                        enableSecondMonth           = true;
                        enableSecondDay             = true;
                        enableSecondYear            = true;

                        enableThirdChildName        = true;
                        enableThirdMonth            = true;
                        enableThirdDay              = true;
                        enableThirdYear             = true;

                        enableForthChildName        = true;
                        enableForthMonth            = true;
                        enableForthDay              = true;
                        enableForthYear             = true;

                        enableFifthChildName        = true;
                        enableFifthMonth            = true;
                        enableFifthDay              = true;
                        enableFifthYear             = true;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                    case 3:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;

                        enableSecondChildName       = false;
                        enableSecondMonth           = false;
                        enableSecondDay             = false;
                        enableSecondYear            = false;

                        enableThirdChildName        = true;
                        enableThirdMonth            = true;
                        enableThirdDay              = true;
                        enableThirdYear             = true;

                        enableForthChildName        = true;
                        enableForthMonth            = true;
                        enableForthDay              = true;
                        enableForthYear             = true;

                        enableFifthChildName        = true;
                        enableFifthMonth            = true;
                        enableFifthDay              = true;
                        enableFifthYear             = true;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                    case 4:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;

                        enableSecondChildName       = false;
                        enableSecondMonth           = false;
                        enableSecondDay             = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildName        = false;
                        enableThirdMonth            = false;
                        enableThirdDay              = false;
                        enableThirdYear             = false;

                        enableForthChildName        = true;
                        enableForthMonth            = true;
                        enableForthDay              = true;
                        enableForthYear             = true;

                        enableFifthChildName        = true;
                        enableFifthMonth            = true;
                        enableFifthDay              = true;
                        enableFifthYear             = true;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                    case 5:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;

                        enableSecondChildName       = false;
                        enableSecondMonth           = false;
                        enableSecondDay             = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildName        = false;
                        enableThirdMonth            = false;
                        enableThirdDay              = false;
                        enableThirdYear             = false;

                        enableForthChildName        = false;
                        enableForthMonth            = false;
                        enableForthDay              = false;
                        enableForthYear             = false;

                        enableFifthChildName        = true;
                        enableFifthMonth            = true;
                        enableFifthDay              = true;
                        enableFifthYear             = true;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                    case 6:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;
                        
                        enableSecondChildName       = false;
                        enableSecondMonth           = false;
                        enableSecondDay             = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildName        = false;
                        enableThirdMonth            = false;
                        enableThirdDay              = false;
                        enableThirdYear             = false;

                        enableForthChildName        = false;
                        enableForthMonth            = false;
                        enableForthDay              = false;
                        enableForthYear             = false;

                        enableFifthChildName        = false;
                        enableFifthMonth            = false;
                        enableFifthDay              = false;
                        enableFifthYear             = false;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                    case 7:
                        enableFirstChildName        = false;
                        enableFirstMonth            = false;
                        enableFirstDay              = false;
                        enableFirstYear             = false;
                        
                        enableSecondChildName       = false;
                        enableSecondMonth           = false;
                        enableSecondDay             = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildName        = false;
                        enableThirdMonth            = false;
                        enableThirdDay              = false;
                        enableThirdYear             = false;

                        enableForthChildName        = false;
                        enableForthMonth            = false;
                        enableForthDay              = false;
                        enableForthYear             = false;

                        enableFifthChildName        = false;
                        enableFifthMonth            = false;
                        enableFifthDay              = false;
                        enableFifthYear             = false;

                        enableSixthChildName        = false;
                        enableSixthMonth            = false;
                        enableSixthDay              = false;
                        enableSixthYear             = false;
                        break;
                    default:
                        enableFirstChildName        = true;
                        enableFirstMonth            = true;
                        enableFirstDay              = true;
                        enableFirstYear             = true;

                        enableSecondChildName       = true;
                        enableSecondMonth           = true;
                        enableSecondDay             = true;
                        enableSecondYear            = true;
                        
                        enableThirdChildName        = true;
                        enableThirdMonth            = true;
                        enableThirdDay              = true;
                        enableThirdYear             = true;

                        enableForthChildName        = true;
                        enableForthMonth            = true;
                        enableForthDay              = true;
                        enableForthYear             = true;

                        enableFifthChildName        = true;
                        enableFifthMonth            = true;
                        enableFifthDay              = true;
                        enableFifthYear             = true;

                        enableSixthChildName        = true;
                        enableSixthMonth            = true;
                        enableSixthDay              = true;
                        enableSixthYear             = true;
                        break;
                }
                firstChildName.disabled                 = enableFirstChildName;
                firstChildMonth.disabled                = enableFirstMonth;
                firstChildDay.disabled                  = enableFirstDay;
                firstChildYear.disabled                 = enableFirstYear;

                secondChildName.disabled                = enableSecondChildName;
                secondChildMonth.disabled               = enableSecondMonth;
                secondChildDay.disabled                 = enableSecondDay;
                secondChildYear.disabled                = enableSecondYear;

                thirdChildName.disabled                 = enableThirdChildName;
                thirdChildMonth.disabled                = enableThirdMonth;
                thirdChildDay.disabled                  = enableThirdDay;
                thirdChildYear.disabled                 = enableThirdYear;

                forthChildName.disabled                 = enableForthChildName;
                forthChildMonth.disabled                = enableForthMonth;
                forthChildDay.disabled                  = enableForthDay;
                forthChildYear.disabled                 = enableForthYear;

                fifthChildName.disabled                 = enableFifthChildName;
                fifthChildMonth.disabled                = enableFifthMonth;
                fifthChildDay.disabled                  = enableFifthDay;
                fifthChildYear.disabled                 = enableFifthYear;

                sixthChildName.disabled                 = enableSixthChildName;
                sixthChildMonth.disabled                = enableSixthMonth;
                sixthChildDay.disabled                  = enableSixthDay;
                sixthChildYear.disabled                 = enableSixthYear;
            }
        }
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
