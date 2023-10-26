import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';

interface SliderItem {
    blurb: string;
    blurbColor: string;
    title: string;
    titleColor: string;
    image: { sourceUrl: string; };
}

interface CustomizationsProps {
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
    backgroundColor?: string;
    accentLeftOrRight?: string;
}

interface FeaturedSectionProps {
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
    customizations?: CustomizationsProps;
    slider: SliderItem[];
}

const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true
};

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ heading, headingColor, subheading, subheadingColor, customizations, slider }) => {
    return (
        <div className={`accent ${customizations?.accentLeftOrRight || ''}`}>
            <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                colorLabelOuter={customizations?.backgroundColor}
            >
                <div className='container'>
                <div className='featured-section row'>
                        <div className='header-section col-lg-3'>
                            {heading && <Heading level="h2" color={headingColor}>{heading}</Heading>}
                            {subheading && <Subheading level="div" className='b3' color={subheadingColor}>{subheading}</Subheading>}
                        </div>
                        <div className='slider-section col-lg-8 offset-lg-1 '>
                        <Slider {...sliderSettings}>
                            {slider.map((slide, index) => (
                                <div className='featured-slider' key={index}>
                                    <div className='image'>
                                    {slide.image &&
                                        <img src={slide.image.sourceUrl} alt={slide.title} />
                                    }
                                    </div>
                                    <div className='content'>
                                        {slide.title &&
                                            <Heading level="h5" className='b4' color={slide.titleColor}>
                                                {slide.title}
                                            </Heading>
                                        }
                                        {slide.blurb &&
                                            <Subheading level="div" className='b3' color={slide.blurbColor}>
                                                {slide.blurb}
                                            </Subheading>
                                        }
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        </div>
                    </div>
                </div>
            </Customizations>
        </div>
    );
};

export default FeaturedSection;
