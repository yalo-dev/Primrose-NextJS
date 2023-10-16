import React from 'react';
import Image from 'next/image';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';

interface GeneralButtonCTAProps {
	accents: {
        accentOne?: {
            sourceUrl?: string;
        }
        accentTwo?: {
            sourceUrl?: string;
        }
    }
	icon?: {
		sourceUrl?: string;
	};
	heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
	button?: {
		target?: string;
		title?: string;
		url?: string;
	};
	buttonStyle?: 'primary' | 'secondary' | 'white'; 
	variation?: 'default' | 'blue' | 'violet' | 'green';
    customizations?: {
        backgroundColor?: string;
        topMarginMobile?: string;
        topMarginDesktop?: string;
        bottomMarginMobile?: string;
        bottomMarginDesktop?: string;
    };
}

const GeneralButtonCTA: React.FC<GeneralButtonCTAProps> = ({ accents, icon, heading, headingColor, subheading, subheadingColor, button, buttonStyle, variation = 'default', customizations }) => {
	const className = `general-button-cta d-lg-flex ${variation}`;

	return (
		<div className='container'>
			{(heading || subheading || (button?.url) || icon?.sourceUrl) && (
			  <Customizations 
                colorLabel={customizations?.backgroundColor} 
                topMarginMobile={customizations?.topMarginMobile}
                topMarginDesktop={customizations?.topMarginDesktop}
                bottomMarginMobile={customizations?.bottomMarginMobile}
                bottomMarginDesktop={customizations?.bottomMarginDesktop}
            >
				<div className={className}>
					{icon?.sourceUrl && (
						<div className='icon pb-4 pb-lg-0 pe-lg-4'>
							<Image src={icon.sourceUrl} alt="Icon" width={75} height={75} />
						</div>
					)}
					<div className='wrapper'>
						{heading && <Heading level='h2' color={headingColor}>{heading}</Heading>}
						{subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
						{button?.url && button.title && (
							<Button variant={buttonStyle || 'primary'} href={button.url} target={button.target || '_self'}>
								{button.title}
							</Button>
						)}
					</div>
					<div className='accent'>
						<div className='accent-one'
							style={{ backgroundImage: `url('${accents.accentOne?.sourceUrl}')` }} 
						></div>
						<div className='accent-two'
							style={{ backgroundImage: `url('${accents.accentTwo?.sourceUrl}')` }} 
						></div>
					</div>
				</div>
			
			</Customizations>
			)}
		</div>
	);
}

export default GeneralButtonCTA;
