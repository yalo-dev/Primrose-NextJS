import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={isVisible ? 'scroll-to-top visible' : 'scroll-to-top'}
      title="Scroll to Top"
      onClick={scrollToTop}
    >
      <div className="scroll-to-top-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="12"
          viewBox="0 0 21 12"
          fill="none"
        >
          <path d="M19.4218 10.6139L19.4217 10.6139L11.1087 2.76185L10.7654 2.4376L10.4221 2.76181L2.10709 10.6138L2.10706 10.6138L2.10213 10.6186C2.0546 10.6647 1.99837 10.7009 1.93672 10.7251C1.87507 10.7494 1.80922 10.7611 1.743 10.7597C1.67677 10.7582 1.6115 10.7436 1.55096 10.7167C1.49042 10.6899 1.43583 10.6512 1.39035 10.6031C1.34487 10.5549 1.30942 10.4982 1.28605 10.4362C1.26267 10.3742 1.25185 10.3082 1.2542 10.242C1.25655 10.1758 1.27203 10.1108 1.29975 10.0506C1.32746 9.99043 1.36685 9.93637 1.41563 9.89156L1.41566 9.89159L1.42067 9.88687L10.4217 1.38687L10.4219 1.38667C10.5147 1.2989 10.6376 1.25 10.7654 1.25C10.8931 1.25 11.016 1.2989 11.1089 1.38667L11.1091 1.38685L20.109 9.88675C20.1567 9.93187 20.1951 9.98596 20.2219 10.0459C20.2488 10.1059 20.2636 10.1705 20.2654 10.2362C20.2673 10.3019 20.2562 10.3673 20.2328 10.4286C20.2094 10.49 20.1741 10.5462 20.129 10.5939C20.0838 10.6417 20.0298 10.6801 19.9698 10.7069C19.9098 10.7338 19.8452 10.7485 19.7795 10.7504C19.7139 10.7522 19.6485 10.7412 19.5871 10.7177C19.5257 10.6943 19.4695 10.6591 19.4218 10.6139Z" fill="#D2D3D1" stroke="#5E6738"/>
        </svg>
      </div>
    </button>
  );
};

export default ScrollToTopButton;
