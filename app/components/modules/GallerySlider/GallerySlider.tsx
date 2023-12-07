import React, { useState, useRef } from 'react';

const GallerySlider = ({ gallery }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    // Initialize imageRefs with the correct type
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    
    const handleImageLoad = (index, event) => {
        const imageContainer = imageRefs.current[index];
        if (imageContainer) {
            const width = event.target.offsetWidth; // Assuming you want the width of the image
            imageContainer.style.width = `${width}px`; // Set the width of the container
        }
    };
    const handleArrowClick = (direction) => {
        if (direction === 'prev') {
            setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
        } else if (direction === 'next') {
            setCurrentIndex((prevIndex) => Math.min(gallery.length - 1, prevIndex + 1));
        }
    };
    
      
    const openModal = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
    };

    return (
        <div className="gallery-slider">
          <h2>Gallery</h2>
          <div className="slider-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {gallery.map((item, index) => (
              <div className="slide" key={index} onClick={() => openModal(item.image.sourceUrl)}>
                <img src={item.image.sourceUrl} alt={item.image.altText} />
                {item.caption && (
                  <div className='caption d-none'>
                    <h5>{item.title}</h5>
                    <p>{item.caption}</p>
                  </div>
                )}
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
