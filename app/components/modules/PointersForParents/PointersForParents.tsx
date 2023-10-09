import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';

interface PointersForParentsProps {
    pfpHeading?: string;
    pfpSubheading?: string;
}

const PointersForParents: React.FC<PointersForParentsProps> = ({ pfpHeading, pfpSubheading }) => {
    return (
        <div className='container'>
            <div className='pointers-for-parents'>
                <div className='row'>
                    <div className='col-12 content'>
                        {pfpHeading && <Heading level='h3'>{pfpHeading}</Heading>}
                        {pfpSubheading && <Paragraph className='b3'>{pfpSubheading}</Paragraph>}
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PointersForParents;
