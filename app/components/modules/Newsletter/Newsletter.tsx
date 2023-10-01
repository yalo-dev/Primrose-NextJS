import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

const Newsletter = () => {
    return (
        <div className='newsletter pt-5 pb-5 ps-2 pe-2'>
            <div className='container p-4'>
                <div className='row text-lg-start'>
                    <div className='col-12 col-lg-5 offset-lg-6'>
                        <Heading level='h2' className='heading'>Join Our Newsletter</Heading>
                        <Paragraph className="blurb">Get a preview of the curriculum and early education tips from Primrose.  👍</Paragraph>
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
