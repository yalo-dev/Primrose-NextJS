import React from 'react';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ColorComponent from '../../filters/ColorComponent';

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

    const sliderContent = slider?.some(slide => slide.image) ? 'has-image-or-video' : ''; 

    // Slider settings
    const sliderSettings = {
        dots: true,
        arrows: true,
        prevArrow: <div className="slick-prev"><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="12"
                            viewBox="0 0 21 12"
                            fill="none"
                        >
                            <path d="M19.4218 10.6139L19.4217 10.6139L11.1087 2.76185L10.7654 2.4376L10.4221 2.76181L2.10709 10.6138L2.10706 10.6138L2.10213 10.6186C2.0546 10.6647 1.99837 10.7009 1.93672 10.7251C1.87507 10.7494 1.80922 10.7611 1.743 10.7597C1.67677 10.7582 1.6115 10.7436 1.55096 10.7167C1.49042 10.6899 1.43583 10.6512 1.39035 10.6031C1.34487 10.5549 1.30942 10.4982 1.28605 10.4362C1.26267 10.3742 1.25185 10.3082 1.2542 10.242C1.25655 10.1758 1.27203 10.1108 1.29975 10.0506C1.32746 9.99043 1.36685 9.93637 1.41563 9.89156L1.41566 9.89159L1.42067 9.88687L10.4217 1.38687L10.4219 1.38667C10.5147 1.2989 10.6376 1.25 10.7654 1.25C10.8931 1.25 11.016 1.2989 11.1089 1.38667L11.1091 1.38685L20.109 9.88675C20.1567 9.93187 20.1951 9.98596 20.2219 10.0459C20.2488 10.1059 20.2636 10.1705 20.2654 10.2362C20.2673 10.3019 20.2562 10.3673 20.2328 10.4286C20.2094 10.49 20.1741 10.5462 20.129 10.5939C20.0838 10.6417 20.0298 10.6801 19.9698 10.7069C19.9098 10.7338 19.8452 10.7485 19.7795 10.7504C19.7139 10.7522 19.6485 10.7412 19.5871 10.7177C19.5257 10.6943 19.4695 10.6591 19.4218 10.6139Z" fill="#D2D3D1" stroke="#5E6738"/>
                        </svg>
                    </div>,
        nextArrow: <div className="slick-next"><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="12"
                            viewBox="0 0 21 12"
                            fill="none"
                        >
                            <path d="M19.4218 10.6139L19.4217 10.6139L11.1087 2.76185L10.7654 2.4376L10.4221 2.76181L2.10709 10.6138L2.10706 10.6138L2.10213 10.6186C2.0546 10.6647 1.99837 10.7009 1.93672 10.7251C1.87507 10.7494 1.80922 10.7611 1.743 10.7597C1.67677 10.7582 1.6115 10.7436 1.55096 10.7167C1.49042 10.6899 1.43583 10.6512 1.39035 10.6031C1.34487 10.5549 1.30942 10.4982 1.28605 10.4362C1.26267 10.3742 1.25185 10.3082 1.2542 10.242C1.25655 10.1758 1.27203 10.1108 1.29975 10.0506C1.32746 9.99043 1.36685 9.93637 1.41563 9.89156L1.41566 9.89159L1.42067 9.88687L10.4217 1.38687L10.4219 1.38667C10.5147 1.2989 10.6376 1.25 10.7654 1.25C10.8931 1.25 11.016 1.2989 11.1089 1.38667L11.1091 1.38685L20.109 9.88675C20.1567 9.93187 20.1951 9.98596 20.2219 10.0459C20.2488 10.1059 20.2636 10.1705 20.2654 10.2362C20.2673 10.3019 20.2562 10.3673 20.2328 10.4286C20.2094 10.49 20.1741 10.5462 20.129 10.5939C20.0838 10.6417 20.0298 10.6801 19.9698 10.7069C19.9098 10.7338 19.8452 10.7485 19.7795 10.7504C19.7139 10.7522 19.6485 10.7412 19.5871 10.7177C19.5257 10.6943 19.4695 10.6591 19.4218 10.6139Z" fill="#D2D3D1" stroke="#5E6738"/>
                        </svg>
                    </div>,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        adaptiveHeight: true,
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
                <div className={`slider-wrap ${sliderContent}`}>
                    <Slider {...sliderSettings}>
                        {slider?.map((slide, index) => (
                            <div key={index} className="slider-item">
                                <div className="media-wrap">
                                    {slide.imageOrVideo === 'image' && slide.image?.sourceUrl &&
                                        <div className="image-wrap">
                                            <img src={slide.image.sourceUrl} alt={slide.image.altText || "Slide image"} width={500} height={300} />
                                        </div>
                                    }
                                
                                    {slide.imageOrVideo === 'video' && slide.video?.url &&
                                        <div className="video-wrap">
                                            <div className="responsive-video">
                                                <iframe className="rounded-lg" width="560" height="315" src={slide.video.url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                            </div>
                                        </div>
                                    }
                                </div>
                               <div className="text-wrap">
                                    {slide.testimonial && (
                                        <ColorComponent color={slide.testimonialColor}>
                                        <div className='b4'>{slide.testimonial}</div>
                                        </ColorComponent>
                                    )}
                                    <div className="sign">    
                                        {slide.title && (
                                        <ColorComponent color={slide.titleColor}>
                                            <div className='name b4'>{slide.title}</div>
                                        </ColorComponent>
                                        )}
                                        {slide.position && (
                                        <ColorComponent color={slide.positionColor}>
                                            <div className='b3'>{slide.position}</div>
                                        </ColorComponent>
                                        )}
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