import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

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
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const TwoColumnsImageAndText: React.FC<TwoColumnsImageAndTextProps> = ({ leftColumn, rightColumn, switchColumnOrderOnDesktop, customizations }) => {
    const className = `two-columns-image-and-text ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;

    return (
        <div className='container'>
             <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
            <div className={className}>
                {(leftColumn?.imageDesktop?.sourceUrl || leftColumn?.imageMobile?.sourceUrl) && (
                    <div className='left-column col-12 col-lg-5 offset-lg-1'>
                        {leftColumn?.imageMobile?.sourceUrl && 
                            <Image 
                                className='d-block d-lg-none' 
                                src={leftColumn.imageMobile.sourceUrl} 
                                alt='Featured Image Mobile' 
                                width={500} 
                                height={500} 
                            />
                        }
                        {leftColumn?.imageDesktop?.sourceUrl && 
                            <Image 
                                className='d-none d-lg-block' 
                                src={leftColumn.imageDesktop.sourceUrl} 
                                alt='Featured Image Desktop' 
                                width={1000} 
                                height={1000} 
                            />
                        }
                    </div>
                )}
                <div className='right-column col-12 c col-lg-5 offset-lg-1'>
                    {rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}
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
