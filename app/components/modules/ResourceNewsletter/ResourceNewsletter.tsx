import React from 'react';
import Image from 'next/image';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';

export default function ResourceNewsletter({ newsletterHeading, newsletterSubheading }) {
  return (
    <div className='resource-newsletter'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-lg-6 top'>
            <Image
              src="/assets/parent-signup-graphic.png"
              alt="family of mom dad and child"
              width={200}
              height={200}
            />
          </div>
          <div className='col-12 col-lg-6 bottom'>
            <h2>{newsletterHeading}</h2>
            <p>{newsletterSubheading}</p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
