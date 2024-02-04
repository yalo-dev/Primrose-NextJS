import React from 'react';
import Image from "next/legacy/image";
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';
import parse from 'html-react-parser';

interface HeroWithImageProps {
    leftColumn?: {
      image?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
    rightColumn?: {
        eyebrow?: string;
        eyebrowColor?: string;
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
        buttonStyle?: string; 
    };
    accent?: {
        sourceUrl?: string;
    };
    switchColumnOrderOnDesktop?: boolean;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        backgroundColor?: string;
	};
}

const HeroWithImage: React.FC<HeroWithImageProps> = ({ accent, switchColumnOrderOnDesktop, leftColumn, rightColumn, customizations }) => {
    const className = `hero-with-image ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;

    return (
        <div className="container jumbo">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor} 
	   >
            <div className={className}>
                {leftColumn?.image?.sourceUrl && (
                    <div className='left-column col-12 col-lg-6'>
                        <img src={leftColumn.image.sourceUrl} alt={leftColumn.image.altText || ''} />
                    </div>
                )}
                { (rightColumn?.heading || rightColumn?.subheading || rightColumn?.blurb || rightColumn?.button?.url) && (
                    <div className='right-column col-12 col-lg-6'>
                        {rightColumn.eyebrow && <Subheading level='div' className='h5' color={rightColumn.eyebrowColor}>{rightColumn.eyebrow}</Subheading>}
                        {rightColumn.heading && <Heading level='h1' color={rightColumn.headingColor}>{rightColumn.heading}</Heading>}
						{rightColumn.subheading && <Subheading level='h5' color={rightColumn.subheadingColor}>{rightColumn.subheading}</Subheading>}
                        {rightColumn?.blurb && <Paragraph className='b2' color={rightColumn.blurbColor}>{parse(rightColumn.blurb)}</Paragraph>}
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
