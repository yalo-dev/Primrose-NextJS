import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Customizations from '../../filters/Customizations';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';


interface FourAcrossSlide {
    blurb?: string;
    blurbColor?: string;
    title?: string;
    titleColor?: string;
    image?: {
        sourceUrl?: string;
        altText?: string;
    };
}

interface FourAcrossSliderProps {
    fourAcrossSlider: FourAcrossSlide[];
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
        backgroundColor?: string;
    };
}

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-prev" onClick={onClick}>
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="15" cy="15.6632" rx="14.9987" ry="15" transform="rotate(90 15 15.6632)" fill="#E6E7E4"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16.6765 9.8696C17.0579 10.1839 17.1095 10.7443 16.7916 11.1214L12.7979 15.8599L16.7662 20.1758C17.1002 20.539 17.0731 21.1012 16.7057 21.4314C16.3384 21.7616 15.7698 21.7348 15.4359 21.3716L11.4676 17.0556C10.864 16.3992 10.8423 15.4034 11.4167 14.7219L15.4105 9.9834C15.7283 9.6063 16.2951 9.55535 16.6765 9.8696Z" fill="#555F68"/>
            </svg>
        </div>
    );
}

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-next" onClick={onClick}>
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="15" cy="15.6639" rx="14.9987" ry="15" transform="rotate(-90 15 15.6639)" fill="#E6E7E4"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M13.3235 21.4575C12.9421 21.1433 12.8905 20.5828 13.2084 20.2057L17.2021 15.4673L13.2338 11.1513C12.8998 10.7881 12.9269 10.226 13.2943 9.89579C13.6616 9.56559 14.2302 9.59236 14.5641 9.95557L18.5324 14.2715C19.136 14.9279 19.1577 15.9238 18.5833 16.6053L14.5895 21.3437C14.2717 21.7208 13.7049 21.7718 13.3235 21.4575Z" fill="#555F68"/>
            </svg>

        </div>
    );
}

const FourAcrossSlider: React.FC<FourAcrossSliderProps> = ({ fourAcrossSlider, customizations }) => {
    const settings = {
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024, 
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768, 
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
        
    };

    
    
    return (
        <div>
            <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
                colorLabel={customizations?.backgroundColor}
            >
                <div className='four-across-slider'>
                    <div className='container'>
                <Slider {...settings}>
                    {fourAcrossSlider.map((slide, index) => (
                        <div className='slide-content' key={index}>
                            {slide.image && slide.image.sourceUrl && (
                                <img src={slide.image.sourceUrl} alt={slide.image.altText} width="100%" height="auto" />
                            )}
                            {slide.title && (
                                <Heading level='h5' color={slide.titleColor}>{slide.title}</Heading>
                            )}
                            {slide.blurb && (
                                <Subheading level='div' className='b2' color={slide.blurbColor}>{slide.blurb}</Subheading>
                            )}
                        </div>
                    ))}
                    
                </Slider>
                    </div>
                </div>
            </Customizations>
        </div>
    );
}

export default FourAcrossSlider;
