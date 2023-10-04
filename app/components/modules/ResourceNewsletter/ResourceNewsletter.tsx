import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default function ResourceNewsletter({ newsletterHeading, newsletterSubheading }) {
  return (
    <div className='container'>
      <div className='resource-newsletter'>
        <div className='row'>
          <div className='col-12 content'>
            <Heading level='h3'>{newsletterHeading}</Heading>
            <Paragraph className='b3'>{newsletterSubheading}</Paragraph>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
