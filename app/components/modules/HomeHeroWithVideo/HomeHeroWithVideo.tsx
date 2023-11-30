import React, { useState, useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Customizations from '../../filters/Customizations';

interface HomeHeroWithVideoProps {
    leftColumn: {
        eyebrow?: string;
        eyebrowColor?: string;
        heading?: string;
		headingColor?: string;
		subheading?: string;
        subheadingColor?: string;
        blurb?: string;
        blurbColor?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
        buttonStyle?: 'primary' | 'secondary' | 'white'; 
    };
    rightColumn: {
        video?: {
            url?: string;
        };
    };
    accent?: {
        sourceUrl?: string;
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

const HomeHeroWithVideo: React.FC<HomeHeroWithVideoProps> = ({ accent, switchColumnOrderOnDesktop, centerModule, leftColumn, rightColumn, customizations }) => {
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
                        {leftColumn.heading && <Heading level='h1' color={leftColumn.headingColor}>{leftColumn.heading}</Heading>}
						{leftColumn.subheading && <Subheading level='h5' color={leftColumn.subheadingColor}>{leftColumn.subheading}</Subheading>}
                        
                </div>
                {rightColumn.video?.url && (
                    <div className='right-column col-12 col-lg-6'>
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
                 <div className='accent'
				    style={{ backgroundImage: `url('${accent?.sourceUrl}')` }} 
			    ></div>
            </div>
            </Customizations>
        </div>
    );
}

export default HomeHeroWithVideo;
