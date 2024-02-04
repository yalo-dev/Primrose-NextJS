import React from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';

interface TwoColumnsFeaturedBlockProps {
    switchColumnOrderOnDesktop?: boolean;
    centerModule?: boolean;
    rightColumn?: {
        icon?: {
            sourceUrl?: string;
            altText?: string;
        };
        heading?: string;
        subheading?: string;
        blurb?: string;
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

const TwoColumnsImageAndText: React.FC<TwoColumnsFeaturedBlockProps> = ({ leftColumn, rightColumn, switchColumnOrderOnDesktop, centerModule, customizations }) => {
    const className = `two-columns-featured-block ${switchColumnOrderOnDesktop ? 'reverse-column' : ''} ${centerModule ? 'center' : ''}`;

    const mobileImageUrl = leftColumn?.imageMobile?.sourceUrl || leftColumn?.imageDesktop?.sourceUrl;
    const desktopImageUrl = leftColumn?.imageDesktop?.sourceUrl;
    const iconImageUrl = rightColumn?.icon?.sourceUrl || rightColumn?.icon?.sourceUrl;

   return (
        <div className='container'>
             <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
            <div className={className}>
                {(mobileImageUrl || desktopImageUrl) && (
                    <div className='left-column'>
                        {mobileImageUrl && 
                            <img 
                                className='d-block d-lg-none' 
                                src={mobileImageUrl} 
                                alt={leftColumn?.imageMobile?.altText || '' } 
                                width={500} 
                                height={500} 
                            />
                        }
                        {desktopImageUrl && 
                            <img 
                                className='d-none d-lg-block' 
                                src={desktopImageUrl} 
                                alt={leftColumn?.imageDesktop?.altText || '' } 
                                width={1000} 
                                height={1000} 
                            />
                        }
                </div>
                )}
                <div className='right-column'>
                    {iconImageUrl && 
                        <div className='icon'>
                            <img 
                            className='mb-3' 
                            src={iconImageUrl} 
                            alt={leftColumn?.imageDesktop?.altText || '' } 
                            width={64} 
                            height={64} 
                        />
                        </div>
                    }
                    {rightColumn?.heading && <Heading level='h2'>{rightColumn.heading}</Heading>}
                    {rightColumn?.subheading && <Subheading level='h5'>{rightColumn.subheading}</Subheading>}
                    {rightColumn?.blurb && <div className='blurb' dangerouslySetInnerHTML={{ __html: rightColumn.blurb }} />}
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default TwoColumnsImageAndText;
