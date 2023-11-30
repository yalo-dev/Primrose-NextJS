import React, { useEffect, useState, useRef } from 'react';
import Slider from "react-slick";
import Modal from 'react-modal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GallerySlider = ({ gallery }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const sliderRef = useRef<HTMLDivElement>(null); 
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Modal.setAppElement('#appContainer');

        const updateSlideWidths = () => {
            const sliderContainer = sliderContainerRef.current;
            if (sliderContainer) {
                const slides = sliderContainer.querySelectorAll('.slick-slide');
                slides.forEach(slide => {
                    const htmlSlide = slide as HTMLElement;
                    const img = htmlSlide.querySelector('img');
                    if (img) {
                        const imageWidth = img.naturalWidth;
                        if (imageWidth) {
                            htmlSlide.style.width = `${imageWidth}px`;
                        }
                    }
                });
            }
        };        
        

        updateSlideWidths();
    }, [gallery]);

    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        variableWidth: false,
        slidesToShow: 3, 
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768, 
                settings: {
                    slidesToShow: 1, 
                }
            }
        ]
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className='gallery-slider' ref={sliderContainerRef}>
            <div className='container'>
                <h2 className='green'>Gallery</h2>
            </div>
            <div className='gallery'>
            <Slider {...sliderSettings} ref={sliderRef}>
                    {gallery.map((item, index) => (
                        <div key={index}>
                            <div className="gallery-image-container" onClick={() => openModal(item.image.sourceUrl)}>
                                <img src={item.image.sourceUrl} alt={item.image.altText} />
                                <div className="enlarge-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none">
                                        <rect opacity="0.9" y="0.699219" width="40" height="40" rx="4" fill="#373A36"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11 10.6992C10.4477 10.6992 10 11.1469 10 11.6992V14.6992H11V11.6992H14V10.6992H11ZM21 15.6992H19V19.6992H15V21.6992H19V25.6992H21V21.6992H25V19.6992H21V15.6992ZM30 11.6992C30 11.1469 29.5523 10.6992 29 10.6992H26V11.6992H29V14.6992H30V11.6992ZM11 30.6992C10.4477 30.6992 10 30.2515 10 29.6992V26.6992H11V29.6992H14V30.6992H11ZM30 29.6992C30 30.2515 29.5523 30.6992 29 30.6992H26V29.6992H29V26.6992H30V29.6992Z" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <div className='b2'>{item.caption}</div>
                        </div>
                    ))}
                </Slider>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
            >
                <img src={currentImage} alt="Enlarged view" />
            </Modal>
        </div>
    );
};

export default GallerySlider;

