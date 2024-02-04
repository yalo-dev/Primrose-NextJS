import React, { useState, useEffect, useRef } from 'react';
import ColorComponent from '../../filters/ColorComponent';
import Customizations from '../../filters/Customizations';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';

interface PathwayToOwnershipProps {
    heading?: string;
    subheading?: string;
    subheadingColor?: string;
    headingColor?: string;
    image?: {
        sourceUrl?: string;
        altText?: string;
    };
    boxes?: {
        heading?: string;
        headingColor?: string;
        subheading?: string;
        subheadingColor?: string;
        list?: {
            listItem?: string;
            listItemColor?: string;
        }[];
        icon?: {
            sourceUrl?: string;
            altText?: string;
        };
    }[];
    customizations?: {
        bottomPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        topPaddingDesktop?: string;
        topPaddingMobile?: string;
    };
}

const PathwayToOwnership: React.FC<PathwayToOwnershipProps> = ({
    heading, subheading, subheadingColor, headingColor, image, boxes, customizations
}) => {
    const [isSticky, setIsSticky] = useState(false);
    
    // Explicitly type the useRef to help TypeScript understand it's a reference to a DOM element
    const pathwayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (pathwayRef.current) {
                const rect = pathwayRef.current.getBoundingClientRect();
                if (rect.top <= 100) { 
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    


    return (
        <div className='container'>
            <Customizations {...customizations}>
            <div className={`pathway-to-ownership row ${isSticky ? 'sticky' : ''}`} ref={pathwayRef}>
                    <div className="col-12 col-lg-5 offset-lg-1">
                        <div className="wrap">
                            <Heading level="h2" className='green' color={headingColor}>{heading}</Heading>
                            <Subheading level="div" className='b3' color={subheadingColor}>{subheading}</Subheading>
                            <div className='d-none d-lg-block featured-img'>
                                {image?.sourceUrl && <img src={image.sourceUrl} alt={image.altText || ''} width='536' height='520' />}
                            </div>
                        </div>
                    </div>
                    <div className="boxes col-12 col-lg-4 offset-lg-1">
                        {boxes?.map((box, index) => (
                            <div key={index} className="box">
                                <div className='icon'>
                                    {box.icon?.sourceUrl && <img src={box.icon.sourceUrl} alt={box.icon.altText || ''} width='25' height='25' />}
                                </div>
                                <Heading level="h3" color={box.headingColor}>{box.heading}</Heading>
                                <Subheading level="div" className='b3' color={box.subheadingColor}>{box.subheading}</Subheading>
                                <ul>
                                {box.list && box.list.map((listItem, listItemIndex) => (
                                    <li key={listItemIndex} className='b2'><ColorComponent color={listItem.listItemColor}>{listItem.listItem}</ColorComponent></li>
                                ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </Customizations>
        </div>
    );
}

export default PathwayToOwnership;
