import React from 'react';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface SliderItem {
    image?: {
        sourceUrl?: string;
        altText?: string;
    };
    position?: string;
    positionColor?: string;
    testimonial?: string;
    testimonialColor?: string;
    title?: string;
    titleColor?: string;
    imageOrVideo?: string;
    video?: {
        target?: string;
        title?: string;
        url?: string;
    };
}

interface TestimonialsWithVideoOrImageProps {
    buttonStyle?: string; 
    button?: {
        target?: string;
        title?: string;
        url?: string;
    };
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
    customizations?: {
        bottomPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        topPaddingDesktop?: string;
        topPaddingMobile?: string;
    };
    slider?: SliderItem[];
}

const TestimonialsWithVideoOrImage: React.FC<TestimonialsWithVideoOrImageProps> = (props) => {
    const { 
        buttonStyle, 
        button, 
        heading, 
        headingColor, 
        subheading, 
        subheadingColor, 
        customizations, 
        slider 
    } = props;

    // Slider settings
    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
    };

    return (
        <div className="container">
              <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                >
                <div className="testimonials-with-video-or-image">
                <div className="header-wrap">
                 
                        {heading && <Heading level='h2' color={headingColor}>{heading}</Heading>}
                   
                    {subheading && <Subheading level='div' className='b3' color={subheadingColor}>{subheading}</Subheading>}
                    {button?.url && button.title &&
                        <Button variant={buttonStyle || 'primary'} href={button.url} target={button.target || '_self'} label={button.title} />
                    }
                
                </div>
                <div className="slider-wrap">
                    <Slider {...sliderSettings}>
                        {slider?.map((slide, index) => (
                            <div key={index} className="slider-item">
                                
                                    {slide.image && slide.image.sourceUrl &&
                                    <div className="image-wrap">
                                        <img src={slide.image.sourceUrl} alt={slide.image.altText || "Slide image"} width={500} height={300} />
                                        </div>
                                    }
                                
                               
                                    {slide.imageOrVideo === 'video' && slide.video?.url &&
                                     <div className="video-wrap">
                                        <div className="responsive-video">
                                            <video width="588" height="330"  controls>
                                            <source src={slide.video.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video></div>
                                        </div>
                                    }
                               

                                <div className="text-wrap">
                                    {slide.testimonial && <div style={{ color: slide.testimonialColor }} className='b4'>{slide.testimonial}</div>}
                                    <div className="sign">    
                                        {slide.title && <div style={{ color: slide.titleColor }} className='name b4'>{slide.title}</div>}
                                        {slide.position && <div style={{ color: slide.positionColor }} className='b3'>{slide.position}</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>     
            </div>
        </Customizations>
    </div>
    );
}

export default TestimonialsWithVideoOrImage;