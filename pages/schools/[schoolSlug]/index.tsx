import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Heading from '../../../app/components/atoms/Heading/Heading';
import Subheading from '../../../app/components/atoms/Subheading/Subheading';
import Button from '../../../app/components/atoms/Button/Button';
import SelectDropdown from '../../../app/components/molecules/SelectDropdown/SelectDropdown';
import NewsSlider from '../../../app/components/modules/NewsSlider/NewsSlider';
import QuoteTestimonials from '../../../app/components/modules/QuoteTestimonials/QuoteTestimonials';
import GallerySlider from '../../../app/components/modules/GallerySlider/GallerySlider';


export async function getServerSideProps(context) {
    const { schoolSlug } = context.params;

    const GET_SCHOOLS = gql`
    query GetSchoolDetails($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          schoolSettings {
            details {
              corporate {
                schoolName
                address {
                  streetAddress
                  streetAddress2
                  city
                  state
                  zipcode
                }
                emailAddress
                phoneNumber
                latitude
                longitude
                schoolOpening
              }
              general {
                facebook {
                  target
                  title
                  url
                }
                instagram {
                  target
                  title
                  url
                }
                schoolHours
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
            classrooms {
              classroomSelection {
                selectClassrooms
              }
            }
            homepage {
              gallery {
                title
                caption
                image {
                  altText
                  sourceUrl
                }
                altText
              }
              heroWithSlider {
                leftColumn {
                  images {
                    image {
                      sourceUrl
                    }
                    altText
                  }
                }
                rightColumn {
                  accreditations {
                    image {
                      sourceUrl
                    }
                    altText
                  }
                }
              }
              firstFive {
                heading
                subheading
                classrooms {
                  leftColumn {
                    altText
                    image {
                      sourceUrl
                    }
                  }
                  rightColumn {
                    heading
                    blurb
                    button {
                      target
                      title
                      url
                    }
                  }
                }
                staff {
                  leftColumn {
                    heading
                    blurb
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
              }
              news {
                heading
                newsItems {
                  ... on Resource {
                    id
                    title
                    uri
                    excerpt
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                  }
                }
              }
              testimonials {
                facebook {
                  target
                  title
                  url
                }
                google {
                  target
                  title
                  url
                }
                heading
                yelp {
                  target
                  title
                  url
                }
                testimonials {
                  ... on Testimonial {
                    id
                    testimonials {
                      name
                      title
                      heading
                      testimonial
                    }
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
          }
          schoolCorporateSettings {
              accreditations {
                ... on Accreditation {
                  id
                  title
                  accreditations {
                    image {
                      altText
                      mediaItemUrl
                    }
                  }
                }
              }
              address {
                streetAddress
                streetAddress2
                zipcode
                state
                city
                googlePlaceUrl
                latitude
                longitude
              }
              emailAddress
              phoneNumber
              preopening
              schoolName
              virtualTourUrl
              homepageHeroImage {
                altText
                mediaItemUrl
              }
              openingIn {
                season
                year
              }
              homepageSubheadline {
                description
                title
              }
              corporateChildcare
              careerplugSchoolId
            }
            schoolAdminSettings {
              accreditation {
                imageAlt
                image {
                  mediaItemUrl
                }
              }
              classroomsOffered
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
    try {
        const response = await client.query({
            query: GET_SCHOOLS,
            variables: { id: `/schools/${schoolSlug}/` },
        });

        console.log("School Data:", response.data.school);

        const school = response?.data?.school;
        if (!school) {
            return { notFound: true };
        }

        return {
            props: {
                school,
                schoolSlug,
            },
        };
    } catch (error) {
        console.error('getServerSideProps Error:', error);
        return { props: { hasError: true } };
    }
}

export default function SchoolMainPage({ school, schoolSlug }) {
    const { schoolSettings } = school;
    const corporateSettings = school.schoolCorporateSettings;
    const adminSettings = school.schoolAdminSettings;
    const {schoolAdminSettings} = school;
    const newsItems = school.schoolSettings.homepage.news.newsItems;
    const [isClient, setIsClient] = useState(false);
    const { testimonials } = school.schoolSettings.homepage;
    console.log(corporateSettings);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const renderHeroWithSlider = () => {
        const { heroWithSlider } = schoolSettings.homepage;
        const { corporate, general } = schoolSettings.details;
        const { accreditations } = schoolSettings.homepage.heroWithSlider.rightColumn;
        const { classrooms } = schoolSettings.details;
        const classroomsData = schoolAdminSettings?.classroomsOffered;
        let schoolHoursFormatted = "M-F " + schoolAdminSettings.hoursOfOperation.openingTime + " - " + schoolAdminSettings.hoursOfOperation.closingTime;
        const { facebook, instagram } = schoolSettings.details.general;
        

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };

        return (
            <div className='hero-with-slider-module'>
                <div className='hero-with-slider'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col left-col col-12 col-lg-6'>
                                <div>
                                    {corporateSettings.homepageHeroImage  && (
                                        <Slider {...settings}>
                                            {corporateSettings.homepageHeroImage.map((image, index) => (
                                                <div className='image-wrapper d-block' key={index}>
                                                    <img src={image.mediaItemUrl} alt={image.altText || 'Hero Image'} />
                                                </div>
                                            ))}
                                        </Slider>
                                    )}
                                </div>
                            </div>
                            <div className='col right-col col-12 col-lg-6'>
                                <div className='d-lg-flex'>
                                    <div className='info-wrapper'>
                                        <h5 className='green'>The Leader in Early Education and Care®️</h5>
                                        <div className='classrooms'>
                                            <h5 className='mt-4 green'>Children Served</h5>
                                            <ul>
                                                {classroomsData
                                                    .filter(classroom => classroom !== "Summer Adventure Club" && classroom !== "Before & After Care")
                                                    .map((classroom, index) => {
                                                        const classroomSlug = classroom.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-');
                                                        const classroomUrl = `${[schoolSlug]}/classrooms/${classroomSlug}`;

                                                        return (
                                                            <li key={`classroom-${index}`}>
                                                                <Link href={classroomUrl}>
                                                                    <span className='b3'>{classroom}</span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div className='hours'><h5 className='green'>Hours & Location</h5><span className='b3'>M-F {adminSettings.hoursOfOperation.openingTime}-{adminSettings.hoursOfOperation.closingTime}</span></div>
                                        <div className='phone'><span className='b3'><a href={`tel:${corporateSettings.phoneNumber}`}>{corporateSettings.phoneNumber}</a></span></div>
                                        <div className='address'>
                                            <span className='icon me-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 15 18" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.91631 2.78948C0.36123 5.37616 0.36123 9.57634 2.91631 12.1628L7.54545 16.8496L12.1746 12.1628C14.7297 9.57634 14.7297 5.37616 12.1746 2.78948C9.61986 0.202986 5.47105 0.202986 2.91631 2.78948ZM7.63273 10.2719C9.17498 10.2719 10.4254 8.99835 10.4254 7.4274C10.4254 5.85646 9.17498 4.58295 7.63273 4.58295C6.09047 4.58295 4.84004 5.85646 4.84004 7.4274C4.84004 8.99835 6.09047 10.2719 7.63273 10.2719Z" stroke="#555F68" strokeWidth="1.5" />
                                                </svg>
                                            </span>
                                            <span className='b3'>{corporateSettings.address.streetAddress} {corporateSettings.address.streetAddress2}, {corporateSettings.address.city}, {corporateSettings.address.state} {corporateSettings.address.zipcode}</span>
                                        </div>
                                        
                                    </div>
                                    {corporateSettings.accreditations && (
                                        <div className='accreditations'>
                                            <h5 className='mt-3 green'>Accreditation</h5>
                                            <div className="accreditation-images  d-flex">
                                                {corporateSettings.accreditations.map((accreditation, index) => (
                                                    <div key={`accreditation-${index}`} className="accreditation-image">
                                                        <img className='me-2 me-lg-0 mb-lg-2' width='60' height='60' src={accreditation.accreditations.image.mediaItemUrl} alt={accreditation.title || 'Accreditation Image'} />
                                                    </div>
                                                ))}
                                                {adminSettings.accreditation.image && (
                                                    <div className="accreditation-image">
                                                        <img className='me-2 me-lg-0 mb-lg-2' width='60' height='60' src={adminSettings.accreditation.image.mediaItemUrl} alt={adminSettings.accreditation.imageAlt} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='social-links d-flex justify-content-center align-center border-top border-bottom mt-3 mb-3 mb-lg-0 pt-2 pb-2'>
                                    {adminSettings.facebookLink && (
                                        <a href={adminSettings.facebookLink} target="_blank" title="Facebook" rel="noopener noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                                <path d="M45 30.0919C45 21.7567 38.2846 15 30.0019 15C21.7154 15.0019 15 21.7567 15 30.0937C15 37.6247 20.4856 43.8676 27.6547 45V34.4544H23.8489V30.0937H27.6584V26.766C27.6584 22.9846 29.8988 20.8961 33.324 20.8961C34.9663 20.8961 36.6817 21.1905 36.6817 21.1905V24.9025H34.79C32.9284 24.9025 32.3472 26.0667 32.3472 27.261V30.0919H36.5054L35.8418 34.4526H32.3453V44.9981C39.5144 43.8658 45 37.6228 45 30.0919Z" fill="black" />
                                            </svg>
                                        </a>
                                    )}
                                    {adminSettings.instagramLink && (
                                        <a href={adminSettings.instagramLink} target="_blank" title="Instagram" rel="noopener noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M36.7368 15H23.2848C18.7166 15 15 18.714 15 23.2789V36.7211C15 41.2862 18.7166 45 23.2848 45H36.7368C41.3054 45 45.0219 41.286 45.0219 36.7211V23.2789C45.0221 18.714 41.3054 15 36.7368 15ZM42.3584 36.7211C42.3584 39.8185 39.8366 42.3383 36.737 42.3383H23.2848C20.1853 42.3384 17.6637 39.8185 17.6637 36.7211V23.2789C17.6637 20.1817 20.1853 17.6617 23.2848 17.6617H36.7368C39.8364 17.6617 42.3583 20.1817 42.3583 23.2789V36.7211H42.3584ZM30.0141 22.2703C25.7484 22.2703 22.2782 25.7381 22.2782 30.0006C22.2782 34.2629 25.7484 37.7305 30.0141 37.7305C34.2797 37.7305 37.75 34.2629 37.75 30.0006C37.75 25.7381 34.2797 22.2703 30.0141 22.2703ZM30.0141 35.0685C27.2174 35.0685 24.9419 32.795 24.9419 30.0004C24.9419 27.2056 27.2172 24.9319 30.0141 24.9319C32.811 24.9319 35.0863 27.2056 35.0863 30.0004C35.0863 32.795 32.8108 35.0685 30.0141 35.0685ZM36.6956 20.5853C37.058 20.2216 37.5622 20.014 38.0754 20.014C38.5904 20.014 39.0947 20.2216 39.4569 20.5853C39.821 20.9473 40.0288 21.4513 40.0288 21.9659C40.0288 22.4787 39.821 22.9827 39.4569 23.3465C39.0929 23.7085 38.5904 23.9178 38.0754 23.9178C37.5622 23.9178 37.0578 23.7085 36.6956 23.3465C36.3315 22.9827 36.122 22.4789 36.122 21.9659C36.122 21.4513 36.3314 20.9473 36.6956 20.5853Z" fill="black" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const findASchool = () => {
        const ScheduleATour = adminSettings.satImages || {};
        const hasScheduleATour = ScheduleATour.length > 0;
        const leftScrollerRef = useRef<HTMLDivElement>(null);
        const rightScrollerRef = useRef<HTMLDivElement>(null);
        const [allImagesLoaded, setAllImagesLoaded] = useState(false);

        const scrollContent = () => {
            const leftScroller = leftScrollerRef.current;
            const rightScroller = rightScrollerRef.current;

            if (leftScroller) {
                leftScroller.scrollTop += .9;
                if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
                    leftScroller.scrollTop = 0;
                }
            }

            if (rightScroller) {
                rightScroller.scrollTop -= .9;
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
        if (!hasScheduleATour) return null;
        return (

            <div className='container'>
                <div className='find-a-school'>
                    <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                         <Heading level='h2'>Our family would love to meet yours.</Heading>
                        <Subheading level='div' className='b3'>Contact us to schedule a tour.</Subheading>
                      
                            <Button variant="secondary" href={"/" + school.slug + "/schedule-a-tour"}>
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
        )
    }
    const firstFive = () => {
        const firstFiveData = school.schoolSettings.homepage.firstFive;
        const staffData = school.schoolSettings.homepage.firstFive.staff;
        const classroomsData = schoolAdminSettings?.classroomsOffered;
        const dropdownOptions = classroomsData.map(classroom => ({
            label: classroom,
            value: classroom.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')
        }));
        return (
            <div className='first-five-module'>
                <div className='first-five'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 heading-wrapper pb-lg-5'>
                                <h2 className='h1'>{corporateSettings.homepageSubheadline.title}</h2>
                                <div className='b3'>{corporateSettings.homepageSubheadline.description.replace('[CITY]', corporateSettings.address.city)}</div>
                            </div>
                            <div className='classrooms'>
                                <div className='two-columns-image-and-text-alternative'>
                                    <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                        <img
                                            src='https://primroseschstg.wpenginepowered.com/wp-content/uploads/2023/08/stock.png'
                                            alt='child in daycare classroom'
                                            width={500}
                                            height={500}
                                        />
                                    </div>
                                    <div className='right-column col-12 col-lg-5 offset-lg-1'>
                                        <h2 className="">Our Classrooms & Programs</h2>
                                        <div className='blurb' >
                                            Our time-tested approach to early childhood education is designed to foster good character and grow social and emotional skills while also building literacy, and math skills.
                                        </div>

                                        <div className='d-lg-flex align-center'>
                                            <div className='me-2 mb-2 mb-lg-0'>
                                                <Button href={schoolSlug + "/classrooms"}>
                                                    Explore Education & Care
                                                </Button>
                                            </div>
                                            <SelectDropdown options={dropdownOptions} placeholder="Explore Classrooms" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='staff'>
                                <div className='two-columns-image-and-text-alternative reverse-column'>
                                    <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                        <img
                                            src={adminSettings.meetStaffImage.mediaItemUrl}
                                            alt="staff image"
                                            width={500}
                                            height={500}
                                        />
                                    </div>
                                    <div className='right-column col-12 col-lg-5 offset-lg-1'>
                                        <h2 className="">Meet Our Teachers & Staff</h2>
                                        <div className='blurb' >
                                        When children feel safe, loved and confident, they can learn and grow to their fullest potential. That’s why Primrose school teachers and staff are dedicated to creating an environment that helps lay the foundation for a lifelong love of learning.

                                        </div>
                                        <Button href={schoolSlug + "/staff"} >
                                            Learn More
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const renderNewsSlider = () => {
        if (!isClient) return null;

        const newsHeading = "See What's Happening in Our School";
        const newsItems = adminSettings.newsItems;

        if (!newsItems || newsItems.length === 0) {
            return null;
        }
        return (
            <div className='news-slider-module'>
                <div className='container'>
                    <h2 className='heading'>{newsHeading || 'Default News Heading'}</h2>
                    <NewsSlider newsItems={newsItems} />
                </div>
            </div>
        );
    };
    const testimonialSection = () => {
        console.log(adminSettings.testimonials);
        const transformedTestimonials = adminSettings.testimonials.map(testimonial => ({
            avatar: {
                sourceUrl: testimonial.featuredImage?.node?.sourceUrl,
                altText: 'Testimonial'
            },
            name: testimonial.testimonials.name,
            position: testimonial.testimonials.title,
            content: {
                heading: testimonial.testimonials.heading,
                blurb: testimonial.testimonials.testimonial
            }
        }));
        const heading = testimonials.heading || 'Default Heading';

        return (
            <>
                <QuoteTestimonials
                    tabs={transformedTestimonials}
                    heading={heading} customizations={{
                        topPaddingMobile: '',
                        topPaddingDesktop: '',
                        bottomPaddingMobile: '',
                        bottomPaddingDesktop: '',
                        backgroundColor: ''
                    }} headingColor={''} />
                <div className='container'>
                    <div className='reviews d-flex align-items-center justify-content-center justify-content-lg-end'>
                        <h5 className='green mb-0'>See more Reviews:</h5>
                        {adminSettings.facebookLink && (
                            <a href={adminSettings.facebookLink} target="_blank" rel="noopener noreferrer" className='fb'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                                    <path d="M30.5 20.7605C30.5 15.2037 26.0231 10.6992 20.5013 10.6992C14.9769 10.7005 10.5 15.2037 10.5 20.7617C10.5 25.7823 14.157 29.9443 18.9364 30.6992V23.6688H16.3993V20.7617H18.9389V18.5432C18.9389 16.0223 20.4325 14.63 22.716 14.63C23.8108 14.63 24.9544 14.8262 24.9544 14.8262V17.3009H23.6934C22.4523 17.3009 22.0648 18.077 22.0648 18.8732V20.7605H24.837L24.3945 23.6676H22.0636V30.698C26.843 29.9431 30.5 25.7811 30.5 20.7605Z" fill="black" />
                                </svg>
                            </a>
                        )}
                        {adminSettings.googleLink && (
                            <a href={adminSettings.googleLink} target="_blank" rel="noopener noreferrer" className='google'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                                    <path d="M30.0049 19.1581L29.904 18.73H20.5987V22.6684H26.1585C25.5812 25.4095 22.9027 26.8523 20.7147 26.8523C19.1228 26.8523 17.4446 26.1827 16.3339 25.1064C15.7479 24.5294 15.2815 23.8425 14.9612 23.0851C14.641 22.3276 14.4734 21.5144 14.4679 20.6921C14.4679 19.0331 15.2134 17.3738 16.2982 16.2823C17.383 15.1907 19.0214 14.58 20.6504 14.58C22.5161 14.58 23.8531 15.5706 24.3531 16.0224L27.1518 13.2385C26.3308 12.5171 24.0754 10.6992 20.5603 10.6992C17.8482 10.6992 15.2478 11.7381 13.3469 13.6327C11.471 15.4983 10.5 18.1961 10.5 20.6992C10.5 23.2023 11.4188 25.7653 13.2366 27.6456C15.179 29.651 17.9299 30.6992 20.7625 30.6992C23.3397 30.6992 25.7826 29.6894 27.5237 27.8573C29.2353 26.0537 30.1205 23.5581 30.1205 20.9421C30.1205 19.8407 30.0098 19.1867 30.0049 19.1581Z" fill="black" />
                                </svg>
                            </a>
                        )}
                        {adminSettings.yelpLink && (
                            <a href={adminSettings.yelpLink} target="_blank" rel="noopener noreferrer" className='yelp'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                                    <path d="M17.7341 23.318L18.6541 23.1055C18.6849 23.0986 18.7154 23.0903 18.7454 23.0805C18.9036 23.0381 19.0492 22.9581 19.1698 22.8472C19.2904 22.7364 19.3825 22.5981 19.4381 22.444C19.4937 22.2899 19.5112 22.1247 19.4892 21.9624C19.4672 21.8001 19.4063 21.6455 19.3116 21.5118C19.2088 21.3809 19.0814 21.2714 18.9366 21.1893C18.7656 21.0918 18.5866 21.009 18.4016 20.9418L17.3916 20.573C16.8252 20.3622 16.2569 20.1567 15.6866 19.9568C15.3153 19.8242 14.9991 19.7092 14.7278 19.6242C14.6766 19.608 14.6191 19.593 14.5728 19.5767C14.3286 19.4921 14.0735 19.4433 13.8153 19.4317C13.6808 19.4263 13.5469 19.451 13.4232 19.504C13.2995 19.557 13.1892 19.6369 13.1003 19.738C13.0537 19.7907 13.0099 19.8458 12.969 19.903C12.8903 20.0241 12.8253 20.1537 12.7753 20.2893C12.5878 20.843 12.494 21.4243 12.5003 22.0093C12.5028 22.538 12.5165 23.2168 12.8078 23.6768C12.8775 23.7949 12.9712 23.8971 13.0828 23.9768C13.2903 24.1193 13.4991 24.1381 13.7166 24.1531C14.0416 24.1768 14.3578 24.0968 14.6716 24.0243L17.7304 23.3168L17.7341 23.318ZM28.008 18.4292C27.7566 17.9017 27.4186 17.42 27.008 17.0042C26.9032 16.9046 26.788 16.8165 26.6642 16.7417C26.6034 16.708 26.5408 16.6776 26.4767 16.6505C26.3526 16.5988 26.2185 16.5754 26.0842 16.5821C25.9499 16.5888 25.8188 16.6254 25.7005 16.6892C25.523 16.7767 25.333 16.9167 25.0805 17.1517C25.0455 17.1867 25.0017 17.2267 24.963 17.263C24.7542 17.458 24.5217 17.7005 24.2454 17.9817C23.8204 18.413 23.3992 18.8455 22.9829 19.2842L22.2354 20.0593C22.0986 20.2006 21.974 20.3532 21.8629 20.5155C21.7678 20.6526 21.7011 20.8073 21.6667 20.9705C21.6461 21.0954 21.6491 21.223 21.6754 21.3468C21.6754 21.353 21.6779 21.358 21.6792 21.363C21.7379 21.6194 21.8939 21.843 22.1143 21.9866C22.3346 22.1303 22.6021 22.1828 22.8604 22.133C22.8915 22.1287 22.9224 22.1229 22.9529 22.1155L26.9342 21.1955C27.248 21.123 27.5667 21.0555 27.8492 20.893C28.038 20.783 28.218 20.6743 28.3417 20.4555C28.4074 20.3347 28.447 20.2014 28.458 20.0643C28.5205 19.5217 28.2355 18.9055 28.008 18.4292ZM20.8817 20.103C21.1692 19.7405 21.1692 19.2005 21.1942 18.7592C21.2817 17.283 21.3729 15.8067 21.4454 14.3304C21.4729 13.7704 21.5329 13.2179 21.5004 12.6554C21.4729 12.1904 21.4692 11.6566 21.1754 11.2754C20.6592 10.6029 19.5541 10.6579 18.7991 10.7616C18.5679 10.7929 18.3366 10.8366 18.1079 10.8916C17.8794 10.9453 17.653 11.0074 17.4291 11.0779C16.7041 11.3154 15.6878 11.7491 15.5166 12.5829C15.4191 13.0542 15.6491 13.5367 15.8278 13.9667C16.0441 14.4879 16.3403 14.9567 16.6091 15.4479C17.3216 16.743 18.0466 18.0305 18.7691 19.3192C18.9841 19.7042 19.2191 20.1905 19.6379 20.3905C19.6654 20.403 19.6941 20.413 19.7229 20.4218C19.9104 20.493 20.1141 20.5068 20.3091 20.4618L20.3441 20.453C20.5243 20.4041 20.6874 20.3064 20.8154 20.1705C20.8387 20.1488 20.8608 20.1271 20.8817 20.103ZM20.5366 24.0543C20.41 23.877 20.2246 23.7503 20.0133 23.6967C19.8021 23.6432 19.5787 23.6662 19.3829 23.7618C19.3193 23.7939 19.2586 23.8316 19.2016 23.8743C19.0389 24.0024 18.8935 24.1512 18.7691 24.3168C18.7366 24.3581 18.7066 24.4131 18.6691 24.4468L18.0291 25.3281C17.6666 25.8218 17.3079 26.3168 16.9529 26.8193C16.7216 27.1443 16.5203 27.4181 16.3628 27.6606L16.2728 27.7981C16.0828 28.0919 15.9753 28.3056 15.9203 28.4969C15.8794 28.6234 15.8666 28.7574 15.8828 28.8894C15.8991 29.0269 15.9453 29.1606 16.0178 29.2794C16.0566 29.3381 16.0978 29.3956 16.1428 29.4519C16.2384 29.5624 16.3462 29.6618 16.4641 29.7481C17.2797 30.3006 18.2265 30.6283 19.2091 30.6981C19.3553 30.703 19.5016 30.6916 19.6454 30.6644C19.7143 30.6481 19.7824 30.6281 19.8491 30.6044C19.9792 30.5553 20.0976 30.4795 20.1966 30.3819C20.2909 30.2879 20.3634 30.1744 20.4091 30.0494C20.4829 29.8656 20.5316 29.6306 20.5629 29.2831L20.5779 29.1206C20.6029 28.8319 20.6154 28.4931 20.6341 28.0944C20.6654 27.4818 20.6891 26.8693 20.7092 26.2581L20.7504 25.1706C20.7667 24.909 20.7435 24.6465 20.6817 24.3918C20.6511 24.2723 20.603 24.1583 20.5366 24.0543ZM27.7655 25.7568C27.5816 25.5705 27.3719 25.4114 27.143 25.2843L27.003 25.2006C26.7542 25.0506 26.4555 24.8931 26.1042 24.7031C25.5667 24.4081 25.0292 24.1206 24.4854 23.8343L23.5267 23.3255C23.4767 23.3105 23.4267 23.2755 23.3792 23.2518C23.1948 23.1576 22.999 23.0879 22.7967 23.0443C22.7266 23.0307 22.6555 23.0232 22.5842 23.0218C22.3666 23.0226 22.1562 23.1004 21.9904 23.2413C21.8246 23.3822 21.7139 23.5772 21.6779 23.7918C21.663 23.9138 21.6672 24.0374 21.6904 24.1581C21.7379 24.4131 21.8529 24.6656 21.9704 24.8868L22.4829 25.8468C22.7679 26.3893 23.0567 26.9268 23.3529 27.4643C23.5429 27.8144 23.7029 28.1144 23.8504 28.3631C23.8792 28.4094 23.9104 28.4594 23.9354 28.5031C24.1167 28.8019 24.2617 28.9906 24.4092 29.1244C24.5068 29.2191 24.6244 29.2909 24.7533 29.3344C24.8822 29.3778 25.0192 29.3919 25.1542 29.3756C25.2248 29.3674 25.2949 29.3553 25.3642 29.3394C25.5052 29.3008 25.6414 29.2467 25.7705 29.1781C26.1604 28.9597 26.5198 28.6907 26.8392 28.3781C27.2217 28.0031 27.5605 27.5906 27.8242 27.1206C27.8617 27.0543 27.893 26.9843 27.9192 26.9143C27.9441 26.8484 27.9653 26.7813 27.983 26.7131C27.9992 26.6431 28.0105 26.5743 28.0192 26.5031C28.0322 26.365 28.016 26.2258 27.9717 26.0943C27.9285 25.9681 27.8581 25.8529 27.7655 25.7568Z" fill="black" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </>
        )
    }
    const gallerySlider = () => {
        const galleryData = adminSettings.gallery;

        if (!galleryData || galleryData.length === 0) {
            return null;
        }

        return (
            <GallerySlider gallery={galleryData} uniqueId="gallerySlider" />
        );
    }
    return (
        <div className='school school-home'>
            {renderHeroWithSlider()}
            {firstFive()}
            {renderNewsSlider()}
            {testimonialSection()}
            {gallerySlider()} 
            {findASchool()}
        </div>
    );
}
