import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';

interface TwoColumnsImageAndTextProps {
    switchColumnOrderOnDesktop?: boolean;
    rightColumn?: {
        heading?: string;
        subheading?: string;
        blurb?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
    };
    leftColumn?: {
        imageDesktop?: {
            sourceUrl?: string;
        };
        imageMobile?: {
            sourceUrl?: string;
        };
    };
}

const TwoColumnsImageAndText: React.FC<TwoColumnsImageAndTextProps> = ({ leftColumn, rightColumn, switchColumnOrderOnDesktop }) => {
    const className = `two-columns-image-and-text ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;
    return (
        <div className='container'>
            <div className={className}>
                {( leftColumn?.imageDesktop?.sourceUrl || leftColumn?.imageMobile?.sourceUrl ) && (
                    <div className='left-column col-12 col-lg-6'>
                       {leftColumn?.imageMobile?.sourceUrl && 
                        <Image 
                            className='d-block d-lg-none' 
                            src={leftColumn.imageMobile.sourceUrl} 
                            alt='Featured Image' 
                            width={500} 
                            height={500} 
                        />
                    }

                    {leftColumn?.imageDesktop?.sourceUrl && 
                        <Image 
                            className='d-none d-lg-block' 
                            src={leftColumn.imageDesktop.sourceUrl} 
                            alt='Featured Image' 
                            width={1000} 
                            height={1000} 
                        />
                    }
                    </div>
                )}
                <div className='right-column col-12 col-lg-6'>
                    {rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}
                    {rightColumn?.subheading && <Subheading level='h5'>{rightColumn.subheading}</Subheading>}
                    {rightColumn?.blurb && 
                        <div className='blurb' dangerouslySetInnerHTML={{ __html: rightColumn.blurb }}></div>
                    }
                    {rightColumn?.button?.url && (
                        <Button href={rightColumn.button.url} target={rightColumn.button.target} label={rightColumn.button.title}>
                            {rightColumn.button.title}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TwoColumnsImageAndText;
