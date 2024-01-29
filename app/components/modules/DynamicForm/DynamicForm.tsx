import React, { useEffect, useRef } from 'react';
import Customizations from '../../filters/Customizations';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

declare global {
  interface Window {
    hbspt: any;
  }
}

interface DynamicFormProps {
  headings: {
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
  };
  formid?: string;
  portalid?: string;
  region?: string;
  version?: string;
  customizations: {
    outerBackgroundColor?: string;
    topMarginMobile?: string;
    topMarginDesktop?: string;
    bottomMarginMobile?: string;
    bottomMarginDesktop?: string;
  };
}

const DynamicForm: React.FC<DynamicFormProps> = ({ headings, customizations, formid, portalid, region, version }) => {
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const createForm = () => {
      if (window.hbspt && formRef.current) {
        window.hbspt.forms.create({
          region: region,
          portalId: portalid,
          formId: formid,
          target: `#${formRef.current.id}`,
          version: version
        });
      } else {
        setTimeout(createForm, 500);
      }
    };

    loadScript('//js.hsforms.net/forms/v2.js', 'hubspot-forms-script')
      .then(() => createForm())
      .catch(error => console.error("Error loading HubSpot script:", error));
  }, []);

  return (
    <Customizations
      topMarginMobile={customizations.topMarginMobile}
      topMarginDesktop={customizations.topMarginDesktop}
      bottomMarginMobile={customizations.bottomMarginMobile}
      bottomMarginDesktop={customizations.bottomMarginDesktop}
      colorLabelOuter={customizations.outerBackgroundColor}
    >
      <div className='dynamic-form'>
        <div className='container'>
          {headings.heading && <Heading level='h2' color={headings.headingColor}>{headings.heading}</Heading>}
          {headings.subheading && <Subheading level='div' className='b3' color={headings.subheadingColor}>{headings.subheading}</Subheading>}
          <div ref={formRef} id="hubspotForm" className='form'></div>
        </div>
      </div>
    </Customizations>
  );
};

export default DynamicForm;
