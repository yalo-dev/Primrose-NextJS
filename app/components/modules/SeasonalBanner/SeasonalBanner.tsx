import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default function SeasonalBanner({ seasonalHeading, seasonalSubheading, seasonalButton }) {
  return (
    <div className='container'>
      <div className='seasonal-banner'>
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
            <Heading level='h3'>{seasonalHeading}</Heading>
            {/* <Paragraph className='b3'>Lorem ipsum dolor sit amet consectetur. Aliquet at et aliquam scelerisque volutpat. Egestas in ac netus porttitor eget mollis.</Paragraph> */}
            <Paragraph className='b3'>{seasonalSubheading}</Paragraph>
            <Button
              variant="primary"
              label={seasonalButton.title}
              href={seasonalButton.url}
              target={seasonalButton.target}
            />
            <div className='accents'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
