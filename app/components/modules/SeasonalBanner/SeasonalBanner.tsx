import React from 'react';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';

interface SeasonalButtonProps {
    title?: string;
    url?: string;
    target?: string;
}

interface SeasonalBannerProps {
    image?: {
        sourceUrl?: string;
        altText?: string;
      };
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
    button?: SeasonalButtonProps;
    buttonStyle?: 'primary' | 'secondary' | 'white'; 
    accentOne?: { sourceUrl: string }; 
    accentTwo?: { sourceUrl: string };
    accentThree?: { sourceUrl: string }; 
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        backgroundColor?: string;
	};
}

const SeasonalBanner: React.FC<SeasonalBannerProps> = ({ image, heading, headingColor, subheading, subheadingColor, buttonStyle, button, accentOne, accentTwo, accentThree, customizations }) => {

    return (
        <div className="container">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor} 
	   >
            <div className='seasonal-banner'>
                <div className='row'>
                    <div className='col-12 col-lg-6 top'>
                        <img
                            src={image?.sourceUrl}
                            alt={image?.altText || 'Seasonal Banner Image'}
                            width={250}
                            height={250}
                        />
                    </div>
                    <div className='col-12 col-lg-6 bottom'>
                    {heading && <Heading level='h3' color={headingColor}>{heading}</Heading>}
                    {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}

                    {button?.url && button.title && (
                        <Button variant={buttonStyle || 'primary'} href={button.url} target={button.target || '_self'}>
                            {button.title}
                        </Button>
                    )}
                    </div>
                    <div className='accent-one'
                         style={{ backgroundImage: `url('${accentOne?.sourceUrl}')` }} 
                    ></div>
                    <div className='accent-two'
                         style={{ backgroundImage: `url('${accentTwo?.sourceUrl}')` }} 
                    ></div>
                     <div className='accent-three'
                         style={{ backgroundImage: `url('${accentThree?.sourceUrl}')` }} 
                    ></div>
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default SeasonalBanner;
