import React, { useState } from 'react';

const GallerySlider = ({ gallery }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const handleArrowClick = (direction) => {
        if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'next' && currentIndex < gallery.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
    };

    return (
        <div className="gallery-slider">
            <div className="slider-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {gallery.map((item, index) => (
                    <div className="slide" key={index} onClick={() => openModal(item.image.sourceUrl)}>
                        <img src={item.image.sourceUrl} alt={item.image.altText} />
                    </div>
                ))}
            </div>
            <button className="arrow prev" onClick={() => handleArrowClick('prev')}>&lt;</button>
            <button className="arrow next" onClick={() => handleArrowClick('next')}>&gt;</button>

            {modalOpen && (
                <div className="modal" onClick={() => setModalOpen(false)}>
                    <img src={currentImage} alt="Enlarged view" />
                </div>
            )}
        </div>
    );
};

export default GallerySlider;
