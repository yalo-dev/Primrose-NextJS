import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';

interface TwoColumnsFeaturedImageProps {
    leftColumn?: {
        heading?: string;
        subheading?: string;
        blurb?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
    };
    rightColumn?: {
        image?: {
            sourceUrl?: string;
        };
    };
}

const TwoColumnsFeaturedImage: React.FC<TwoColumnsFeaturedImageProps> = ({ leftColumn, rightColumn }) => {
    return (
        <div className='container'>
            <div className='two-columns-featured-image'>
                <div className='left-column col-12 col-lg-6 col-xl-5'>
                    {leftColumn?.heading && <Heading level='h2'>{leftColumn.heading}</Heading>}
                    {leftColumn?.subheading && <Subheading level='h5'>{leftColumn.subheading}</Subheading>}
                    {leftColumn?.blurb && <Paragraph className='b3'>{leftColumn.blurb}</Paragraph>}
                    {leftColumn?.button?.url && (
                        <Button href={leftColumn.button.url} target={leftColumn.button.target} label={leftColumn.button.title}>
                            {leftColumn.button.title}
                        </Button>
                    )}
                </div>
                {rightColumn?.image?.sourceUrl && (
                    <div className='right-column col-12 col-lg-6'>
                        <Image src={rightColumn.image.sourceUrl} alt='Featured Image' width={1000} height={1000} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TwoColumnsFeaturedImage;
