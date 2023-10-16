import React from 'react';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Customizations from '../../filters/Customizations';

interface NewsletterFormCTAProps {
    heading?: string;
	headingColor?: string;
	subheading?: string;
    subheadingColor?: string;
    accentOne?: { sourceUrl: string }; 
    accentTwo?: { sourceUrl: string }; 
    customizations?: {
        backgroundColor?: string;
        topMarginMobile?: string;
        topMarginDesktop?: string;
        bottomMarginMobile?: string;
        bottomMarginDesktop?: string;
    };
}

const NewsletterFormCTA: React.FC<NewsletterFormCTAProps> = ({ heading, headingColor, subheading, subheadingColor, accentOne, accentTwo, customizations }) => {
    return (
       
        <div className='container'>
            <Customizations 
            colorLabel={customizations?.backgroundColor} 
            topMarginMobile={customizations?.topMarginMobile}
            topMarginDesktop={customizations?.topMarginDesktop}
            bottomMarginMobile={customizations?.bottomMarginMobile}
            bottomMarginDesktop={customizations?.bottomMarginDesktop}
            >
            <div className='newsletter-form-cta'>
                <div className='row'>
                    <div className='col-12 content'>
                        {heading && <Heading level='h3' color={headingColor}>{heading}</Heading>}
						{subheading && <Paragraph className='b3' color={subheadingColor}>{subheading}</Paragraph>}
                        <NewsletterForm />
                        <div className='accent-one'
                             style={{ backgroundImage: `url('${accentOne?.sourceUrl}')` }} 
                        ></div>
                        <div className='accent-two'
                             style={{ backgroundImage: `url('${accentTwo?.sourceUrl}')` }} 
                        ></div>
                    </div>
                </div>
            </div>
            </Customizations>
        </div>
    );
}

export default NewsletterFormCTA;
