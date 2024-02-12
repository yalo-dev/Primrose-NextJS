import React, { useEffect, useRef, useState } from 'react';
import Customizations from '../../filters/Customizations';
import Heading from '../../atoms/Heading/Heading';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TileContent {
    blurb: string;
    blurbColor: string;
    title: string;
    titleColor: string;
    switchColumns: boolean;
    image: {
        altText: string;
        sourceUrl: string;
    };
}

interface Tile {
    tileBlurb: string;
    tileTitle: string;
    content: TileContent[];
}

interface TimelineProps {
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        outerBackgroundColor?: string;
    };
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
    tilesTitle?: string;
    tilesTitleColor?: string;
    tiles: Tile[];
}

const Timeline: React.FC<TimelineProps> = ({
    customizations,
    heading,
    headingColor,
    subheading,
    subheadingColor,
    tilesTitle,
    tilesTitleColor,
    tiles
}) => {
    const tileSlider = useRef(null);
    const contentSlider = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isNextDisabled = currentIndex >= tiles.length - 1;
    const isPrevDisabled = currentIndex <= 0;
    const containerRef = useRef(null);
    const [sliderMarginLeft, setSliderMarginLeft] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const containerOffset = containerRef.current.getBoundingClientRect().left;
                setSliderMarginLeft(containerOffset);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const NextArrow = (props) => {
        return (
            <div onClick={isNextDisabled ? null : handleNext} className={`slick-next ${isNextDisabled ? 'disabled' : ''}`}>
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="15" transform="matrix(4.37114e-08 1 1 -4.37114e-08 0.5 0)" fill="#E6E7E4" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.8235 9.20605C13.4421 9.52033 13.3905 10.0808 13.7084 10.458L17.7021 15.1968L13.7338 19.5132C13.3998 19.8764 13.4269 20.4386 13.7943 20.7688C14.1616 21.0991 14.7302 21.0723 15.0641 20.709L19.0324 16.3927C19.636 15.7363 19.6577 14.7403 19.0833 14.0587L15.0895 9.31986C14.7717 8.94272 14.2049 8.89177 13.8235 9.20605Z" fill="#555F68" />
                </svg>
            </div>
        );
    };

    const PrevArrow = (props) => {
        return (
            <div onClick={isPrevDisabled ? null : handlePrev} className={`slick-prev ${isPrevDisabled ? 'disabled' : ''}`}>
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="15" transform="matrix(4.37114e-08 1 1 -4.37114e-08 0.5 0)" fill="#E6E7E4" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.8235 9.20605C13.4421 9.52033 13.3905 10.0808 13.7084 10.458L17.7021 15.1968L13.7338 19.5132C13.3998 19.8764 13.4269 20.4386 13.7943 20.7688C14.1616 21.0991 14.7302 21.0723 15.0641 20.709L19.0324 16.3927C19.636 15.7363 19.6577 14.7403 19.0833 14.0587L15.0895 9.31986C14.7717 8.94272 14.2049 8.89177 13.8235 9.20605Z" fill="#555F68" />
                </svg>
            </div>
        );
    };

    const handleNext = () => {
        const newIndex = Math.min(currentIndex + 1, tiles.length - 1);
        setCurrentIndex(newIndex);
        tileSlider.current.slickGoTo(newIndex);
    };

    const handlePrev = () => {
        const newIndex = Math.max(currentIndex - 1, 0);
        setCurrentIndex(newIndex);
        tileSlider.current.slickGoTo(newIndex);
    };

    const tileSettings = {
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: contentSlider.current,
        focusOnSelect: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        infinite: false,
        responsive: [
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 4,
                    centerMode: false,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2.25,
                    centerMode: true,
                }
            }
        ]
    };

    const contentSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: tileSlider.current,
    };

    return (
        <Customizations
            topPaddingMobile={customizations?.topPaddingMobile}
            topPaddingDesktop={customizations?.topPaddingDesktop}
            bottomPaddingMobile={customizations?.bottomPaddingMobile}
            bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
            colorLabelOuter={customizations?.outerBackgroundColor}
        >
            <div className='timeline'>
                <div className='container' ref={containerRef}>
                    <div className="heading-wrapper">
                        {heading && <Heading level="h1" className='green' color={headingColor}>{heading}</Heading>}
                        {subheading && <div style={{ color: subheadingColor }}>{subheading}</div>}
                    </div>
                </div>
                <div className={`sticky-div pb-3`}>
                    <div className='container'>{heading && <Heading level="h2" color={tilesTitleColor}>{tilesTitle}</Heading>}</div>

                    <div className='timeline-tiles mt-3' style={{ paddingLeft: `${sliderMarginLeft}px` }}>
                        <Slider ref={tileSlider} {...tileSettings}>
                            {tiles.map((tile, tileIndex) => (
                                <div key={tileIndex} className="tile-container">
                                    <div key={tileIndex} className="tile">
                                        <h3>{tile.tileTitle}</h3>
                                        <p className='b3'>{tile.tileBlurb}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='content-below'>
                    <div className='container'>
                        <div className='timeline-content'>
                            <Slider ref={contentSlider} {...contentSettings}>
                                {tiles.map((tile, tileIndex) => (
                                    <div key={tileIndex} className="content-slide">
                                        {tile.content.map((contentItem, contentIndex) => (
                                            <div key={contentIndex} className={`content-wrapper ${contentItem.switchColumns ? 'reverse' : ''}`}>
                                                <div className='content'>
                                                    <div className='col'>
                                                        <div className='image-wrapper'>
                                                            {contentItem.image.sourceUrl && (
                                                                <img src={contentItem.image.sourceUrl} alt={contentItem.image.altText} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col'>
                                                        <div className='text-wrapper'>
                                                            <h2 style={{ color: contentItem.titleColor }}>{contentItem.title}</h2>
                                                            <p className='b3' style={{ color: contentItem.blurbColor }}>{contentItem.blurb}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </Customizations>
    );
}

export default Timeline;
