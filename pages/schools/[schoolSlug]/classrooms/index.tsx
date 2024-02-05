import { useQuery, gql } from "@apollo/client";
import Image from "next/legacy/image";
import { useRouter } from 'next/router';
import GeneralHorizontalTabs from "../../../../app/components/modules/GeneralHorizontalTabs/GeneralHorizontalTabs";
import Heading from "../../../../app/components/atoms/Heading/Heading";
import Subheading from "../../../../app/components/atoms/Subheading/Subheading";
import Paragraph from "../../../../app/components/atoms/Paragraph/Paragraph";
import Button from "../../../../app/components/atoms/Button/Button";
import { useEffect, useRef, useState } from "react";

const slugify = require('slugify');


const GET_SCHOOL_DETAILS = gql`
query SchoolData($id: ID!) {
    classroom(id: "our-classrooms", idType: URI) {
        title
        classroomModules {
          classroomHero {
            heroImage {
              altText
              mediaItemUrl
              sourceUrl
            }
            paragraph
            title
            heroVideo {
              mediaItemUrl
              sourceUrl
            }
            icon {
              altText
              mediaItemUrl
              sourceUrl
            }
          }
          isClassroom
          verticalTabs {
            tabs {
              content {
                cta {
                  target
                  title
                  url
                }
                heading
                headingColor
                image {
                  altText
                  mediaItemUrl
                  sourceUrl
                }
                list {
                  detailsPopUp
                  icon {
                    altText
                    mediaItemUrl
                    sourceUrl
                  }
                  text
                  textColor
                }
                subheading
                subheadingColor
              }
              tabLabelColor
              label
            }
          }
        }
      }
    school(id: $id, idType: URI) {
      id
      slug
      uri
      schoolAdminSettings {
        accreditation {
          imageAlt
          image {
            mediaItemUrl
          }
        }
        classroomsOffered
        extraCareOffered
        displayEmergencyAlert
        emergencyMessage {
          message
          expirationDate
        }
        enrollingNow
        facebookLink
        instagramLink
        gallery {
          caption
          title
          imageAlt
          image {
            mediaItemUrl
            sourceUrl
          }
        }
        hiringNow
        hoursOfOperation {
          closingTime
          openingTime
        }
        satImages {
          image {
            mediaItemUrl
            sourceUrl
          }
          imageAlt
        }
        yelpLink
        newsItems {
          content
          expires
          newsImage {
            imageAlt
            image {
              mediaItemUrl
            }
          }
          publishDate
          shortDescription
          title
        }
        googleLink
        meetStaffImage{
          mediaItemUrl
        }
        testimonials {
          ... on Testimonial {
            id
            featuredImage {
              node {
                altText
                mediaItemUrl
                sourceUrl
              }
            }
            title
            testimonials {
              title
              testimonial
              heading
              name
            }
          }
        }
      }
      
    }
  }
`;

export default function ClassroomPage() {
    
    const router = useRouter();
    const [currentSlug, setCurrentSlug] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const { data, loading, error } = useQuery(GET_SCHOOL_DETAILS, {
        variables: { id: currentSlug || '' },
        skip: !currentSlug,
    });
    const leftScrollerRef = useRef<HTMLDivElement>(null);
    const rightScrollerRef = useRef<HTMLDivElement>(null);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    
    const scrollContent = () => {
        const leftScroller = leftScrollerRef.current;
        const rightScroller = rightScrollerRef.current;

        if (leftScroller) {
            leftScroller.scrollTop += 1;
            if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
                leftScroller.scrollTop = 0;
            }
        }

        if (rightScroller) {
            rightScroller.scrollTop -= 1;
            if (rightScroller.scrollTop <= 0) {
                rightScroller.scrollTop = rightScroller.scrollHeight / 2;
            }
        }
    };

    useEffect(() => {
        const checkIfImagesLoaded = () => {
            const images = document.querySelectorAll('.find-a-school .image-scroller img');
            return Array.from(images).every((img) => (img as HTMLImageElement).complete);
        };
        if (checkIfImagesLoaded()) {
            setAllImagesLoaded(true);
            setInterval(scrollContent, 20);
        } else {
            const images = document.querySelectorAll('.find-a-school .image-scroller img');
            images.forEach((img) => {
                img.addEventListener('load', () => {
                    if (checkIfImagesLoaded()) {
                        setAllImagesLoaded(true);
                        setInterval(scrollContent, 20);
                    }
                });
            });
        }
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const slugFromArray = Array.isArray(router.query.schoolSlug)
                ? router.query.schoolSlug[0]
                : router.query.schoolSlug;
            const slugValue = slugFromArray !== undefined ? slugFromArray : null;

            setCurrentSlug(slugValue);
        }
    }, [router.isReady, router.query.schoolSlug]);

    useEffect(() => {
        const navHeight = 100;
        const desktopBreakpoint = 992;
        const offsetToUnstick = 150;

        const handleScroll = () => {
            if (window.innerWidth >= desktopBreakpoint) {
                const innerElement = document.querySelector('.general-horizontal-tabs-module .inner') as HTMLElement;
                const tabContentElement = document.querySelector('.general-horizontal-tabs-module .desktop-content') as HTMLElement;

                if (innerElement && tabContentElement) {
                    const innerTop = innerElement.getBoundingClientRect().top;
                    const tabContentBottom = tabContentElement.getBoundingClientRect().bottom;
                    const shouldStick = innerTop <= navHeight;
                    const shouldUnstick = tabContentBottom <= (offsetToUnstick + navHeight);

                    if (shouldStick && !shouldUnstick) {
                        innerElement.classList.add('sticky');
                        innerElement.style.top = `${navHeight}px`;
                    } else {
                        innerElement.classList.remove('sticky');
                    }
                }
            } else {
                const innerElement = document.querySelector('.general-horizontal-tabs-module .inner') as HTMLElement;
                if (innerElement) {
                    innerElement.classList.remove('sticky');
                }
                return;
            }

            // Desktop logic for expanding tabs based on scroll
            document.querySelectorAll('.general-horizontal-tabs-module .tab-content').forEach((section) => {
                if (isElementInViewport(section)) {
                    const target = section.getAttribute('id');
                    document.querySelectorAll('.general-horizontal-tabs-module .clickable').forEach((btn) => {
                        if (btn.getAttribute('data-target') === target) {
                            btn.classList.add('expanded');
                        } else {
                            btn.classList.remove('expanded');
                        }
                    });
                }
            });
        };

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
 
    useEffect(() => {
        if (data) {
            const handleClick = (event) => {
                const desktopBreakpoint = 992;
                if (window.innerWidth < desktopBreakpoint) {
                    return;
                }
                const btn = event.target.closest('.general-horizontal-tabs-module .clickable');
                if (!btn) return;
                const targetId = btn.getAttribute('data-target');
                if (targetId) {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
                        const offsetTop = sectionTop - 317;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            };
            const clickableButtons = document.querySelectorAll('.general-horizontal-tabs-module .clickable');
            clickableButtons.forEach(btn => btn.addEventListener('click', handleClick));
            return () => {
                clickableButtons.forEach(btn => btn.removeEventListener('click', handleClick));
            };
        }
    }, [data]);

    useEffect(() => {
        const leftScroller = leftScrollerRef.current;
        const rightScroller = rightScrollerRef.current;

        let intervalId: number;

        function scrollContent() {
            if (leftScroller) {
                leftScroller.scrollTop += 1;
                if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
                    leftScroller.scrollTop = 0;
                }
            }

            if (rightScroller) {
                rightScroller.scrollTop -= 1;
                if (rightScroller.scrollTop <= 0) {
                    rightScroller.scrollTop = rightScroller.scrollHeight / 2;
                }
            }
        }

        intervalId = window.setInterval(scrollContent, 20);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    console.log(error);
    if (loading) return <div></div>;
    if (error) return <div></div>;
    if (!data?.school) return <div></div>;

    const handleTabClick = (tabId: string) => {
        const mobileBreakpoint = 992;
        if (window.innerWidth > mobileBreakpoint) {
            return;
        }
        if (activeTab === tabId) {
            setActiveTab(null);
        } else {
            setActiveTab(tabId);
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

    const CustomVideoComponent = ({ src }) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const videoRef = useRef<HTMLVideoElement>(null);

        const togglePlay = () => {
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.pause();
                } else {
                    videoRef.current.play();
                }
                setIsPlaying(!isPlaying);
            }
        };

        return (
            <div className='video-wrapper' onClick={togglePlay}>
                <video ref={videoRef} src={src} style={{ width: '100%', height: 'auto' }} />
                {!isPlaying && <PlayButton onPlay={togglePlay} />}
            </div>
        );
    };

    const  heroWithImage  = data.classroom.classroomModules.classroomHero;
    
    let selectedClassrooms = data?.school?.schoolAdminSettings?.classroomsOffered || [];
    /* if(data?.school?.schoolAdminSettings?.extraCareOffered != "none"){
        selectedClassrooms.push(data?.school?.schoolAdminSettings?.extraCareOffered);
    } */
    const isClassroomSelected = (classroomType) => {
        return selectedClassrooms.includes(classroomType);
    };

    const hasOfferings = data?.school?.schoolAdminSettings?.extraCareOffered != 'None' || selectedClassrooms.includes('Summer Adventure Club');
    const hasMultipleOfferings = data?.school?.schoolAdminSettings?.extraCareOffered != 'None'  && selectedClassrooms.includes('Summer Adventure Club');
    console.log(data.school.schoolAdminSettings.extraCareOffered);
    const summerAdventureClub = selectedClassrooms.includes("Summer Adventure Club");

    const beforeAndAfterSchoolCare = data?.school?.schoolAdminSettings?.extraCareOffered;

    const primroseCommitment = data?.school?.schoolAdminSettings?.primroseCommitment;
    

    const ScheduleATour = data?.school?.schoolAdminSettings?.satImages || {};
    const classroom = data?.classroom || {};
    const tabs = classroom?.classroomModules.verticalTabs.tabs || {};
    return (
        <>
            <div className="school classrooms">
                <div className="container jumbo">
                    <div className="hero-with-image-module">
                        <div className='hero-with-image reverse-column'>
                            {heroWithImage?.heroVideo?.sourceUrl &&(
                                <video 
                                src={heroWithImage.heroVideo.sourceUrl} 
                                autoPlay 
                                muted
                                playsInline
                                />
                            )}
                            {!heroWithImage?.heroVideo?.sourceUrl && (
                                <div className='left-column col-12 col-lg-6'>
                                    <Image
                                        src={heroWithImage?.heroImage?.sourceUrl}
                                        alt={heroWithImage?.heroImage?.altText}
                                        layout="fill"
                                        objectFit="cover"
                                        priority
                                    />
                                </div>
                            )}
                            {heroWithImage?.icon?.sourceUrl && (
                                <div className='right-column col-12 col-lg-6'>
                                    {heroWithImage?.icon?.sourceUrl && (
                                        <div className='icon d-none d-lg-block'>
                                            
                                            <Image
                                                src={heroWithImage?.icon?.sourceUrl}
                                                alt="Hero Image"
                                                layout="fill"
                                                objectFit="cover"
                                                priority
                                            />
                                        </div>
                                    )}
                                    {heroWithImage.title && <Heading level='h2'>{heroWithImage.title}</Heading>}
                                    {heroWithImage.paragraph && <div dangerouslySetInnerHTML={{__html:heroWithImage.paragraph}}></div>}
                                    
                                </div>
                            )}
                        </div>
                    </div>
                </div>
               
                
                {tabs && (
            <div className="container">
                <div className="general-horizontal-tabs-module">
                    <h2 className="heading">Classrooms Offered</h2>
                    <div className="general-horizontal-tabs">
                        <div className="inner">
                            {tabs.map((tab, index) => (
                                <div>
                                    <button data-target={slugify(tab.label)} className={`clickable ${activeTab === slugify(tab.label) ? 'expanded' : ''}`} onClick={() => handleTabClick(slugify(tab.tabLabel))}>
                                        <Heading level='h5'>{tab.label}
                                            <div id="button">
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </Heading>
                                    </button>

                                    {/* Mobile: Content rendered right below the label */}
                                    <div className="d-lg-none">
                                        <div className={`tab-content ${activeTab === slugify(tab.label) ? 'active' : ''}`} style={{ opacity: activeTab === slugify(tab.label) ? '1' : '0' }}>

                                            <img src={tab.content.image} />
                                            <div className='content-wrapper'>
                                                <Heading level='h3'>{tab.content.heading}</Heading>
                                                <Subheading level='div' className='b3'>{tab.content.subheading}</Subheading>
                                                <Button variant="primary" href={tab.content.cta.url}>{tab.content.cta.title}</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                       </div>     
                            <div className='desktop-content d-none d-lg-block'>
                                {tabs.map((tab, index) => (
                                
                                    <div id={slugify(tab.label)} className="tab-content d-flex">

                                        <img src={tab.content.image?.sourceUrl} />
                                        <div className='content-wrapper'>
                                            <Heading level='h3'>{tab.content.heading}</Heading>
                                            <Subheading level='div' className='b3'>{tab.content.subheading}</Subheading>
                                            <Button variant="primary" href={"/schools/" + currentSlug + "/classrooms/" + slugify(tab.label, {lower:true})}>{tab.content.cta.title}</Button>
                                        </div>
                                    </div>
                                )
                                )}
                            </div>
                    
                </div>
            </div>
            <div className="additional-offerings">
                    {hasOfferings && (
                        <h2 className="heading offset-lg-1">{hasMultipleOfferings ? 'Additional Offerings' : 'Additional Offering'}</h2>
                    )}
                    {/* Render Before and After School Care */}
                    {beforeAndAfterSchoolCare && (
                        <div className='two-columns-image-and-text-alternative'>
                            <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                <img
                                    src='https://settings.primroseschools.com/wp-content/uploads/2023/08/Bg.png'
                                    alt="Kids in After School Program"
                                    width={500}
                                    height={500}
                                />
                            </div>
                            <div className='right-column col-12 c col-lg-5 offset-lg-1'>
                                <div className="b4 bold">{beforeAndAfterSchoolCare}</div>
                                <div className='blurb' ><p>Whether your child is a budding actor, tech wizard, athlete, author or rock star, there’s something for everyone in our Explorer program.</p></div>
                                <Button href={"/schools/" + currentSlug + "/classrooms/before-after-school"} label="Learn More">
                                    "Learn More"
                                </Button>
                            </div>
                        </div>
                    )}
                    {/* Render Summer Adventure Club */}
                    {summerAdventureClub && (
                        <div className='two-columns-image-and-text-alternative reverse-column'>
                            <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                <img
                                    src="https://settings.primroseschools.com/wp-content/uploads/2023/08/Bg-1.png"
                                    alt="Student in Summer Adventure Club"
                                    width={500}
                                    height={500}
                                />
                            </div>
                            <div className='right-column col-12 col-lg-5 offset-lg-1'>
                                <div className="b4">Summer Adventure Club</div>
                                <div className='blurb'><p>Each week at Summer Adventure Club, your child tries a variety of hands-on activities — like sports, robotics and arts — that help build skills around literacy, creative problem solving, STEM and more.</p></div>
                                <Button href={"/schools/" + currentSlug + "/classrooms/summer-adventure-club"}  label="Learn More">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>             
                )}
                            

             
                
                
                {ScheduleATour && (
                    <div className='container'>
                    <div className='find-a-school'>
                        <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                             <Heading level='h2'>Our family would love to meet yours.</Heading>
                            <Subheading level='div' className='b3'>Contact us to schedule a tour.</Subheading>
                          
                                <Button variant="secondary" href={"/schools/" + currentSlug + "/schedule-a-tour"}>
                                    Schedule A Tour
                                </Button>
                            
                        </div>
                        <div className='right-column col-4 col-lg-5 col-xxl-6'>
                            {ScheduleATour && ScheduleATour.length > 0 && (
                                <>
                                    <div className="image-scroller first" ref={leftScrollerRef}>
                                        {ScheduleATour.map((imgObj, idx) => (
                                            imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                        ))}
                                        {ScheduleATour.map((imgObj, idx) => (
                                            imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                        ))}
                                    </div>
                                    <div className="image-scroller second" ref={rightScrollerRef}>
                                        {ScheduleATour.map((imgObj, idx) => (
                                            imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                        ))}
                                        {ScheduleATour.map((imgObj, idx) => (
                                            imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
    );
}
