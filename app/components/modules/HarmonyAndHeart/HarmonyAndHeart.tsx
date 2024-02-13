import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';

interface HarmonyAndHeartProps {
  leftColumn?: {
    displayMusicPlayer?: boolean;
    heading?: string;
    musicPlayer?: {
      artistAuthor?: string;
      audio?: {
        url?: string;
      };
      coverImage?: {
        altText?: string;
        sourceUrl?: string;
      };
      trackTitle?: string;
    };
  };
  moduleId?: string;
  rightHarmonyColumn?: {
    musicCollection?: {
      description?: string;
      image?: {
        altText?: string;
        sourceUrl?: string;
      };
      spotifyLink?: {
        target?: string;
        title?: string;
        url?: string;
      };
      appleMusicLink?: {
        target?: string;
        title?: string;
        url?: string;
      };
      title?: string;
    }[];
  };
}


const HarmonyAndHeart: React.FC<HarmonyAndHeartProps> = ({ leftColumn, moduleId, rightHarmonyColumn }) => {

  const [isSticky, setIsSticky] = useState(false);


  // Explicitly type the useRef to help TypeScript understand it's a reference to a DOM element
  const pathwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (pathwayRef.current) {
        const rect = pathwayRef.current.getBoundingClientRect();
        if (rect.top <= 100) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add a CSS class for the hover effect
  const hoverEffectClass = 'hover-effect';

  return (
    <div className='container'>
      <div className={`harmony-and-heart row ${isSticky ? 'sticky' : ''}` } ref={pathwayRef} >
        <div className='left-harmony-column col-lg-4 '>
          <div className='wrap mt-4'>
          <Heading level='h2'>{leftColumn.heading}</Heading>
            {leftColumn?.displayMusicPlayer && (
              <>
                <div className='music-player-container'>
                  <div className='row'>
                    <img
                      src={leftColumn.musicPlayer?.coverImage?.sourceUrl}
                      alt={leftColumn.musicPlayer?.coverImage?.altText || ''}
                      className='cover-image'
                    />

                    <div className='info-container justify-content-center'>
                      <p className='artist b2'>{leftColumn.musicPlayer?.artistAuthor}</p>
                      <p className='track-title b2'>{leftColumn.musicPlayer?.trackTitle}</p>
                    </div>
                    <audio controls controlsList="nodownload noplaybackrate" className='audio-player custom-audio-player'>
                      <source src={leftColumn.musicPlayer?.audio?.url} type='audio/mp3' />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className='right-harmony-column col-lg-7 offset-1'>
          {rightHarmonyColumn?.musicCollection?.map((collection, index) => (
            <div key={index} className='container music-collection-item'>
              <div className='row music-row mb-3'>
                <div className='col-4 col-md-6 music-left-column'>
                  <img src={collection?.image?.sourceUrl} alt={collection?.image?.altText || ''} className='collection-image' />
                </div>
                <div className='col-8 col-md-6 music-right-column'>
                  <div className='content-container'>
                    <div className='d-flex flex-column justify-content-center h-100'> {/* Center vertically */}
                      <Heading level='h4' className='music-head text-left'>{collection?.title}</Heading>
                      <div
                        className='blurb text-left b3'
                        dangerouslySetInnerHTML={{ __html: collection?.description || '' }}
                      />
                      {collection?.spotifyLink?.url && (
                        <div className='music-container mt-4 d-md-block d-none'>
                          <div className='music-buttons-row'>
                            <h5>Listen Now:</h5>
                            {collection.spotifyLink?.url && (
                              <div className={`music-button ${hoverEffectClass}`}>
                                <button onClick={() => window.location.href = collection.spotifyLink.url} style={{ padding: 0 }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                    <circle cx="25" cy="25" r="24.5" stroke="#373A36" fill="#FFF" strokeOpacity="0.2" />
                                    <image xlinkHref="https://settings.primroseschools.com/wp-content/uploads/2024/01/Object.png" x="15" y="15" width="20" height="20" />
                                  </svg>
                                  {collection.spotifyLink.title}
                                </button>
                              </div>
                            )}

                            {collection.appleMusicLink?.url && (
                              <div className={`music-button ${hoverEffectClass}`}>
                                <button onClick={() => window.location.href = collection.appleMusicLink.url} style={{ padding: 0 }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                    <circle cx="25" cy="25" r="24.5" stroke="#373A36" fill="#FFF" strokeOpacity="0.2" />
                                    <image xlinkHref="https://settings.primroseschools.com/wp-content/uploads/2024/01/Object2.png" x="15" y="15" width="20" height="20" />
                                  </svg>
                                  {collection.appleMusicLink.title}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 d-block d-md-none p-0"> 
                {collection?.spotifyLink?.url && (
                        <div className='music-container mt-4'>
                          <div className='music-buttons-row'>
                            <h5>Listen Now:</h5>
                            {collection.spotifyLink?.url && (
                              <div className={`music-button ${hoverEffectClass}`}>
                                <button onClick={() => window.location.href = collection.spotifyLink.url} style={{ padding: 0 }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                    <circle cx="25" cy="25" r="24.5" stroke="#373A36" fill="#FFF" strokeOpacity="0.2" />
                                    <image xlinkHref="https://settings.primroseschools.com/wp-content/uploads/2024/01/Object.png" x="15" y="15" width="20" height="20" />
                                  </svg>
                                  {collection.spotifyLink.title}
                                </button>
                              </div>
                            )}

                            {collection.appleMusicLink?.url && (
                              <div className={`music-button ${hoverEffectClass}`}>
                                <button onClick={() => window.location.href = collection.appleMusicLink.url} style={{ padding: 0 }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                    <circle cx="25" cy="25" r="24.5" stroke="#373A36" fill="#FFF" strokeOpacity="0.2" />
                                    <image xlinkHref="https://settings.primroseschools.com/wp-content/uploads/2024/01/Object2.png" x="15" y="15" width="20" height="20" />
                                  </svg>
                                  {collection.appleMusicLink.title}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HarmonyAndHeart;