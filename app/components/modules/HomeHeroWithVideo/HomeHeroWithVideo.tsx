import React, { useState, useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';

interface HomeHeroWithVideoProps {
    leftColumn: {
        heading?: string;
		headingColor?: string;
		subheading?: string;
        subheadingColor?: string;
    };
    rightColumn: {
        video?: {
            url?: string;
        };
    };
    switchColumnOrderOnDesktop?: boolean;
    centerModule?: boolean;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        backgroundColor?: string;
	};
}

const HomeHeroWithVideo: React.FC<HomeHeroWithVideoProps> = ({ switchColumnOrderOnDesktop, centerModule, leftColumn, rightColumn, customizations }) => {
    const videoRef = useRef<HTMLVideoElement>(null);


    const className = `home-hero-with-video ${switchColumnOrderOnDesktop ? 'reverse-column' : ''} ${centerModule ? 'center-module' : ''}`;

    return (
        <div className="container">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor}
	   >
            <div className={className}>
                <div className='left-column col-12 col-lg-6'>
                       <div className='heading-wrapper d-none d-lg-block'>
                            {leftColumn.heading && <Heading level='h1' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
                            {leftColumn.subheading && <Subheading level='h5' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                        </div>
                        <div className='find-a-location-hero'>
                            <h5 className='heading'>
                            <span className='icon me-2'>
                                <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.63493 2.66732C-0.878309 6.224 -0.878309 11.9993 2.63493 15.5557L9 22L15.3651 15.5557C18.8783 11.9993 18.8783 6.224 15.3651 2.66732C11.8523 -0.889107 6.14769 -0.889107 2.63493 2.66732ZM9.12 12.9556C11.2406 12.9556 12.9599 11.2045 12.9599 9.04447C12.9599 6.88442 11.2406 5.13335 9.12 5.13335C6.9994 5.13335 5.28005 6.88442 5.28005 9.04447C5.28005 11.2045 6.9994 12.9556 9.12 12.9556Z" fill="#FF9E1B"/>
                                </svg>
                            </span>Find a School Near You
                            </h5>
                           
                            <div className='search-field'>
                                <input type='search' placeholder='Search by address, city, state, ZIP' />
                                <span className='icon me-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.05454 4.20281C-0.164013 8.47353 -0.164013 15.4082 4.05454 19.6786L11.6975 27.4167L19.3404 19.6786C23.5589 15.4082 23.5589 8.47353 19.3404 4.20281C15.1224 -0.0676034 8.27253 -0.0676034 4.05454 4.20281ZM11.8415 16.5565C14.3879 16.5565 16.4524 14.4539 16.4524 11.8602C16.4524 9.26653 14.3879 7.16391 11.8415 7.16391C9.29522 7.16391 7.23069 9.26653 7.23069 11.8602C7.23069 14.4539 9.29522 16.5565 11.8415 16.5565Z" stroke="#555F68" stroke-width="1.5"/>
                                    </svg>
                                </span>
                                <Button className='primary'>Search</Button>
                            </div>
                             <div className='link'>
                                <span className='icon me-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.25 21C15.9109 21 20.5 16.4109 20.5 10.75C20.5 5.08908 15.9109 0.5 10.25 0.5C4.58908 0.5 0 5.08908 0 10.75C0 16.4109 4.58908 21 10.25 21ZM9.61719 6.35938H10.8723V10.1199H14.6373V11.375H10.8723V15.1451H9.61719V11.375H5.85156V10.1199H9.61719V6.35938Z" fill="#555F68"/>
                                    </svg>
                                </span><a href='/find-a-school'>Search Along Route</a>
                            </div>
                        </div>
                </div>
                {rightColumn.video?.url && (
                    <div className='right-column col-12 col-lg-6'>
                        <div className='heading-wrapper d-block d-lg-none'>
                            {leftColumn.heading && <Heading level='h1' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
                            {leftColumn.subheading && <Subheading level='h5' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                        </div>
                        <div className='responsive-video'>
                         <video 
                                ref={videoRef} 
                                src={rightColumn.video.url} 
                                autoPlay 
                                muted 
                                loop 
                            />
                        </div>
                    </div>
                )}
            </div>
            </Customizations>
        </div>
    );
}

export default HomeHeroWithVideo;
