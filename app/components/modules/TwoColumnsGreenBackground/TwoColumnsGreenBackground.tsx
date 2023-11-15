import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

interface TwoColumnsGreenBackground {
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
            altText?: string;
        };
        imageMobile?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const TwoColumnsImageAndText: React.FC<TwoColumnsGreenBackground> = ({ leftColumn, rightColumn, customizations }) => {

    // Use imageDesktop as fallback if imageMobile is not available
    const mobileImageUrl = leftColumn?.imageMobile?.sourceUrl || leftColumn?.imageDesktop?.sourceUrl;
    const desktopImageUrl = leftColumn?.imageDesktop?.sourceUrl;


   return (
        <div className='container'>
             <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
            <div className='two-columns-green-background'>
                {(mobileImageUrl || desktopImageUrl) && (
                    <div className='left-column col-12 col-lg-5 offset-lg-1'>
                       <div className='d-block d-lg-none mb-4'>{rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}</div>
                        {mobileImageUrl && 
                            <Image 
                                className='d-block d-lg-none' 
                                src={mobileImageUrl} 
                                alt={leftColumn?.imageMobile?.altText || '' } 
                                width={500} 
                                height={500} 
                            />
                        }
                        {desktopImageUrl && 
                            <Image 
                                className='d-none d-lg-block' 
                                src={desktopImageUrl} 
                                alt={leftColumn?.imageDesktop?.altText || '' } 
                                width={1000} 
                                height={1000} 
                            />
                        }
                </div>
                )}
                <div className='right-column col-12 c col-lg-5 offset-lg-1'>
                    <div className='d-none d-lg-block'>{rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}</div>
                    {rightColumn?.subheading && <Subheading level='h5'>{rightColumn.subheading}</Subheading>}
                    {rightColumn?.blurb && <div className='blurb' dangerouslySetInnerHTML={{ __html: rightColumn.blurb }} />}
                    {rightColumn?.button?.url && rightColumn?.button?.title && (
                        <Button href={rightColumn.button.url} target={rightColumn.button.target} label={rightColumn.button.title}>
                            {rightColumn.button.title}
                        </Button>
                    )}
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default TwoColumnsImageAndText;
