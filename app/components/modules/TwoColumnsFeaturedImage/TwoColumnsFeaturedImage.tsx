import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

interface Content {
    imageOrVideo?: 'Image' | 'Video';
    image?: {
        sourceUrl?: string;
        altText?: string;
    }
    video?: {
        target?: string;
        title?: string;
        url?: string;
    }
} 

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
            altText?: string;
        };
        imageTwo?: {
            sourceUrl?: string; 
            altText?: string;
        }
        content?: Content; 
    };
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const TwoColumnsFeaturedImage: React.FC<TwoColumnsFeaturedImageProps> = ({ leftColumn, rightColumn, customizations }) => {
    return (
        <div className='container'>
        <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
            <div className='two-columns-featured-image'>
                <div className='left-column col-12 col-lg-6 col-xl-5'>
                    {leftColumn?.heading && <Heading level='h2'>{leftColumn.heading}</Heading>}
                    {leftColumn?.subheading && <Subheading level='h5'>{leftColumn.subheading}</Subheading>}
                    {leftColumn?.blurb && <Paragraph className='b3'>{leftColumn.blurb}</Paragraph>}
                    {leftColumn?.button?.url && leftColumn?.button?.title && (
                        <Button href={leftColumn.button.url} target={leftColumn.button.target} label={leftColumn.button.title}>
                            {leftColumn.button.title}
                        </Button>
                    )}
                </div>
                
                <div className='right-column col-12 col-lg-6'>
                    {rightColumn?.image?.sourceUrl && (
                       <div className='img1'> <img src={rightColumn.image.sourceUrl} alt={rightColumn.image.altText || ''} width={312} height={238} /></div>
                    )}
                    {rightColumn?.imageTwo?.sourceUrl && (
                        <div className='img2'>  <img src={rightColumn.imageTwo.sourceUrl} alt={rightColumn.imageTwo.altText || ''} width={312} height={338} /></div>
                    )}
                    {rightColumn?.content?.imageOrVideo === 'Image' && rightColumn?.content?.image?.sourceUrl && (
                        <div className='img3'>  <img src={rightColumn?.content?.image?.sourceUrl} alt={rightColumn?.content?.image?.altText} /></div>
                    )}

                    {rightColumn?.content?.imageOrVideo === 'Video' && rightColumn.content.video?.url && (
                        <div className='vid'> 
                         <video width="100%" height="auto" muted autoPlay loop>
                            <source src={rightColumn.content.video.url} type="video/mp4" /> {/* adjust the type attribute as needed */}
                            Your browser does not support the video tag.
                        </video>
                        </div>
                    )}
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default TwoColumnsFeaturedImage;
