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

        const firstChildNameGroup           = document.getElementById('gfield_7')   as HTMLDivElement;
        const firstChildName                = document.getElementById('field_7')    as HTMLInputElement;
        const firstChildMonthGroup          = document.getElementById('gfield_8')   as HTMLDivElement;
        const firstChildMonth               = document.getElementById('field_8')    as HTMLSelectElement;
        const firstChildDayGroup            = document.getElementById('gfield_9')   as HTMLDivElement;
        const firstChildDay                 = document.getElementById('field_9')    as HTMLSelectElement;
        const firstChildYearGroup           = document.getElementById('gfield_10')  as HTMLDivElement;
        const firstChildYear                = document.getElementById('field_10')   as HTMLSelectElement;

        const secondChildNameGroup          = document.getElementById('gfield_18')  as HTMLDivElement;
        const secondChildName               = document.getElementById('field_18')   as HTMLInputElement;
        const secondChildMonthGroup         = document.getElementById('gfield_15')  as HTMLDivElement;
        const secondChildMonth              = document.getElementById('field_15')   as HTMLSelectElement;
        const secondChildDayGroup           = document.getElementById('gfield_16')  as HTMLDivElement;
        const secondChildDay                = document.getElementById('field_16')   as HTMLSelectElement;
        const secondChildYearGroup          = document.getElementById('gfield_17')  as HTMLDivElement;
        const secondChildYear               = document.getElementById('field_17')   as HTMLSelectElement;

        const thirdChildNameGroup           = document.getElementById('gfield_24')  as HTMLDivElement;
        const thirdChildName                = document.getElementById('field_24')   as HTMLInputElement;
        const thirdChildMonthGroup          = document.getElementById('gfield_25')  as HTMLDivElement;
        const thirdChildMonth               = document.getElementById('field_25')   as HTMLSelectElement;
        const thirdChildDayGroup            = document.getElementById('gfield_26')  as HTMLDivElement;
        const thirdChildDay                 = document.getElementById('field_26')   as HTMLSelectElement;
        const thirdChildYearGroup           = document.getElementById('gfield_27')  as HTMLDivElement;
        const thirdChildYear                = document.getElementById('field_27')   as HTMLSelectElement;

        const forthChildNameGroup           = document.getElementById('gfield_28')  as HTMLDivElement;
        const forthChildName                = document.getElementById('field_28')   as HTMLInputElement;
        const forthChildMonthGroup          = document.getElementById('gfield_29')  as HTMLDivElement;
        const forthChildMonth               = document.getElementById('field_29')   as HTMLSelectElement;
        const forthChildDayGroup            = document.getElementById('gfield_30')  as HTMLDivElement;
        const forthChildDay                 = document.getElementById('field_30')   as HTMLSelectElement;
        const forthChildYearGroup           = document.getElementById('gfield_31')  as HTMLDivElement;
        const forthChildYear                = document.getElementById('field_31')   as HTMLSelectElement;

        const fifthChildNameGroup           = document.getElementById('gfield_32')  as HTMLDivElement;
        const fifthChildName                = document.getElementById('field_32')   as HTMLInputElement;
        const fifthChildMonthGroup          = document.getElementById('gfield_33')  as HTMLDivElement;
        const fifthChildMonth               = document.getElementById('field_33')   as HTMLSelectElement;
        const fifthChildDayGroup            = document.getElementById('gfield_34')  as HTMLDivElement;
        const fifthChildDay                 = document.getElementById('field_34')   as HTMLSelectElement;
        const fifthChildYearGroup           = document.getElementById('gfield_35')  as HTMLDivElement;
        const fifthChildYear                = document.getElementById('field_35')   as HTMLSelectElement;

        const sixthChildNameGroup           = document.getElementById('gfield_36')  as HTMLDivElement;
        const sixthChildName                = document.getElementById('field_36')   as HTMLInputElement;
        const sixthChildMonthGroup          = document.getElementById('gfield_37')  as HTMLDivElement;
        const sixthChildMonth               = document.getElementById('field_37')   as HTMLSelectElement;
        const sixthChildDayGroup            = document.getElementById('gfield_38')  as HTMLDivElement;
        const sixthChildDay                 = document.getElementById('field_38')   as HTMLSelectElement;
        const sixthChildYearGroup           = document.getElementById('gfield_39')  as HTMLDivElement;
        const sixthChildYear                = document.getElementById('field_39')   as HTMLSelectElement;


        if(selectField) {
            selectField.onchange = function() {
                
                let enableFirstChildName = true , enableSecondChildName = true, enableFirstChildNameGroup = true, enableFirstChildMonthGroup = true, enableFirstChildDayGroup = true, enableFirstChildYearGroup = true
                let enableThirdChildName = true , enableForthChildName  = true, enableSecondChildNameGroup = true, enableSecondChildMonthGroup = true, enableSecondChildDayGroup = true, enableSecondChildYearGroup = true
                let enableFifthChildName = true , enableSixthChildName  = true, enableThirdChildNameGroup = true, enableThirdChildMonthGroup = true, enableThirdChildDayGroup = true, enableThirdChildYearGroup = true
                let enableForthChildNameGroup = true, enableForthChildMonthGroup = true, enableForthChildDayGroup = true, enableForthChildYearGroup = true
                let enableFifthChildNameGroup = true, enableFifthChildMonthGroup = true, enableFifthChildDayGroup = true, enableFifthChildYearGroup = true
                let enableSixthChildNameGroup = true, enableSixthChildMonthGroup = true, enableSixthChildDayGroup = true, enableSixthChildYearGroup = true;

                let enableFirstMonth    = true, enableFirstDay  = true, enableFirstYear     = true;
                let enableSecondMonth   = true, enableSecondDay = true, enableSecondYear    = true;
                let enableThirdMonth    = true, enableThirdDay  = true, enableThirdYear     = true;
                let enableForthMonth    = true, enableForthDay  = true, enableForthYear     = true;
                let enableFifthMonth    = true, enableFifthDay  = true, enableFifthYear     = true;
                let enableSixthMonth    = true, enableSixthDay  = true, enableSixthYear     = true;

                console.log("selectField.options.selectedIndex: ", selectField.options.selectedIndex);
                switch(selectField.options.selectedIndex){
                    case 2:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;

                        enableSecondChildNameGroup  = true;
                        enableSecondChildName       = true;
                        enableSecondChildMonthGroup = true;
                        enableSecondMonth           = true;
                        enableSecondChildDayGroup   = true;
                        enableSecondDay             = true;
                        enableSecondChildYearGroup  = true;
                        enableSecondYear            = true;

                        enableThirdChildNameGroup   = true;
                        enableThirdChildName        = true;
                        enableThirdChildMonthGroup  = true;
                        enableThirdMonth            = true;
                        enableThirdChildDayGroup    = true;
                        enableThirdDay              = true;
                        enableThirdChildYearGroup   = true;
                        enableThirdYear             = true;

                        enableForthChildNameGroup   = true;
                        enableForthChildName        = true;
                        enableForthChildMonthGroup  = true;
                        enableForthMonth            = true;
                        enableForthChildDayGroup    = true;
                        enableForthDay              = true;
                        enableForthChildYearGroup   = true;
                        enableForthYear             = true;

                        enableFifthChildNameGroup   = true;
                        enableFifthChildName        = true;
                        enableFifthChildMonthGroup  = true;
                        enableFifthMonth            = true;
                        enableFifthChildDayGroup    = true;
                        enableFifthDay              = true;
                        enableFifthChildYearGroup   = true;
                        enableFifthYear             = true;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                    case 3:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;

                        enableSecondChildNameGroup  = false;
                        enableSecondChildName       = false;
                        enableSecondChildMonthGroup = false;
                        enableSecondMonth           = false;
                        enableSecondChildDayGroup   = false;
                        enableSecondDay             = false;
                        enableSecondChildYearGroup  = false;
                        enableSecondYear            = false;

                        enableThirdChildNameGroup   = true;
                        enableThirdChildName        = true;
                        enableThirdChildMonthGroup  = true;
                        enableThirdMonth            = true;
                        enableThirdChildDayGroup    = true;
                        enableThirdDay              = true;
                        enableThirdChildYearGroup   = true;
                        enableThirdYear             = true;

                        enableForthChildNameGroup   = true;
                        enableForthChildName        = true;
                        enableForthChildMonthGroup  = true;
                        enableForthMonth            = true;
                        enableForthChildDayGroup    = true;
                        enableForthDay              = true;
                        enableForthChildYearGroup   = true;
                        enableForthYear             = true;

                        enableFifthChildNameGroup   = true;
                        enableFifthChildName        = true;
                        enableFifthChildMonthGroup  = true;
                        enableFifthMonth            = true;
                        enableFifthChildDayGroup    = true;
                        enableFifthDay              = true;
                        enableFifthChildYearGroup   = true;
                        enableFifthYear             = true;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                    case 4:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;

                        enableSecondChildNameGroup  = false;
                        enableSecondChildName       = false;
                        enableSecondChildMonthGroup = false;
                        enableSecondMonth           = false;
                        enableSecondChildDayGroup   = false;
                        enableSecondDay             = false;
                        enableSecondChildYearGroup  = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildNameGroup   = false;
                        enableThirdChildName        = false;
                        enableThirdChildMonthGroup  = false;
                        enableThirdMonth            = false;
                        enableThirdChildDayGroup    = false;
                        enableThirdDay              = false;
                        enableThirdChildYearGroup   = false;
                        enableThirdYear             = false;

                        enableForthChildNameGroup   = true;
                        enableForthChildName        = true;
                        enableForthChildMonthGroup  = true;
                        enableForthMonth            = true;
                        enableForthChildDayGroup    = true;
                        enableForthDay              = true;
                        enableForthChildYearGroup   = true;
                        enableForthYear             = true;

                        enableFifthChildNameGroup   = true;
                        enableFifthChildName        = true;
                        enableFifthChildMonthGroup  = true;
                        enableFifthMonth            = true;
                        enableFifthChildDayGroup    = true;
                        enableFifthDay              = true;
                        enableFifthChildYearGroup   = true;
                        enableFifthYear             = true;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                    case 5:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;

                        enableSecondChildNameGroup  = false;
                        enableSecondChildName       = false;
                        enableSecondChildMonthGroup = false;
                        enableSecondMonth           = false;
                        enableSecondChildDayGroup   = false;
                        enableSecondDay             = false;
                        enableSecondChildYearGroup  = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildNameGroup   = false;
                        enableThirdChildName        = false;
                        enableThirdChildMonthGroup  = false;
                        enableThirdMonth            = false;
                        enableThirdChildDayGroup    = false;
                        enableThirdDay              = false;
                        enableThirdChildYearGroup   = false;
                        enableThirdYear             = false;

                        enableForthChildNameGroup   = false;
                        enableForthChildName        = false;
                        enableForthChildMonthGroup  = false;
                        enableForthMonth            = false;
                        enableForthChildDayGroup    = false;
                        enableForthDay              = false;
                        enableForthChildYearGroup   = false;
                        enableForthYear             = false;

                        enableFifthChildNameGroup   = true;
                        enableFifthChildName        = true;
                        enableFifthChildMonthGroup  = true;
                        enableFifthMonth            = true;
                        enableFifthChildDayGroup    = true;
                        enableFifthDay              = true;
                        enableFifthChildYearGroup   = true;
                        enableFifthYear             = true;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                    case 6:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;
                        
                        enableSecondChildNameGroup  = false;
                        enableSecondChildName       = false;
                        enableSecondChildMonthGroup = false;
                        enableSecondMonth           = false;
                        enableSecondChildDayGroup   = false;
                        enableSecondDay             = false;
                        enableSecondChildYearGroup  = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildNameGroup   = false;
                        enableThirdChildName        = false;
                        enableThirdChildMonthGroup  = false;
                        enableThirdMonth            = false;
                        enableThirdChildDayGroup    = false;
                        enableThirdDay              = false;
                        enableThirdChildYearGroup   = false;
                        enableThirdYear             = false;

                        enableForthChildNameGroup   = false;
                        enableForthChildName        = false;
                        enableForthChildMonthGroup  = false;
                        enableForthMonth            = false;
                        enableForthChildDayGroup    = false;
                        enableForthDay              = false;
                        enableForthChildYearGroup   = false;
                        enableForthYear             = false;

                        enableFifthChildNameGroup   = false;
                        enableFifthChildName        = false;
                        enableFifthChildMonthGroup  = false;
                        enableFifthMonth            = false;
                        enableFifthChildDayGroup    = false;
                        enableFifthDay              = false;
                        enableFifthChildYearGroup   = false;
                        enableFifthYear             = false;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                    case 7:
                        enableFirstChildNameGroup   = false;
                        enableFirstChildName        = false;
                        enableFirstChildMonthGroup  = false;
                        enableFirstMonth            = false;
                        enableFirstChildDayGroup    = false;
                        enableFirstDay              = false;
                        enableFirstChildYearGroup   = false;
                        enableFirstYear             = false;
                        
                        enableSecondChildNameGroup  = false;
                        enableSecondChildName       = false;
                        enableSecondChildMonthGroup = false;
                        enableSecondMonth           = false;
                        enableSecondChildDayGroup   = false;
                        enableSecondDay             = false;
                        enableSecondChildYearGroup  = false;
                        enableSecondYear            = false;
                        
                        enableThirdChildNameGroup   = false;
                        enableThirdChildName        = false;
                        enableThirdChildMonthGroup  = false;
                        enableThirdMonth            = false;
                        enableThirdChildDayGroup    = false;
                        enableThirdDay              = false;
                        enableThirdChildYearGroup   = false;
                        enableThirdYear             = false;

                        enableForthChildNameGroup   = false;
                        enableForthChildName        = false;
                        enableForthChildMonthGroup  = false;
                        enableForthMonth            = false;
                        enableForthChildDayGroup    = false;
                        enableForthDay              = false;
                        enableForthChildYearGroup   = false;
                        enableForthYear             = false;

                        enableFifthChildNameGroup   = false;
                        enableFifthChildName        = false;
                        enableFifthChildMonthGroup  = false;
                        enableFifthMonth            = false;
                        enableFifthChildDayGroup    = false;
                        enableFifthDay              = false;
                        enableFifthChildYearGroup   = false;
                        enableFifthYear             = false;

                        enableSixthChildNameGroup   = false;
                        enableSixthChildName        = false;
                        enableSixthChildMonthGroup  = false;
                        enableSixthMonth            = false;
                        enableSixthChildDayGroup    = false;
                        enableSixthDay              = false;
                        enableSixthChildYearGroup   = false;
                        enableSixthYear             = false;
                        break;
                    default:
                        enableFirstChildNameGroup   = true;
                        enableFirstChildName        = true;
                        enableFirstChildMonthGroup  = true;
                        enableFirstMonth            = true;
                        enableFirstChildDayGroup    = true;
                        enableFirstDay              = true;
                        enableFirstChildYearGroup   = true;
                        enableFirstYear             = true;

                        enableSecondChildNameGroup  = true;
                        enableSecondChildName       = true;
                        enableSecondChildMonthGroup = true;
                        enableSecondMonth           = true;
                        enableSecondChildDayGroup   = true;
                        enableSecondDay             = true;
                        enableSecondChildYearGroup  = true;
                        enableSecondYear            = true;
                        
                        enableThirdChildNameGroup   = true;
                        enableThirdChildName        = true;
                        enableThirdChildMonthGroup  = true;
                        enableThirdMonth            = true;
                        enableThirdChildDayGroup    = true;
                        enableThirdDay              = true;
                        enableThirdChildYearGroup   = true;
                        enableThirdYear             = true;

                        enableForthChildNameGroup   = true;
                        enableForthChildName        = true;
                        enableForthChildMonthGroup  = true;
                        enableForthMonth            = true;
                        enableForthChildDayGroup    = true;
                        enableForthDay              = true;
                        enableForthChildYearGroup   = true;
                        enableForthYear             = true;

                        enableFifthChildNameGroup   = true;
                        enableFifthChildName        = true;
                        enableFifthChildMonthGroup  = true;
                        enableFifthMonth            = true;
                        enableFifthChildDayGroup    = true;
                        enableFifthDay              = true;
                        enableFifthChildYearGroup   = true;
                        enableFifthYear             = true;

                        enableSixthChildNameGroup   = true;
                        enableSixthChildName        = true;
                        enableSixthChildMonthGroup  = true;
                        enableSixthMonth            = true;
                        enableSixthChildDayGroup    = true;
                        enableSixthDay              = true;
                        enableSixthChildYearGroup   = true;
                        enableSixthYear             = true;
                        break;
                }
                firstChildNameGroup.hidden              = enableFirstChildNameGroup;
                firstChildName.disabled                 = enableFirstChildName;
                firstChildMonthGroup.hidden             = enableFirstChildMonthGroup;
                firstChildMonth.disabled                = enableFirstMonth;
                firstChildDayGroup.hidden               = enableFirstChildDayGroup;
                firstChildDay.disabled                  = enableFirstDay;
                firstChildYearGroup.hidden              = enableFirstChildYearGroup;
                firstChildYear.disabled                 = enableFirstYear;

                secondChildNameGroup.hidden             = enableSecondChildNameGroup;
                secondChildName.disabled                = enableSecondChildName;
                secondChildMonthGroup.hidden            = enableSecondChildMonthGroup;
                secondChildMonth.disabled               = enableSecondMonth;
                secondChildDayGroup.hidden              = enableSecondChildDayGroup;
                secondChildDay.disabled                 = enableSecondDay;
                secondChildYearGroup.hidden             = enableSecondChildYearGroup;
                secondChildYear.disabled                = enableSecondYear;

                thirdChildNameGroup.hidden              = enableThirdChildNameGroup;
                thirdChildName.disabled                 = enableThirdChildName;
                thirdChildMonthGroup.hidden             = enableThirdChildMonthGroup;
                thirdChildMonth.disabled                = enableThirdMonth;
                thirdChildDayGroup.hidden               = enableThirdChildDayGroup;
                thirdChildDay.disabled                  = enableThirdDay;
                thirdChildYearGroup.hidden              = enableThirdChildYearGroup;
                thirdChildYear.disabled                 = enableThirdYear;

                forthChildNameGroup.hidden              = enableForthChildNameGroup;
                forthChildName.disabled                 = enableForthChildName;
                forthChildMonthGroup.hidden             = enableForthChildMonthGroup;
                forthChildMonth.disabled                = enableForthMonth;
                forthChildDayGroup.hidden               = enableForthChildDayGroup;
                forthChildDay.disabled                  = enableForthDay;
                forthChildYearGroup.hidden              = enableForthChildYearGroup;
                forthChildYear.disabled                 = enableForthYear;

                fifthChildNameGroup.hidden              = enableFifthChildNameGroup;
                fifthChildName.disabled                 = enableFifthChildName;
                fifthChildMonthGroup.hidden             = enableFifthChildMonthGroup;
                fifthChildMonth.disabled                = enableFifthMonth;
                fifthChildDayGroup.hidden               = enableFifthChildDayGroup;
                fifthChildDay.disabled                  = enableFifthDay;
                fifthChildYearGroup.hidden              = enableFifthChildYearGroup;
                fifthChildYear.disabled                 = enableFifthYear;

                sixthChildNameGroup.hidden              = enableSixthChildNameGroup;
                sixthChildName.disabled                 = enableSixthChildName;
                sixthChildMonthGroup.hidden             = enableSixthChildMonthGroup;
                sixthChildMonth.disabled                = enableSixthMonth;
                sixthChildDayGroup.hidden               = enableSixthChildDayGroup;
                sixthChildDay.disabled                  = enableSixthDay;
                sixthChildYearGroup.hidden              = enableSixthChildYearGroup;
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
