import React, { useState, useRef } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';

interface HeroWithVideoProps {
    accent?: {
        sourceUrl?: string;
    };
    switchColumnOrderOnDesktop?: boolean;
    leftColumn: {
        heading?: string;
        subheading?: string;
        blurb?: string;
        button?: {
            target?: string;
            title?: string;
            url?: string;
        };
    };
    rightColumn: {
        video?: {
            url?: string;
        };
    };
}

const HeroWithVideo: React.FC<HeroWithVideoProps> = ({ accent, switchColumnOrderOnDesktop, leftColumn, rightColumn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const className = `hero-with-video ${switchColumnOrderOnDesktop ? 'reverse-column' : ''}`;
    const style = accent?.sourceUrl ? { backgroundImage: `url(${accent.sourceUrl})` } : {};

    return (
        <div className='container'>
            <div className={className} style={style}>
                <div className='left-column col-12 col-lg-6'>
                    {leftColumn.heading && <Heading level='h1' className='green'>{leftColumn.heading}</Heading>}
                    {leftColumn.subheading && <Subheading level='h5' className='green'>{leftColumn.subheading}</Subheading>}
                    {leftColumn.blurb && <Paragraph className='b2'>{leftColumn.blurb}</Paragraph>}
                    {leftColumn.button?.url && <Button href={leftColumn.button.url} target={leftColumn.button.target} label={leftColumn.button.title}>
                        {leftColumn.button.title}
                    </Button>}
                </div>
                {rightColumn.video?.url && (
                    <div className='right-column responsive-video col-12 col-lg-6'>
                        <video ref={videoRef} src={rightColumn.video.url} onClick={() => setIsPlaying(true)} />
                        {!isPlaying && (
                            <div className='play-button' onClick={handlePlay}>
                                <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <circle cx='15.5229' cy='15.5229' r='15.5229' fill='white' />
                                    <path fillRule='evenodd' clipRule='evenodd' d='M12.3575 8.86283C11.5424 8.35733 10.5555 9.03977 10.5555 10.1089V20.9369C10.5555 22.006 11.5424 22.6884 12.3575 22.1829L21.087 16.7689C21.947 16.2356 21.947 14.8102 21.087 14.2768L12.3575 8.86283Z' fill='#373A36' />
                                </svg>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HeroWithVideo;
