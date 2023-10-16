import React from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

interface HeroWithImageProps {
    leftColumn?: {
      image?: {
        sourceUrl?: string;
      };
    };
    rightColumn?: {
        heading?: string;
		headingColor?: string;
		subheading?: string;
        subheadingColor?: string;
        blurb?: string;
        blurbColor?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
        buttonStyle?: 'primary' | 'secondary' | 'white'; 
    };
    accent?: {
        sourceUrl?: string;
    };
    switchColumnOrderOnDesktop?: boolean;
    customizations?: {
        backgroundColor?: string;
        topMarginMobile?: string;
        topMarginDesktop?: string;
        bottomMarginMobile?: string;
        bottomMarginDesktop?: string;
    };
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ accent, switchColumnOrderOnDesktop, leftColumn, rightColumn, customizations }) => {
    const className = `hero-with-image ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;

    return (
        <div className='container'>
              <Customizations 
                colorLabel={customizations?.backgroundColor} 
                topMarginMobile={customizations?.topMarginMobile}
                topMarginDesktop={customizations?.topMarginDesktop}
                bottomMarginMobile={customizations?.bottomMarginMobile}
                bottomMarginDesktop={customizations?.bottomMarginDesktop}
            >
            <div className={className}>
                {leftColumn?.image?.sourceUrl && (
                    <div className='left-column col-12 col-lg-6'>
                        <Image src={leftColumn.image.sourceUrl} alt="Hero Image" layout="fill" objectFit="cover" sizes='large' />
                    </div>
                )}
                { (rightColumn?.heading || rightColumn?.subheading || rightColumn?.blurb || rightColumn?.button?.url) && (
                    <div className='right-column col-12 col-lg-6'>
                       {rightColumn.heading && <Heading level='h2' color={rightColumn.headingColor}>{rightColumn.heading}</Heading>}
						{rightColumn.subheading && <Subheading level='h5' color={rightColumn.subheadingColor}>{rightColumn.subheading}</Subheading>}
                        {rightColumn?.blurb && <Paragraph className='b2' color={rightColumn.blurbColor}>{rightColumn.blurb}</Paragraph>}
                        {rightColumn.button?.url && rightColumn.button.title && (
							<Button variant={rightColumn.buttonStyle || 'primary'} href={rightColumn.button.url} target={rightColumn.button.target || '_self'}>
								{rightColumn.button.title}
							</Button>
						)}
                    </div>
                )}
                <div className='accent'
				    style={{ backgroundImage: `url('${accent?.sourceUrl}')` }} 
			    ></div>
            </div>
            </Customizations>
        </div>
    );
}

export default HeroWithImage;
