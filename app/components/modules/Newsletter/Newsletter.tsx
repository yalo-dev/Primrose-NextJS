import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

interface NewsletterProps {
    heading?: string;
    blurb?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ heading = "Join Our Newsletter", blurb }) => {
    return (
        <div className='newsletter pt-5 pb-5 ps-2 pe-2'>
            <div className='container p-4'>
                <div className='row text-lg-start'>
                    <div className='col-12 col-lg-5 offset-lg-6'>
                        {heading && <Heading level='h2' className='heading'>{heading}</Heading>}
                        {blurb && <Paragraph className="blurb">{blurb}</Paragraph>}
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
