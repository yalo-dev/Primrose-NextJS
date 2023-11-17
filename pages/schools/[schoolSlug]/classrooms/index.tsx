import { useQuery, gql } from "@apollo/client";
import Image from "next/legacy/image";
import { useRouter } from 'next/router';
import Heading from "../../../../app/components/atoms/Heading/Heading";
import Subheading from "../../../../app/components/atoms/Subheading/Subheading";
import Paragraph from "../../../../app/components/atoms/Paragraph/Paragraph";
import Button from "../../../../app/components/atoms/Button/Button";
import { useEffect, useRef, useState } from "react";

const GET_SCHOOL_DETAILS = gql`
query SchoolData($id: ID!) {
    school(id: $id, idType: URI) {
      id
      slug
      uri
      schoolSettings {
        classrooms {
          heroWithImage {
            leftColumn {
              image {
                sourceUrl
              }
            }
            rightColumn {
              heading
              blurb
              icon {
                sourceUrl
                altText
              }
            }
          }
          classroomSelection {
            selectClassrooms
          }
          additionalOfferings {
            summerAdventureClub {
              leftColumn {
                blurb
                heading
                button {
                  target
                  title
                  url
                }
              }
              rightColumn {
                altText
                image {
                  sourceUrl
                }
              }
            }
            beforeAndAfterSchoolCare {
              leftColumn {
                altText
                image {
                  sourceUrl
                }
              }
              rightColumn {
                blurb
                heading
                button {
                  target
                  title
                  url
                }
              }
            }
          }
          primroseCommitment {
            leftColumn {
              altText
              image {
                sourceUrl
              }
            }
            rightColumn {
              blurb
              heading
              button {
                target
                title
                url
              }
            }
          }
        }
        details {
          general {
            scheduleATour {
              heading
              subheading
              button {
                target
                title
                url
              }
              images {
                altText
                image {
                  sourceUrl
                }
              }
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
        const navHeight = 317;
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

    const { heroWithImage } = data.school.schoolSettings.classrooms;

    const selectedClassrooms = data?.school?.schoolSettings?.classrooms?.classroomSelection?.selectClassrooms || [];
    const isClassroomSelected = (classroomType) => {
        return selectedClassrooms.includes(classroomType);
    };

    const { summerAdventureClub, beforeAndAfterSchoolCare } = data?.school?.schoolSettings?.classrooms?.additionalOfferings || {};
    const hasOfferings = !!summerAdventureClub || !!beforeAndAfterSchoolCare;
    const hasMultipleOfferings = !!summerAdventureClub && !!beforeAndAfterSchoolCare;

    const primroseCommitment = data?.school?.schoolSettings?.classrooms?.primroseCommitment || {};
    const hasPrimroseCommitment = !!primroseCommitment;

    const ScheduleATour = data?.school?.schoolSettings?.details?.general?.scheduleATour || {};
    const hasScheduleATour = !!ScheduleATour.heading || !!ScheduleATour.subheading || !!ScheduleATour.button || (ScheduleATour.images && ScheduleATour.images.length > 0);

    return (
        <>
            <div className="classrooms">
                <div className="container">
                    <div className="hero-with-image-module">
                        <div className='hero-with-image reverse-column'>
                            {heroWithImage?.leftColumn?.image?.sourceUrl && (
                                <div className='left-column col-12 col-lg-6'>
                                    <Image
                                        src={heroWithImage.leftColumn.image.sourceUrl}
                                        alt="Hero Image"
                                        layout="fill"
                                        objectFit="cover"
                                        priority
                                    />
                                </div>
                            )}
                            {heroWithImage?.rightColumn && (
                                <div className='right-column col-12 col-lg-6'>
                                    {heroWithImage?.rightColumn?.icon?.sourceUrl && (
                                        <div className='icon d-none d-lg-block'>
                                            <Image
                                                src={heroWithImage.rightColumn.icon.sourceUrl}
                                                alt="Hero Image"
                                                layout="fill"
                                                objectFit="cover"
                                                priority
                                            />
                                        </div>
                                    )}
                                    {heroWithImage.rightColumn.eyebrow && <Heading level='h5'>{heroWithImage.rightColumn.eyebrow}</Heading>}
                                    {heroWithImage.rightColumn.heading && <Heading level='h2'>{heroWithImage.rightColumn.heading}</Heading>}
                                    {heroWithImage.rightColumn.subheading && <Subheading level='h5'>{heroWithImage.rightColumn.subheading}</Subheading>}
                                    {heroWithImage.rightColumn.blurb && <Paragraph className='b2'>{heroWithImage.rightColumn.blurb}</Paragraph>}
                                    {heroWithImage.rightColumn.button?.url && heroWithImage.rightColumn.button.title && (
                                        <Button
                                            variant='primary'
                                            href={heroWithImage.rightColumn.button.url}
                                            target={heroWithImage.rightColumn.button.target || '_self'}
                                        >
                                            {heroWithImage.rightColumn.button.title}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="general-horizontal-tabs-module">
                        <h2 className="heading">Classrooms Offered</h2>
                        <div className="general-horizontal-tabs">
                            <div className="inner">
                                {isClassroomSelected('Infant') && (
                                    <div>
                                        <button data-target="infant" className={`clickable ${activeTab === 'infant' ? 'expanded' : ''}`} onClick={() => handleTabClick('infant')}>
                                            <Heading level='h5'>Infant
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'infant' ? 'active' : ''}`} style={{ opacity: activeTab === 'infant' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/1.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Infant Classroom</Heading>
                                                    <Subheading level='div' className='b3'>At this age, your infant is mainly learning through observation and exploration. For example, as our Infant teachers talk and sing with your child during feeding, diaper changes and playtime, your little one is beginning to understand language and conversation. Nurturing interactions like these will fill your child's day and can be adapted and personalized to meet their individual needs.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Toddler') && (
                                    <div>
                                        <button data-target="toddler" className={`clickable ${activeTab === 'toddler' ? 'expanded' : ''}`} onClick={() => handleTabClick('toddler')}>
                                            <Heading level='h5'>Toddler
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'toddler' ? 'active' : ''}`} style={{ opacity: activeTab === 'toddler' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/2.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Toddler Classroom</Heading>
                                                    <Subheading level='div' className='b3'>In our Toddler program, you'll find carefully selected equipment that our newest walkers love to climb on, crawl through and hide in while stretching their gross motor skills. Teachers also use books, toys, games and other materials to create exciting explorations into colors, shapes, science and more.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Early Preschool') && (
                                    <div>
                                        <button data-target="early-preschool" className={`clickable ${activeTab === 'early-preschool' ? 'expanded' : ''}`} onClick={() => handleTabClick('early-preschool')}>
                                            <Heading level='h5'>Early Preschool
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'early-preschool' ? 'active' : ''}`} style={{ opacity: activeTab === 'early-preschool' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/3.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Early Preschool Classroom</Heading>
                                                    <Subheading level='div' className='b3'>Our Early Preschool teachers partner with you to help your child learn important independent life skills like potty training and hand washing while paying close attention to all aspects of your child's development.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Preschool') && (
                                    <div>
                                        <button data-target="preschool" className={`clickable ${activeTab === 'preschool' ? 'expanded' : ''}`} onClick={() => handleTabClick('preschool')}>
                                            <Heading level='h5'>Preschool
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'preschool' ? 'active' : ''}`} style={{ opacity: activeTab === 'preschool' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/4.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Preschool Classroom</Heading>
                                                    <Subheading level='div' className='b3'>Your preschooler is beginning to connect letters, sounds and numbers, expanding their world through reading and math. They’re building critical-thinking skills, early physical fitness and an understanding of nutrition. Our teachers support that learning and encourage your child to think in new and different ways.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Pre-Kindergarten') && (
                                    <div>
                                        <button data-target="pre-kindergarten" className={`clickable ${activeTab === 'pre-kindergarten' ? 'expanded' : ''}`} onClick={() => handleTabClick('pre-kindergarten')}>
                                            <Heading level='h5'>Pre-Kindergarten
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'pre-kindergarten' ? 'active' : ''}`} style={{ opacity: activeTab === 'pre-kindergarten' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/5.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Pre-Kindergarten Classroom</Heading>
                                                    <Subheading level='div' className='b3'>In our Pre-Kindergarten program, your child begins to develop emergent reading, writing, science, technology, engineering and math skills within large-group, small-group and independent settings.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Kindergarten') && (
                                    <div>
                                        <button data-target="kindergarten" className={`clickable ${activeTab === 'kindergarten' ? 'expanded' : ''}`} onClick={() => handleTabClick('kindergarten')}>
                                            <Heading level='h5'>Kindergarten
                                                <div id="button">
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </Heading>
                                        </button>

                                        {/* Mobile: Content rendered right below the label */}
                                        <div className="d-lg-none">
                                            <div className={`tab-content ${activeTab === 'kindergarten' ? 'active' : ''}`} style={{ opacity: activeTab === 'kindergarten' ? '1' : '0' }}>

                                                <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/6.mov" />

                                                <div className='content-wrapper'>
                                                    <Heading level='h3'>Our Kindergarten Classroom</Heading>
                                                    <Subheading level='div' className='b3'>Our teachers use engaging programs and activities that promote social, emotional, physical, cognitive, creative and character development so your child is prepared to take on elementary school and beyond.</Subheading>
                                                    <Button variant="primary" href="#">Learn More</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Desktop: Content rendered outside the loop in a designated area */}
                            <div className='desktop-content d-none d-lg-block'>
                                {isClassroomSelected('Infant') && (
                                    <div id="infant" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/1.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Infant Classroom</Heading>
                                            <Subheading level='div' className='b3'>At this age, your infant is mainly learning through observation and exploration. For example, as our Infant teachers talk and sing with your child during feeding, diaper changes and playtime, your little one is beginning to understand language and conversation. Nurturing interactions like these will fill your child's day and can be adapted and personalized to meet their individual needs.</Subheading>
                                            <Button href="#">Learn More</Button>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Toddler') && (
                                    <div id="toddler" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/2.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Toddler Classroom</Heading>
                                            <Subheading level='div' className='b3'>In our Toddler program, you'll find carefully selected equipment that our newest walkers love to climb on, crawl through and hide in while stretching their gross motor skills. Teachers also use books, toys, games and other materials to create exciting explorations into colors, shapes, science and more.</Subheading>
                                            <Button variant="primary" href="#">Learn More</Button>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Early Preschool') && (
                                    <div id="early-preschool" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/3.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Early Preschool Classroom</Heading>
                                            <Subheading level='div' className='b3'>Our Early Preschool teachers partner with you to help your child learn important independent life skills like potty training and hand washing while paying close attention to all aspects of your child's development.</Subheading>
                                            <Button variant="primary" href="#">Learn More</Button>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Preschool') && (
                                    <div id="preschool" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/4.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Preschool Classroom</Heading>
                                            <Subheading level='div' className='b3'>Your preschooler is beginning to connect letters, sounds and numbers, expanding their world through reading and math. They’re building critical-thinking skills, early physical fitness and an understanding of nutrition. Our teachers support that learning and encourage your child to think in new and different ways.</Subheading>
                                            <Button variant="primary" href="#">Learn More</Button>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Pre-Kindergarten') && (
                                    <div id="pre-kindergarten" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/5.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Pre-Kindergarten Classroom</Heading>
                                            <Subheading level='div' className='b3'>In our Pre-Kindergarten program, your child begins to develop emergent reading, writing, science, technology, engineering and math skills within large-group, small-group and independent settings.</Subheading>
                                            <Button variant="primary" href="#">Learn More</Button>
                                        </div>
                                    </div>
                                )}
                                {isClassroomSelected('Kindergarten') && (
                                    <div id="kindergarten" className="tab-content d-flex">

                                        <CustomVideoComponent src="http://primroseschdev.wpengine.com/wp-content/uploads/2023/10/6.mov" />

                                        <div className='content-wrapper'>
                                            <Heading level='h3'>Our Kindergarten Classroom</Heading>
                                            <Subheading level='div' className='b3'>Our teachers use engaging programs and activities that promote social, emotional, physical, cognitive, creative and character development so your child is prepared to take on elementary school and beyond.</Subheading>
                                            <Button variant="primary" href="#">Learn More</Button>
                                        </div>
                                    </div>
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
                                    <Image
                                        src={beforeAndAfterSchoolCare.leftColumn.image.sourceUrl}
                                        alt={beforeAndAfterSchoolCare.leftColumn.altText || 'feature image'}
                                        width={500}
                                        height={500}
                                    />
                                </div>
                                <div className='right-column col-12 c col-lg-4 offset-lg-1'>
                                    <div className="b4 bold">{beforeAndAfterSchoolCare.rightColumn.heading}</div>
                                    <div className='blurb' dangerouslySetInnerHTML={{ __html: beforeAndAfterSchoolCare.rightColumn.blurb }} />
                                    <Button href={beforeAndAfterSchoolCare.rightColumn.button.url} target={beforeAndAfterSchoolCare.rightColumn.button.target} label={beforeAndAfterSchoolCare.rightColumn.button.title}>
                                        {beforeAndAfterSchoolCare.rightColumn.button.title}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* Render Summer Adventure Club */}
                        {summerAdventureClub && (
                            <div className='two-columns-image-and-text-alternative reverse-column'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    <Image
                                        src={summerAdventureClub.rightColumn.image.sourceUrl}
                                        alt={summerAdventureClub.rightColumn.altText || 'feature image'}
                                        width={500}
                                        height={500}
                                    />
                                </div>
                                <div className='right-column col-12 c col-lg-4 offset-lg-1'>
                                    <div className="b4">{summerAdventureClub.leftColumn.heading}</div>
                                    <div className='blurb' dangerouslySetInnerHTML={{ __html: summerAdventureClub.leftColumn.blurb }} />
                                    <Button href={summerAdventureClub.leftColumn.button.url} target={summerAdventureClub.leftColumn.button.target} label={summerAdventureClub.leftColumn.button.title}>
                                        {summerAdventureClub.leftColumn.button.title}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {hasPrimroseCommitment && (
                    <div className="primrose-commitment">
                        <div className="container">
                            <div className='two-columns-image-and-text-alternative'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    <Image
                                        src={primroseCommitment.leftColumn.image.sourceUrl}
                                        alt={primroseCommitment.leftColumn.altText || 'feature image'}
                                        width={500}
                                        height={500}
                                    />
                                </div>
                                <div className='right-column col-12 col-lg-4 offset-lg-1'>
                                    <Heading level='h2'>{primroseCommitment.rightColumn.heading}</Heading>
                                    <div className='blurb' dangerouslySetInnerHTML={{ __html: primroseCommitment.rightColumn.blurb }} />
                                    <Button href={primroseCommitment.rightColumn.button.url} target={primroseCommitment.rightColumn.button.target} label={primroseCommitment.rightColumn.button.title}>
                                        {primroseCommitment.rightColumn.button.title}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {hasScheduleATour && (
                    <div className='container'>
                        <div className='find-a-school'>
                            <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                                {ScheduleATour.heading && <Heading level='h2'>{ScheduleATour.heading}</Heading>}
                                {ScheduleATour.subheading && <Subheading level='div' className='b3'>{ScheduleATour.subheading}</Subheading>}
                                {ScheduleATour.button?.url && ScheduleATour.button.title && (
                                    <Button variant='secondary' href={ScheduleATour.button.url} target={ScheduleATour.button.target || '_self'}>
                                        {ScheduleATour.button.title}
                                    </Button>
                                )}
                            </div>
                            <div className='right-column col-4 col-lg-5 col-xxl-6'>
                                {ScheduleATour.images && ScheduleATour.images.length > 0 && (
                                    <>
                                        <div className="image-scroller first" ref={leftScrollerRef}>
                                            {ScheduleATour.images.map((imgObj, idx) => (
                                                imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                            ))}
                                            {ScheduleATour.images.map((imgObj, idx) => (
                                                imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                            ))}
                                        </div>
                                        <div className="image-scroller second" ref={rightScrollerRef}>
                                            {ScheduleATour.images.map((imgObj, idx) => (
                                                imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                                            ))}
                                            {ScheduleATour.images.map((imgObj, idx) => (
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
