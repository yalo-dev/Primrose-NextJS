import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import { useSpring, animated } from 'react-spring';
import Customizations from '../../filters/Customizations';
import Link from 'next/link';

interface PrimroseFriends {
    tabs: {
        map(arg0: (tab: any, index: any) => React.JSX.Element): React.ReactNode;
        label?: string;
        tabLabelColor?: string;
        content: {
            videoUrl?: {
                url: string;
                title: string;
                target: string;
            };
            name?: string;
            nameColor?: string;
            characterTrait?: string;
            traitColor?: string;
            bio?: string;
            learnMore?: {
                url: string;
                title: string;
                target: string;
            };
            watchNow?: string;
        }[];
    };
    customizations?: {
        topPaddingMobile?: string;
        topPaddingDesktop?: string;
        bottomPaddingMobile?: string;
        bottomPaddingDesktop?: string;
    };
}

const PrimroseFriends: React.FC<PrimroseFriends> = ({ tabs, customizations }) => {
    const [expandedTab, setExpandedTab] = useState<number | null>(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [playingVideo, setPlayingVideo] = useState<number | null>(null); // This will store the index of the currently playing video

    const slideAnimationProps = useSpring({
        opacity: expandedTab !== null ? 1 : 0,
        transform: expandedTab !== null ? 'scaleY(1)' : 'scaleY(0)',
        from: {
            opacity: 0,
            transform: 'scaleY(0)'
        },
        config: { tension: 280, friction: 60 }
    });

    const fadeInAnimationProps = useSpring({
        opacity: expandedTab !== null ? 1 : 0,
        from: {
            opacity: 0
        }
    });

    // const handleTabClick = (index: number) => {
    //     // Toggle the active tab
    //     if (expandedTab === index) {
    //         setExpandedTab(null);
    //     } else {
    //         setExpandedTab(index);
    //     }
    // };

    const handleLabelClick = (targetId: string) => {
        const targetElement = document.getElementById(targetId);

        if (window.innerWidth > 992) {  // 992px is the typical breakpoint for large (desktop) screens
            if (targetElement) {
                const offset = window.pageYOffset || document.documentElement.scrollTop;
                const absoluteTargetTop = targetElement.getBoundingClientRect().top + offset;

                window.scrollTo({
                    top: absoluteTargetTop - 120, // accounting for the navigation space
                    behavior: 'smooth'
                });

                if (containerRef.current) {
                    const innerDiv = containerRef.current.querySelector('.inner');
                    if (innerDiv) {
                        const innerButtons = innerDiv.querySelectorAll('button');
                        innerButtons.forEach((btn) => {
                            if (btn.getAttribute("data-id") === targetId) {
                                btn.classList.add("expanded");
                            } else {
                                btn.classList.remove("expanded");
                            }
                        });
                    }
                }
            }
        } else {
            // This is the mobile accordion behavior
            if (expandedTab !== null && `content-${expandedTab}` === targetId) {
                setExpandedTab(null);  // close the accordion if the same button is clicked
            } else {
                setExpandedTab(parseInt(targetId.split('-')[1]));
            }
        }
    };


    const PlayButton = ({ onPlay }) => (
        <div onClick={onPlay} className="play-button">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15.5229" cy="15.5229" r="15.5229" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12.3575 8.86283C11.5424 8.35733 10.5555 9.03977 10.5555 10.1089V20.9369C10.5555 22.006 11.5424 22.6884 12.3575 22.1829L21.087 16.7689C21.947 16.2356 21.947 14.8102 21.087 14.2768L12.3575 8.86283Z" fill="#373A36" />
            </svg>
        </div>
    );

    const [videoPlaying, setVideoPlaying] = useState(false);

    const currentTab = expandedTab !== null ? tabs[expandedTab] : null;

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const containerTop = containerRef.current.getBoundingClientRect().top;
                const lastContentOffset = document.querySelector('.desktop-content:last-child')?.getBoundingClientRect().bottom;

                if (containerTop <= 120 && lastContentOffset && lastContentOffset > 0) {
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const toggleVideoPlayback = (index: number) => {
        const currentVideo = videoRefs.current[index];
        if (currentVideo) {
            if (currentVideo.paused) { // If video is paused, play it
                currentVideo.play();
                setPlayingVideo(index);
            } else { // If video is playing, pause it
                currentVideo.pause();
                setPlayingVideo(null); // Reset playing video so the play button shows
            }
        }
    };


    return (
        <div className={`container ${isSticky ? 'sticky' : ''}`} ref={containerRef}>
            <Customizations
                topPaddingMobile={customizations?.topPaddingMobile}
                topPaddingDesktop={customizations?.topPaddingDesktop}
                bottomPaddingMobile={customizations?.bottomPaddingMobile}
                bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
            >
                <div className="primrose-friends">
                    <div className="inner col-lg-4">
                        {tabs.map((tab, index) => (
                            <div className='label' key={index}>
                                <button
                                    onClick={() => handleLabelClick(`content-${index}`)}
                                    data-id={`content-${index}`} // Add this attribute
                                    className={expandedTab === index ? 'expanded' : ''}
                                >
                                    {tab.label &&
                                        <Heading level='h5' color={tab.tabLabelColor}>
                                            <div dangerouslySetInnerHTML={{ __html: tab.label }} />
                                            <div id="button">
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </Heading>
                                    }
                                </button>

                                {/* Mobile: Content rendered right below the label */}
                                <div className="d-lg-none">
                                    {expandedTab === index && (
                                        <animated.div style={slideAnimationProps} className="tab-content">
                                            <div className='wrap'>
                                                {tab.content?.image?.sourceUrl && (
                                                    <div className='image-wrapper'>
                                                        <Image src={tab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
                                                    </div>
                                                )}

                                                <div className='content-wrapper'>
                                                    {tab.content.name &&
                                                        <Heading level='h3' color={tab.content.nameColor}>
                                                            <div dangerouslySetInnerHTML={{ __html: tab.content.name }} />
                                                        </Heading>
                                                    }
                                                    {tab.content.characterTrait &&
                                                        <div className='wrap d-flex pt-lg-3 pb-lg-3'>
                                                            <div className='h5 mb-0'><b>Character Trait:&nbsp;</b></div><Subheading level='h5' className='b3 mb-0' color={tab.content.traitColor}>{tab.content.characterTrait}</Subheading>
                                                        </div>
                                                    }
                                                    <div className='bio'>{tab.content.bio && <p>{tab.content.bio}</p>}</div>
                                                    {tab.content.learnMore && tab.content.learnMore.url &&
                                                        <Link href={tab.content.learnMore.url} className='link learn-more' target={tab.content.learnMore.target || "_self"}>
                                                            {tab.content.learnMore.title}
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                            <div className='video-wrapper flex-column flex-lg-row'>
                                                {tab.content.watchNow &&
                                                    <div className='wrap d-flex pe-4 flex-column'>
                                                        <div className='h5'><b>Watch Now:&nbsp;</b></div>{tab.content.watchNow && <Heading level='h5' className='b3'>{tab.content.watchNow}</Heading>}
                                                    </div>
                                                }
                                                {tab.content?.videoUrl?.url && (
                                                    <div className='video'>
                                                        {playingVideo !== index && <PlayButton onPlay={() => toggleVideoPlayback(index)} />} {/* Only show play button if this video is not playing */}
                                                        <video
                                                            width="320"
                                                            height="240"
                                                            ref={(el) => (videoRefs.current[index] = el)}
                                                            muted
                                                            onClick={() => toggleVideoPlayback(index)} // Toggle playback when video is clicked
                                                        >
                                                            <source src={tab.content.videoUrl.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                )}
                                            </div>
                                        </animated.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Content rendered outside the loop in a designated area */}

                    <div className='desktop-content d-none d-lg-block col-lg-7 offset-lg-1'>
                        {tabs.map((tab, index) => (
                            <div id={`content-${index}`} className="tab-content d-flex" key={index}>

                                <div className='wrap'>
                                    {tab.content?.image?.sourceUrl && (
                                        <div className='image-wrapper'>
                                            <Image src={tab.content.image.sourceUrl} alt="Tab Image" width={200} height={200} />
                                        </div>
                                    )}

                                    <div className='content-wrapper'>
                                        {tab.content.name &&
                                            <Heading level='h3' color={tab.content.nameColor}>
                                                <div dangerouslySetInnerHTML={{ __html: tab.content.name }} />
                                            </Heading>
                                        }
                                        {tab.content.characterTrait &&
                                            <div className='wrap d-flex pt-lg-3 pb-lg-3 flex-wrap'>
                                                <div className='h5 mb-0'><b>Character Trait:&nbsp;</b></div><Subheading level='h5' className='b3 mb-0' color={tab.content.traitColor}>{tab.content.characterTrait}</Subheading>
                                            </div>
                                        }
                                        <div className='bio'>{tab.content.bio && <p>{tab.content.bio}</p>}</div>
                                        {tab.content.learnMore && tab.content.learnMore.url &&
                                            <Link href={tab.content.learnMore.url} className='link learn-more' target={tab.content.learnMore.target || "_self"}>
                                                {tab.content.learnMore.title}
                                            </Link>
                                        }
                                    </div>
                                </div>
                                <div className='video-wrapper pt-3 flex-column flex-lg-row'>
                                    {tab.content.watchNow &&
                                        <div className='wrap d-flex flex-column  align-items-end'>
                                            <div className='h5'><b>Watch Now:&nbsp;</b></div>{tab.content.watchNow && <Heading level='h5' className='b3'>{tab.content.watchNow}</Heading>}
                                        </div>
                                    }
                                    {tab.content?.videoUrl?.url && (
                                        <div className='video'>
                                            {playingVideo !== index && <PlayButton onPlay={() => toggleVideoPlayback(index)} />} {/* Only show play button if this video is not playing */}
                                            <video
                                                width="320"
                                                height="240"
                                                ref={(el) => (videoRefs.current[index] = el)}
                                                muted
                                                onClick={() => toggleVideoPlayback(index)} // Toggle playback when video is clicked
                                            >
                                                <source src={tab.content.videoUrl.url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Customizations>
        </div>
    );
}

export default PrimroseFriends;