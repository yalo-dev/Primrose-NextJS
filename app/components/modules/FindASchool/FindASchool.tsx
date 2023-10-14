import React, { useEffect, useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Button from '../../atoms/Button/Button';

interface FindASchoolProps {
    heading?: string;
    subheading?: string;
    images?: {
        image: {
            sourceUrl?: string;
        };
    }[];
    button?: {
        target?: string;
        title?: string;
        url?: string;
    };
}

const FindASchool: React.FC<FindASchoolProps> = ({ heading, subheading, images, button }) => {
    const leftScrollerRef = useRef<HTMLDivElement | null>(null);
    const rightScrollerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
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
    }, []);
    

    return (
        <div className='container'>
            <div className='find-a-school'>
                <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                    {heading && <Heading level='h2'>{heading}</Heading>}
                    {subheading && <Subheading level='div' className='b3'>{subheading}</Subheading>}

                    {button?.url && button.title && (
                        <Button variant='white' href={button.url} target={button.target || '_self'}>
                            {button.title}
                        </Button>
                    )}
                </div>
                <div className='right-column col-4 col-lg-5 col-xxl-6'>
                {images && images.length > 0 && (
                    <>
                    <div className="image-scroller first" ref={leftScrollerRef}>
                        {images.map((imgObj, idx) => (
                                    imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={`Image ${idx + 1}`} />
                        ))}
                        {images.map((imgObj, idx) => (  // Duplicating for infinite scroll illusion
                            imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={`Image ${idx + 1}`} />
                        ))}
                    </div>
                    <div className="image-scroller second" ref={rightScrollerRef}>
                        {images.map((imgObj, idx) => (
                            imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={`Image ${idx + 1}`} />
                        ))}
                        {images.map((imgObj, idx) => (  // Duplicating for infinite scroll illusion
                            imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={`Image ${idx + 1}`} />
                        ))}
                    </div>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}

export default FindASchool;
