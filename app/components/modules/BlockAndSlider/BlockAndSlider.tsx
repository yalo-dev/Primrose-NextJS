import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const BlockAndSlider = ({ blurb, heading, image, customizations, slider }) => {
    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
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
        <div className='block-and-slider'>
        <div className='container'>
            <div className='row' style={{ marginTop: customizations?.topMarginDesktop, marginBottom: customizations?.bottomMarginDesktop }}>
                <div className='col'>
                    <h2 className='white'>{heading}</h2>
                    <p className='white b3'>{blurb}</p>
                </div>
                <div className='col'>
                    {image && <img className='featured-img' src={image.sourceUrl} alt={image.altText} />}
                </div>
            </div>

            <div className='row' style={{ marginTop: customizations?.topMarginMobile, marginBottom: customizations?.bottomMarginMobile }}>
                <div className='slider'>
                <Slider {...sliderSettings}>
                    {slider.map((slide, index) => (
                        <div className='slide' key={index}>
                            <img className='icon' src={slide.icon.sourceUrl} alt={slide.icon.altText} />
                            <h5 className='white'>{slide.title}</h5>
                            <p className='white b2'>{slide.blurb}</p>
                        </div>
                    ))}
                </Slider>
                </div>
            </div>
        </div>
        </div>
    );
};

export default BlockAndSlider;
