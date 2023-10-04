import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default function CTABanner({ ctaHeading, ctaSubheading, ctaButton }) {
  return (
    <div className='container'>
      <div className='cta-banner'>
        <div className='row'>
          <div className='col-12 col-lg-6 top'>
            <div className='accents'></div>
            <Image
              src="/assets/stock-seasonal-baby.png"
              alt="seasonal baby picture"
              width={250}
              height={250}
            />
          </div>
          <div className='col-12 col-lg-6 bottom'>
            <Heading level='h3'>{ctaHeading}</Heading>
            <Paragraph className='b3'>Lorem ipsum dolor sit amet consectetur. Aliquet at et aliquam scelerisque volutpat. Egestas in ac netus porttitor eget mollis.</Paragraph>
            <Button
              variant="primary"
              label={ctaButton.title}
              href={ctaButton.url}
              target={ctaButton.target}
            />
            <div className='accents'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
