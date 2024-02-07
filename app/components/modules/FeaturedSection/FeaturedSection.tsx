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
    image: { 
        sourceUrl: string; 
        altText?: string;
    };
}

interface CustomizationsProps {
    topMarginMobile?: string;
    topMarginDesktop?: string;
    bottomMarginMobile?: string;
    bottomMarginDesktop?: string;
    backgroundColor?: string;
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
            <Customizations
                topMarginMobile={customizations?.topMarginMobile}
                topMarginDesktop={customizations?.topMarginDesktop}
                bottomMarginMobile={customizations?.bottomMarginMobile}
                bottomMarginDesktop={customizations?.bottomMarginDesktop}
                colorLabelOuter={customizations?.backgroundColor}
            >
                 <div className={`accent`}>
                <div className='container'>
                <div className='featured-section row'>
                        <div className='header-section col-lg-4 col-xxl-4'>
                            {heading && <Heading level="h2" color={headingColor}>{heading}</Heading>}
                            {subheading && <Subheading level="div" className='b3' color={subheadingColor}>{subheading}</Subheading>}
                        </div>
                        <div className='slider-section col-lg-7 offset-lg-1 col-xxl-8 offset-xxl-0'>
                        <Slider {...sliderSettings}>
                            {slider.map((slide, index) => (
                                <div className='featured-slider' key={index}>
                                    <div className='image'>
                                    {slide.image &&
                                        <img src={slide.image.sourceUrl} alt={slide.image.altText} />
                                    }
                                    </div>
                                    <div className='content'>
                                        {slide.title &&
                                            <Heading level="h5" className='b4' color={slide.titleColor}>
                                                {slide.title}
                                            </Heading>
                                        }
                                        {slide.blurb &&
                                            <Subheading level="div" className='b2' color={slide.blurbColor}>
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
                </div>
            </Customizations>
    );
};

export default FeaturedSection;
