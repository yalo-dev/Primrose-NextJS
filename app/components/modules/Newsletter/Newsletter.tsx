import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';

const Newsletter = () => {
    return (
        <div className='newsletter--container'>
            <div className='container p-4'>
                <div className='row text-lg-start'>
                    <div className='col-12 col-lg-5 offset-lg-6'>
                        <h2 className='heading'>Join Our Newsletter</h2>
                        <p className='subheading'>Get a preview of the curriculum and early education tips from Primrose.  👍</p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
