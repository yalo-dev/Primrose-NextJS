import React from 'react';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface SliderItem {
    icon?: {
        sourceUrl?: string;
        altText?: string;
    };
    title?: string;
    paragraph?: string;
}

interface LargeCardSliderProps {
    buttonStyle?: string; 
    button?: {
        target?: string;
        title?: string;
        url?: string;
    };
    heading?: string;
    paragraph?: string;
    image?: {
        sourceUrl?:string;
        altText?:string;
    },
    slider?: SliderItem[];
}

const LargeCardSlider: React.FC<LargeCardSliderProps> = (props) => {
    const { 
        buttonStyle,
        button, 
        heading, 
        paragraph, 
        image,
        slider 
    } = props;

    // Slider settings
    const sliderSettings = {
        dots: true,
        arrows: true ,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings:{
                    slidesToShow:1,
                    fade:true
                }
            }
        ]
    };

    return (
        <div className="container-fluid large-card-slider">
              <div className="row">
                    <div className="container">
                        <div className="row">
                                <div className="header-wrap col-12 col-md-6 order-2 order-md-1">
                        
                                {heading && <Heading level='h2' >{heading}</Heading>}
                        
                            {paragraph && <span className='subheading b3' dangerouslySetInnerHTML={{__html:paragraph}}></span>}
                            {button?.url && button.title &&
                                <Button variant={buttonStyle || 'primary'} href={button.url} target={button.target || '_self'} label={button.title} />
                            }
                        
                        </div>
                        <div className="col-12 col-md-6 order-1 order-md-2">
                            <img className="hero" src={image.sourceUrl} alt={image.altText} />
                        </div>
                        <div className="col-12 slider-wrap order-3">
                            <Slider {...sliderSettings}>
                                {slider?.map((slide, index) => (
                                    <div key={index} className="slider-item">
                                        <div className="slider-title">

                                        {slide.icon && slide.icon.sourceUrl &&
                                            <img className="icon" src={slide.icon.sourceUrl} alt={slide.icon.altText || "Slide image"} width={500} height={300} />
                                        }
                                        <   h5>{slide.title}</h5>

                                        </div>
                                            
                                        
                                    <p>{slide.paragraph}</p>
                                    </div>
                                ))}
                            </Slider>
                        </div>  
                        </div>
                        </div>
            </div>
    </div>
    );
}

export default LargeCardSlider;