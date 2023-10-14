import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

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
    heading: string;
    subheading: string;
    list: ListItemProps[];
}

const Q1Skills: React.FC<Q1SkillsProps> = ({ eyebrow, heading, subheading, list }) => {
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
        <div className="container" ref={containerRef}>
            <div className="q1skills">
                {eyebrow && <h5>{eyebrow}</h5>}
                {heading && <Heading level='h3'>{heading}</Heading>}
                {subheading && <Subheading level='div' className='b3'>{subheading}</Subheading>}
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
        </div>
    );
};

export default Q1Skills;
