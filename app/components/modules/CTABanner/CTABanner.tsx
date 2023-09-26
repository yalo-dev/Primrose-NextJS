import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button/Button';

export default function CTABanner({ ctaHeading, ctaButton }) {
  return (
    <div className='cta-banner ps-4 pe-4 ps-lg-5 pe-lg-5'>
      <div className='accents container'></div>
      <div className='container'>
        <div className='row'>
          <div className='col-12 top'>
            <Image
              src="/assets/cta-banner-bg.png"
              alt="teacher teaching a child"
              width={200}
              height={200}
            />
          </div>
          <div className='col-12 bottom'>
            <h2>{ctaHeading}</h2>
            <Button
              variant="white"
              label={ctaButton.title}
              href={ctaButton.url}
              target={ctaButton.target}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
