import React, { useEffect, useRef, useState } from 'react';
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
        friendColor?: string;
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
    const [expandedTabPF, setExpandedTabPF] = useState<number | null>(0);
    const videoRefsPF = useRef<(HTMLVideoElement | null)[]>([]);
    const [playingVideoPF, setPlayingVideoPF] = useState<number | null>(null); 
    const contentRefsPF = useRef<(HTMLDivElement | null)[]>([]);
    const mobileButtonRefsPF = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleScrollPF = () => {
            if (containerRefPF.current) {
                const containerTopPF = containerRefPF.current.getBoundingClientRect().top;

                contentRefsPF.current.forEach((contentDivPF, index) => {
                    if (contentDivPF) {
                        const top = contentDivPF.getBoundingClientRect().top;
                        const bottom = contentDivPF.getBoundingClientRect().bottom;

                        // Adjust the value based on your requirement.
                        // Here, 120 is the offset from the top where we consider the content div in view.
                        if (top <= 120 && bottom >= 120) {
                            setExpandedTabPF(index);
                        }
                    }
                });

                const lastContentOffsetPF = document.querySelector('.primrose-friends .desktop-content:last-child')?.getBoundingClientRect().bottom;

                if (containerTopPF <= 120 && lastContentOffsetPF && lastContentOffsetPF > 0) {
                    setIsStickyPF(true);
                } else {
                    setIsStickyPF(false);
                }
            }
        };

        window.addEventListener('scroll', handleScrollPF);

        return () => {
            window.removeEventListener('scroll', handleScrollPF);
        }
    }, []);

    const slideAnimationPropsPF = useSpring({
        opacity: expandedTabPF !== null ? 1 : 0,
        transform: expandedTabPF !== null ? 'scaleY(1)' : 'scaleY(0)',
        from: {
            opacity: 0,
            transform: 'scaleY(0)'
        },
        config: { tension: 280, friction: 60 }
    });

    const fadeInAnimationPropsPF = useSpring({
        opacity: expandedTabPF !== null ? 1 : 0,
        from: {
            opacity: 0
        }
    });

    const handleLabelClickPF = (targetId: string) => {
        console.log("Button clicked:", targetId);

        // Parse the index from the targetId
        const parsedIndex = parseInt(targetId.replace("pf-content-", ""), 10);
        if (isNaN(parsedIndex)) {
            console.error(`Failed to parse index from targetId: ${targetId}`);
            return;
        }
        console.log("Parsed Index:", parsedIndex);

        if (window.innerWidth > 992) {  // Desktop behavior
            setExpandedTabPF(parsedIndex);
            const targetElementPF = document.getElementById(targetId);
            if (targetElementPF) {
                const offsetPF = window.pageYOffset || document.documentElement.scrollTop;
                const absoluteTargetTopPF = targetElementPF.getBoundingClientRect().top + offsetPF;

                window.scrollTo({
                    top: absoluteTargetTopPF - 120, // accounting for the navigation space
                    behavior: 'smooth'
                });

                if (containerRefPF.current) {
                    const innerDivPF = containerRefPF.current.querySelector('.primrose-friends .inner');
                    if (innerDivPF) {
                        const innerButtonsPF = innerDivPF.querySelectorAll('button');
                        innerButtonsPF.forEach((btn) => {
                            if (btn.getAttribute("data-id-pf") === targetId) {
                                btn.classList.add("expanded");
                            } else {
                                btn.classList.remove("expanded");
                            }
                        });
                    }
                }
            }
        } else {  // Mobile behavior
            if (expandedTabPF !== null && `pf-content-${expandedTabPF}` === targetId) {
                setExpandedTabPF(null);  // Collapse the content
            } else {
                setExpandedTabPF(parsedIndex);
            }

            // Scroll to the button location after a short delay
            setTimeout(() => {
                const buttonElementPF = mobileButtonRefsPF.current[parsedIndex];
                if (buttonElementPF) {
                    const buttonTopPF = buttonElementPF.getBoundingClientRect().top;
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    window.scrollTo({
                        top: scrollTop + buttonTopPF - 120, // accounting for the navigation space
                        behavior: 'smooth'
                    });
                }
            }, 100);
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

    const currentTab = expandedTabPF !== null ? tabs[expandedTabPF] : null;

    const containerRefPF = useRef<HTMLDivElement | null>(null);

    const [isStickyPF, setIsStickyPF] = useState(false);

    useEffect(() => {
        const handleScrollPF = () => {
            if (containerRefPF.current) {
                const containerTopPF = containerRefPF.current.getBoundingClientRect().top;
                const lastContentOffsetPF = document.querySelector('.primrose-friends .desktop-content:last-child')?.getBoundingClientRect().bottom;

                if (containerTopPF <= 120 && lastContentOffsetPF && lastContentOffsetPF > 0) {
                    setIsStickyPF(true);
                } else {
                    setIsStickyPF(false);
                }
            }
        };

        window.addEventListener('scroll', handleScrollPF);

        return () => {
            window.removeEventListener('scroll', handleScrollPF);
        }
    }, []);

    const toggleVideoPlayback = (index: number) => {
        const currentVideo = videoRefsPF.current[index];
        if (currentVideo) {
            if (currentVideo.paused) { // If video is paused, play it
                currentVideo.play();
                setPlayingVideoPF(index);
            } else { // If video is playing, pause it
                currentVideo.pause();
                setPlayingVideoPF(null); // Reset playing video so the play button shows
            }
        }
    };

    return (
        <div className={`container ${isStickyPF ? 'sticky' : ''}`} ref={containerRefPF}>
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
                                    ref={(el) => mobileButtonRefsPF.current[index] = el}
                                    onClick={() => handleLabelClickPF(`pf-content-${index}`)}
                                    data-id-pf={`pf-content-${index}`}
                                    className={expandedTabPF === index ? 'expanded' : ''}
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
                                    {expandedTabPF === index && (
                                        <animated.div style={slideAnimationPropsPF} className={`tab-content ${tab.friendColor || ''}`} id={`pf-content-${index}`}>
                                            <div className='wrap p-3'>
                                                {tab.content?.image?.sourceUrl && (
                                                    <div className='image-wrapper'>
                                                        <img src={tab.content.image.sourceUrl} alt={tab.content.image.altText} width={200} height={200} />
                                                    </div>
                                                )}

                                                <div className='content-wrapper'>
                                                    {tab.content.name &&
                                                        <Heading level='h3' color={tab.content.nameColor}>
                                                            <div dangerouslySetInnerHTML={{ __html: tab.content.name }} />
                                                        </Heading>
                                                    }
                                                    {tab.content.characterTrait &&
                                                        <div className='wrap pb-2'>
                                                            <span className='h5 mb-0'><b>Character Trait:&nbsp;</b></span><span className='b3 mb-0' color={tab.content.traitColor}>{tab.content.characterTrait}</span>
                                                        </div>
                                                    }
                                                    <div className='bio'>{tab.content.bio && <p>{tab.content.bio}</p>}</div>
                                                    {tab.content.learnMore && tab.content.learnMore.url &&
                                                        <Link href={tab.content.learnMore.url} className='link learn-more b2' target={tab.content.learnMore.target || "_self"}>
                                                            {tab.content.learnMore.title}<span>&nbsp;&#62;</span>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                            <div className='video-wrapper flex-column flex-lg-row p-3'>
                                                {tab.content.watchNow &&
                                                    <div className='wrap pe-4'>
                                                        <span className='h5'><b>Watch Now:&nbsp;</b></span>{tab.content.watchNow && <span className='b3'>{tab.content.watchNow}</span>}
                                                    </div>
                                                }
                                                {tab.content?.videoUrl?.url && (
                                                    <div className='video'>
                                                        {playingVideoPF !== index && <PlayButton onPlay={() => toggleVideoPlayback(index)} />} {/* Only show play button if this video is not playing */}
                                                        <video
                                                            width="320"
                                                            height="240"
                                                            ref={(el) => (videoRefsPF.current[index] = el)}
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
                            <div id={`pf-content-${index}`} className={`tab-content d-flex ${tab.friendColor || ''}`} key={index} ref={el => contentRefsPF.current[index] = el}>

                                <div className='wrap'>
                                    {tab.content?.image?.sourceUrl && (
                                        <div className='image-wrapper'>
                                            <img src={tab.content.image.sourceUrl} alt={tab.content.image.altText} width={200} height={200} />
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
                                            <Link href={tab.content.learnMore.url} className='link learn-more b2' target={tab.content.learnMore.target || "_self"}>
                                                {tab.content.learnMore.title}<span>&nbsp;&#62;</span>
                                            </Link>
                                        }
                                    </div>
                                </div>
                                {tab.content?.videoUrl?.url && (
                                    <div className='video-wrapper pt-3 flex-column flex-lg-row'>

                                        <div className='wrap d-flex flex-column  align-items-end watch-wrapper'>
                                            <div className='h5 text-end'><b>Watch Now:&nbsp;</b></div>{tab.content.watchNow && <Heading level='h5' className='b3'>{tab.content.watchNow}</Heading>}
                                        </div>


                                        <div className='video'>
                                            {playingVideoPF !== index && <PlayButton onPlay={() => toggleVideoPlayback(index)} />} {/* Only show play button if this video is not playing */}
                                            <video
                                                width="320"
                                                height="240"
                                                ref={(el) => (videoRefsPF.current[index] = el)}
                                                muted
                                                onClick={() => toggleVideoPlayback(index)} // Toggle playback when video is clicked
                                            >
                                                <source src={tab.content.videoUrl.url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Customizations>
        </div>
    );
}

export default PrimroseFriends;