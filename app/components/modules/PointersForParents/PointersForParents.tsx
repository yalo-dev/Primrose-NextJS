import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

export default function PointersForParents({ pfpHeading, pfpSubheading }) {
  return (
    <div className='container'>
      <div className='pointers-for-parents'>
        <div className='row'>
          <div className='col-12 content'>
            <Heading level='h3'>{pfpHeading}</Heading>
            <Paragraph className='b3'>{pfpSubheading}</Paragraph>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
