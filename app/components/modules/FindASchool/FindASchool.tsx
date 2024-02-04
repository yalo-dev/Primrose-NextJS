import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

interface FindASchoolProps {
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
    images?: { 
        image: {
            sourceUrl?: string;
            altText?: string;
        };
    }[];
    button?: {
        target?: string;
        title?: string;
        url?: string;
    };
    buttonStyle?: 'primary' | 'secondary' | 'white'; 
    customizations?: {
        backgroundColor?: string;
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
    };
}

const FindASchool: React.FC<FindASchoolProps> = ({ heading, headingColor, subheading, subheadingColor, images, button, buttonStyle, customizations }) => {
    
    const leftScrollerRef = useRef<HTMLDivElement | null>(null);
    const rightScrollerRef = useRef<HTMLDivElement | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    useEffect(() => {
        if (imagesLoaded < (images?.length || 0) * 2) { // Considering duplicated images
            return;
        }

        const leftScroller = leftScrollerRef.current;
        const rightScroller = rightScrollerRef.current;
        
        let intervalId: number;
            
        function scrollContent() {
            if (leftScroller) {
                leftScroller.scrollTop += 1;
                if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
                    leftScroller.scrollTop = 0;
                }
            }

            if (rightScroller) {
                rightScroller.scrollTop -= 1;
                if (rightScroller.scrollTop <= 0) {
                    rightScroller.scrollTop = rightScroller.scrollHeight / 2;
                }
            }
        }
    
        intervalId = window.setInterval(scrollContent, 20);
    
        return () => {
            clearInterval(intervalId);
        };
    }, [imagesLoaded, images]);

    const handleImageLoad = () => {
        setImagesLoaded(prev => prev + 1);
    };

    return (
        <div className="container jumbo">
            <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                colorLabel={customizations?.backgroundColor} 
            >
                <div className='find-a-school'>
                    <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                        {heading && <Heading level='h2' color={headingColor}>{heading}</Heading>}
                        {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                        {button?.url && button.title && (
                            <Button variant={buttonStyle || 'primary'} href={button.url} target={button.target || '_self'}>
                                {button.title}
                            </Button>
                        )}
                    </div>
                    <div className='right-column col-4 col-lg-5 col-xxl-6'>
                        {images && images.length > 0 && (
                            <>
                                <div className="image-scroller first" ref={leftScrollerRef}>
                                    {images.map((imgObj, idx) => (
                                        imgObj.image.sourceUrl && (
                                            <img 
                                                key={idx} 
                                                src={imgObj.image.sourceUrl} 
                                                alt={imgObj.image.altText} 
                                                onLoad={handleImageLoad}
                                            />
                                        )
                                    ))}
                                    {images.map((imgObj, idx) => ( // Duplicating for infinite scroll illusion
                                        imgObj.image.sourceUrl && (
                                            <img 
                                                key={`dup-${idx}`} 
                                                src={imgObj.image.sourceUrl} 
                                                alt={imgObj.image.altText} 
                                                onLoad={handleImageLoad}
                                            />
                                        )
                                    ))}
                                </div>
                                <div className="image-scroller second" ref={rightScrollerRef}>
                                    {images.map((imgObj, idx) => (
                                        imgObj.image.sourceUrl && (
                                            <img 
                                                key={idx} 
                                                src={imgObj.image.sourceUrl} 
                                                alt={imgObj.image.altText} 
                                                onLoad={handleImageLoad}
                                            />
                                        )
                                    ))}
                                    {images.map((imgObj, idx) => ( // Duplicating for infinite scroll illusion
                                        imgObj.image.sourceUrl && (
                                            <img 
                                                key={`dup-${idx}`} 
                                                src={imgObj.image.sourceUrl} 
                                                alt={imgObj.image.altText} 
                                                onLoad={handleImageLoad}
                                            />
                                        )
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Customizations>
        </div>
    );
}

export default FindASchool;
