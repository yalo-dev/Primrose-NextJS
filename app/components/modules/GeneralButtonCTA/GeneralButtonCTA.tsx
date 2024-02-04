import React from 'react';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';


interface OptionType {
    label: string;
    url: string;
    target?: string;
}

interface GeneralButtonCTAProps {
	accents?: {
        accentOne?: {
            sourceUrl?: string;
        }
        accentTwo?: {
            sourceUrl?: string;
        }
    }
	icon?: {
		sourceUrl?: string;
		altText?: string;
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
	image?: {
		sourceUrl?: string;
		altText?: string;
	};
	dropdown?: {
		option?: {
			target?: string;
			title?: string;
			url?: string;
		}[];
	};
	buttonStyle?: 'primary' | 'secondary' | 'white'; 
	variation?: 'default' | 'blue' | 'violet' | 'green';
    customizations?: {
        backgroundColor?: string;
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
    };
}

const GeneralButtonCTA: React.FC<GeneralButtonCTAProps> = ({ accents, icon, heading, headingColor, subheading, subheadingColor, button, buttonStyle, variation = 'default', customizations, image, dropdown }) => {
	
	const className = `general-button-cta d-lg-flex ${variation}`;
	
	
	let dropdownOptions: OptionType[] = [];

    if (dropdown && Array.isArray(dropdown)) {
        dropdownOptions = dropdown.flatMap(dropItem => {
            if (dropItem.option) {
                return {
                    label: dropItem.option.title || "", 
                    url: dropItem.option.url || "", 
                    target: dropItem.option.target || "_self"
                };
            }
            return [];
        });
    }

	return (
		<div className="container jumbo">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor}
	   >
					<div 
						className={className} 
						id={dropdownOptions.length > 0 ? 'selectActive' : image?.sourceUrl ? 'imageActive' : undefined}
					>
					{icon?.sourceUrl && (
						<div className='icon pb-4 pb-lg-0 pe-lg-5'>
							<img src={icon.sourceUrl} alt={icon.altText || ''}  width={75} height={75} />
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
						{image?.sourceUrl && (
                            <div className="image-wrap">
                                <img src={image.sourceUrl} alt={image.altText || ''}  width={500} height={300} />
                            </div>
                        )}

					
					{(dropdownOptions.length > 0) && (
                        <SelectDropdown options={dropdownOptions} />
                    )}	
                

					</div>
					
				</div>
			
			</Customizations>
		</div>
	);
}

export default GeneralButtonCTA;
