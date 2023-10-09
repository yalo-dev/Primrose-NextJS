import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

interface GeneralButtonCTAProps {
  heading?: string;
  subheading?: string;
  button?: {
    target?: string;
    title?: string;
    url?: string;
  };
  icon?: {
    sourceUrl?: string;
  };
  variation?: 'default' | 'blue' | 'purple' | 'green';
}

const GeneralButtonCTA: React.FC<GeneralButtonCTAProps> = ({ heading, subheading, button, icon, variation = 'default' }) => {
  const className = `general-button-cta d-lg-flex ${variation}`;

  return (
    <div className='container'>
        <div className={className}>
        {icon?.sourceUrl && (
            <div className='icon pb-4 pb-lg-0 pe-lg-4'>
                <Image src={icon.sourceUrl} alt="Icon" width={75} height={75} />
            </div>
        )}
            <div className='wrapper'>
                {heading && <Heading level='h2'>{heading}</Heading>}
                {subheading && <Subheading level='div' className='b3'>{subheading}</Subheading>}
                {button?.url && (
                    <Button href={button.url} target={button.target} label={button.title}>
                    {button.title}
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}

export default GeneralButtonCTA;
