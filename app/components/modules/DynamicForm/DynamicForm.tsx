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
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        outerBackgroundColor?: string;
    };
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form, headings, customizations }) => {
    const { heading, headingColor, subheading, subheadingColor } = headings || {};
     

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (form && formRef.current) {
            // Function to load the external HubSpot script
            const loadExternalScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            };
    
            // Function to create and execute inline script from the form prop
            const executeInlineScript = () => {
                const inlineScriptMatch = form.match(/<script>(.*?)<\/script>/s);
                if (inlineScriptMatch && inlineScriptMatch[1] && formRef.current) {
                    const scriptContent = inlineScriptMatch[1].trim();
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML = scriptContent;
                    formRef.current.appendChild(script);
                }
            };
    
            // Load the external script and then execute the inline script
            loadExternalScript('//js.hsforms.net/forms/v2.js')
                .then(executeInlineScript)
                .catch(error => console.error('Script loading failed:', error));
        }
    }, [form]);
    
       

    return (
        <Customizations
            topPaddingMobile={customizations?.topPaddingMobile}
            topPaddingDesktop={customizations?.topPaddingDesktop}
            bottomPaddingMobile={customizations?.bottomPaddingMobile}
            bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
            colorLabelOuter={customizations?.outerBackgroundColor}
        >
            <div className='container'>
                {(heading || subheading) && (
                    <div className="heading-wrapper">
                        {heading && <Heading level='h2' color={headingColor}>{heading}</Heading>}
                        {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                    </div>
                )}
                <div ref={formRef} className='form'></div>
            </div>
        </Customizations>
    );
}

export default DynamicForm;
