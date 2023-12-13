import React, { useEffect, useRef, useState } from 'react';

let sliderIdCounter = 0;

const GallerySlider = ({ gallery, uniqueId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideWidths, setSlideWidths] = useState<number[]>([]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [imageWidths, setImageWidths] = useState<number[]>([]);
    const [isPrevArrowDisabled, setIsPrevArrowDisabled] = useState(true);
    const [isNextArrowDisabled, setIsNextArrowDisabled] = useState(false);
    const instanceId = useRef(sliderIdCounter++).current;
    const combinedUniqueId = `${uniqueId}-${instanceId}`;

    const handleImageLoad = (index, width) => {
        const slideWidthWithMargin = index < gallery.length - 1 ? width + 16 : width;
        setSlideWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths[index] = slideWidthWithMargin;
            return newWidths;
        });
        setImageWidths((prevImageWidths) => {
            const newImageWidths = [...prevImageWidths];
            newImageWidths[index] = width;
            return newImageWidths;
        });
    };

    useEffect(() => {
        const sliderContainer = sliderRef.current;
        if (!sliderContainer) return;

        const handleImageLoad = (index, width) => {
            const slideWidthWithMargin = index < gallery.length - 1 ? width + 16 : width;
            setSlideWidths((prevWidths) => {
                const newWidths = [...prevWidths];
                newWidths[index] = slideWidthWithMargin;
                return newWidths;
            });
            setImageWidths((prevImageWidths) => {
                const newImageWidths = [...prevImageWidths];
                newImageWidths[index] = width;
                return newImageWidths;
            });
        };

        const imageElements = sliderContainer.querySelectorAll('.gallery-slider .slide img');
        imageElements.forEach((element, index) => {
            const img = element as HTMLImageElement;
            if (img.complete) {
                handleImageLoad(index, img.offsetWidth);
            } else {
                img.onload = () => {
                    handleImageLoad(index, img.offsetWidth);
                };
            }
        });
    }, [gallery]);

    useEffect(() => {
    }, [slideWidths]);
   
    const calculateTotalSlideWidth = () => {
        const totalSlidesWidth = slideWidths.reduce((acc, width) => acc + width, 0);
        const viewportWidth = sliderRef.current ? sliderRef.current.offsetWidth : window.innerWidth;
    
        let translateWidth = slideWidths.slice(0, currentIndex).reduce((acc, width) => acc + width, 0);
    
        if (totalSlidesWidth - translateWidth < viewportWidth) {
            translateWidth = totalSlidesWidth - viewportWidth;
        }
    
        translateWidth = Math.max(0, Math.min(translateWidth, totalSlidesWidth));
    
        console.log(`Calculated translate width: ${translateWidth}`);
        return translateWidth;
    };
    
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${calculateTotalSlideWidth()}px)`;
        }
    }, [currentIndex, slideWidths]);
    
    const handleArrowClick = (direction) => {
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex;
            if (direction === 'prev' && prevIndex > 0) {
                newIndex = prevIndex - 1;
            } else if (direction === 'next' && prevIndex < gallery.length - 1) {
                newIndex = prevIndex + 1;
            }
            console.log(`Arrow clicked: ${direction}, New index: ${newIndex}`);
            return newIndex;
        });
    };

    useEffect(() => {
        const totalSlidesWidth = slideWidths.reduce((acc, width) => acc + width, 0);
        const viewportWidth = sliderRef.current ? sliderRef.current.offsetWidth : window.innerWidth;
    
        const maxTranslateWidth = totalSlidesWidth - viewportWidth;
        const currentTranslateWidth = calculateTotalSlideWidth();
    
        setIsPrevArrowDisabled(currentTranslateWidth <= 0);
    
        const isLastSlideFullyVisible = currentTranslateWidth >= maxTranslateWidth;
        setIsNextArrowDisabled(isLastSlideFullyVisible || currentIndex === gallery.length - 1);
    }, [currentIndex, slideWidths, gallery.length]);
    

    return (
        <div className={`gallery-slider ${combinedUniqueId}`}>
            <div className='container d-flex justify-content-between align-items-center'>
                <h2 className='mb-3 mb-lg-5'>Gallery</h2>
                <div className='arrows mb-3 mb-lg-5'>
                    <button
                        className={`arrow prev ${isPrevArrowDisabled ? 'disabled' : ''}`}
                        onClick={() => handleArrowClick('prev')}
                        disabled={isPrevArrowDisabled}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
                        </svg>
                    </button>
                    <button
                        className={`arrow next ${isNextArrowDisabled ? 'disabled' : ''}`}
                        onClick={() => handleArrowClick('next')}
                        disabled={isNextArrowDisabled}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='container'>
            <div className="slider-container" ref={sliderRef}>
                {gallery.map((item, index) => (
                    <div className="slide" key={index} style={{ width: `${imageWidths[index]}px` }}>
                        <img
                            src={item.image.sourceUrl}
                            alt={item.image.altText}
                            onLoad={(e) => {
                                const target = e.target as HTMLImageElement;
                                handleImageLoad(index, target.offsetWidth);
                            }}
                        />
                        <div className='caption-wrapper pe-1'>
                            <div className='h5 mt-2 mb-2'>{item.title}</div>
                            <span className='b2'>{item.caption}</span>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default GallerySlider;
