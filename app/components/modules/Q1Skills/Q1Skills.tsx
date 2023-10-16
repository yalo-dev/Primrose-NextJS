import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';

interface IconProps {
    sourceUrl: string;
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
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleIconClick = (idx: number) => {
        setActivePopup(prev => (prev === idx ? null : idx));
    };

    useEffect(() => {
        const handleOutsideClick = (event: Event) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="container">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor} // Pass the colorLabel here
	   >
            <div className="q1skills">
                {eyebrow && <Subheading level='h5' color={eyebrowColor}>{eyebrow}</Subheading>}
                {heading && <Heading level='h3' color={headingColor}>{heading}</Heading>}
                {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                <ul>
                    {list.map((item, idx) => (
                        <li key={idx}>
                            <div className="icon-and-popup-container">
                                <button 
                                    className={`icon-container ${activePopup === idx ? 'active' : ''}`}
                                    onClick={() => handleIconClick(idx)}
                                >
                                    {item.icon?.sourceUrl && <img src={item.icon.sourceUrl} alt={item.title || 'Icon'} />}
                                </button>
                                {activePopup === idx && (
                                    <div className="details-popup">
                                        <div className="title-container">
                                            {item.title && <Subheading level='div' className='title'>{item.title}</Subheading>}
                                            {item.description && <Subheading level='div' className='desc'>{item.description}</Subheading>}
                                        </div>
                                        {item.detailsPopUp && <div className="details-container">{item.detailsPopUp}</div>}
                                    </div>
                                )}
                            </div>
                            <div className="title-container">
                                {item.title && <Subheading level='div' className='title'>{item.title}</Subheading>}
                                {item.description && <Subheading level='div' className='desc'>{item.description}</Subheading>}
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
