import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Button from '../../atoms/Button/Button';
import { usePathname } from 'next/navigation'


const NewsSlider = ({ newsItems }) => {
    // Settings for the slick slider
    const slidesToShow = 3
    const settings = {
        adaptiveHeight: true,
        dots: true,
        infinite: newsItems?.length > slidesToShow,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
      <div className="news-slider-module">
        <Slider {...settings}>
            {newsItems.map((item, index) => (
                <div key={index} className="slide">
                  <div key={index} className="card-wrapper">
                  <div className="card">
                      <div className='featured-image' style={{ backgroundImage: `url(${item.image?.sourceUrl})` }}></div>
                      <div className="info">
                        <h4>{item.title}</h4>
                        <Button className='primary' href={usePathname() + '/news-item/' + item.slug}>Learn More</Button>
                      </div>
                  </div>
                  </div>
                </div>
            ))}
        </Slider>
        </div>
    );
};


export default NewsSlider;
