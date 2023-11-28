import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';

interface IconProps {
    sourceUrl: string;
    altText: string;
}

interface ListItemProps {
    detailsPopUp: string;
    description: string;
    title: string;
    icon: IconProps;
}

interface Q1SkillsProps {
    eyebrow: string;
    eyebrowColor?: string;
    heading: string;
    headingColor?: string;
    subheading: string;
    subheadingColor?: string;
    list: ListItemProps[];
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        backgroundColor?: string;
	};
   
}

const Q1Skills: React.FC<Q1SkillsProps> = ({ eyebrow, eyebrowColor, heading, headingColor, subheading, subheadingColor, list, customizations }) => {
    const [activePopup, setActivePopup] = useState<number | null>(null);
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const handleIconClick = (idx: number) => {
        if (window.innerWidth < 992) {
            setActivePopup(prev => (prev === idx ? null : idx));
        }
    };

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (window.innerWidth < 992 && activePopup !== null && !buttonsRef.current[activePopup]?.contains(event.target as Node)) {
                setActivePopup(null);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [activePopup]);


    return (
        <div className="container">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor}
	   >
            <div className="q1skills">
                {eyebrow && <Subheading level='h5' color={eyebrowColor}>{eyebrow}</Subheading>}
                {heading && <Heading level='h3' color={headingColor}>{heading}</Heading>}
                {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                <ul>
                    {list.map((item, idx) => (
                        <li key={idx}>
                            <div className="icon-and-popup-container d-flex flex-lg-column align-lg-center justify-content-lg-center">

                            <button 
                                ref={el => buttonsRef.current[idx] = el}
                                className={`icon-container ${activePopup === idx ? 'active' : ''}`}
                                onClick={() => handleIconClick(idx)}
                            >
                                {item.icon?.sourceUrl && <img src={item.icon.sourceUrl} alt={item.icon.altText || 'Icon'} />}
                            </button>

                                <div className={`details-popup ${activePopup === idx ? 'active' : ''}`}>
                                    <div className="title-container">
                                        {item.title && <Subheading level='div' className='title'>{item.title}</Subheading>}
                                        {item.description && <Subheading level='div' className='desc'>{item.description}</Subheading>}
                                    </div>
                                    {item.detailsPopUp && (
										<div className="details-container" dangerouslySetInnerHTML={{ __html: item.detailsPopUp }}></div>
									)}
                                </div>

                                <div className="title-container pt-2">
                                    {item.title && <Subheading level='div' className='title'>{item.title}</Subheading>}
                                    {item.description && <Subheading level='div' className='desc'>{item.description}</Subheading>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            </Customizations>
        </div>
    );
};

export default Q1Skills;
