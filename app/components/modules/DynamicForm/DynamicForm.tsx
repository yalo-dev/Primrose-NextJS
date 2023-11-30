// import React, { useEffect, useRef } from 'react';
// import Customizations from '../../filters/Customizations';
// // ... other imports


// interface DynamicFormProps {
//     form?: string;
//     headings?: {
//         heading?: string;
//         headingColor?: string;
//         subheading?: string;
//         subheadingColor?: string;
//     };
//     customizations?: {
//         topMarginMobile?: string;
//         topMarginDesktop?: string;
//         bottomMarginMobile?: string;
//         bottomMarginDesktop?: string;
//         outerBackgroundColor?: string;
//     };
// }


// const DynamicForm: React.FC<DynamicFormProps> = ({ form, headings, customizations }) => {
//     const formRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!form || typeof window === "undefined") return;

//         // Directly inject the form HTML
//         const currentFormRef = formRef.current;
//         if (currentFormRef) {
//             currentFormRef.innerHTML = form;

//             // Find and execute any inline scripts within the form
//             Array.from(currentFormRef.querySelectorAll("script")).forEach((script) => {
//                 const newScript = document.createElement('script');
//                 newScript.text = script.text;
//                 currentFormRef.appendChild(newScript);
//                 script.parentNode?.removeChild(script);
//             });
//         }
//     }, [form]);

//     return (
//         <Customizations {...customizations}>
//             <div className='dynamic-form'>
//                 <div className='container'>
//                     {/* Heading and Subheading */}
//                     <div ref={formRef} className='form'></div>
//                 </div>
//             </div>
//         </Customizations>
//     );
// };

// export default DynamicForm;



import React, { useEffect, useRef } from 'react';
import Customizations from '../../filters/Customizations';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

interface DynamicFormProps {
    form?: string;
    headings?: {
        heading?: string;
        headingColor?: string;
        subheading?: string;
        subheadingColor?: string;
    };
    customizations?: {
        topMarginMobile?: string;
        topMarginDesktop?: string;
        bottomMarginMobile?: string;
        bottomMarginDesktop?: string;
        outerBackgroundColor?: string;
    };
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form, headings, customizations }) => {
    const { heading, headingColor, subheading, subheadingColor } = headings || {};
     
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !form || !formRef.current) return;
    
        const loadHubSpotScript = () => {
            return new Promise<void>((resolve, reject) => {
                const scriptId = 'hubspot-forms-script';
                if (document.getElementById(scriptId)) {
                    resolve();
                    return;
                }
    
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = '//js.hsforms.net/forms/v2.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load HubSpot script'));
                document.body.appendChild(script);
            });
        };
    
        loadHubSpotScript().then(() => {
            const currentFormRef = formRef.current;
            if (!currentFormRef) return;
    
            currentFormRef.innerHTML = form;
    
            // Execute inline scripts if any
            const scripts = currentFormRef.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const oldScript = scripts[i];
                const newScript = document.createElement("script");
                newScript.type = oldScript.type;
                if (oldScript.innerHTML) {
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                } else if (oldScript.src) {
                    newScript.src = oldScript.src;
                }
                oldScript.parentNode?.replaceChild(newScript, oldScript);
            }
        }).catch(error => {
            console.error("Error loading HubSpot script: ", error);
        });
    
    }, [form]);
    
    
       

    return (
        <Customizations
            topMarginMobile={customizations?.topMarginMobile}
            topMarginDesktop={customizations?.topMarginDesktop}
            bottomMarginMobile={customizations?.bottomMarginMobile}
            bottomMarginDesktop={customizations?.bottomMarginDesktop}
            colorLabelOuter={customizations?.outerBackgroundColor} 
        ><div className='dynamic-form'>
            <div className='container'>
                {(heading || subheading) && (
                    <div className="heading-wrapper">
                        {heading && <Heading level='h2' color={headingColor}>{heading}</Heading>}
                        {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                    </div>
                )}
                <div ref={formRef} className='form'></div> 
            </div>
            </div>
        </Customizations>
    );
}

export default DynamicForm;

