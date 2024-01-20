import { client } from '../../../../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Heading from '../../../../../app/components/atoms/Heading/Heading';
import Subheading from '../../../../../app/components/atoms/Subheading/Subheading';
import Button from '../../../../../app/components/atoms/Button/Button';
import QuoteTestimonials from '../../../../../app/components/modules/QuoteTestimonials/QuoteTestimonials';
import GallerySlider from '../../../../../app/components/modules/GallerySlider/GallerySlider';
import GeneralButtonCTA from '../../../../../app/components/modules/GeneralButtonCTA/GeneralButtonCTA';
import { useRouter } from 'next/router';
import HeroWithImage from '../../../../../app/components/modules/HeroWithImage/HeroWithImage';


export async function getServerSideProps(context) {

  const { schoolSlug } = context.params;

  const GET_CLASSROOM_TYPE = gql`
      query GetSchoolDetails($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          schoolSettings {
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
              corporate {
                classroomExperienceTabs {
                  infant {
                    aDayInTheLife
                    fieldGroupName
                    nutrition
                  }
                }
              }
            }
            classrooms {
              classroomSelection {
                classroomDetails {
                  infant {
                    hero {
                      heading
                      blurb
                      button {
                        target
                        title
                        url
                      }
                      image {
                        sourceUrl
                      }
                      altText
                    }
                    learningDomains {
                      selectDomains
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
                      yelp {
                        target
                        title
                        url
                      }
                      heading
                      testimonials {
                        ... on Testimonial {
                          id
                          testimonials {
                            heading
                            name
                            school {
                              ... on School {
                                id
                                slug
                                title
                                uri
                              }
                            }
                            testimonial
                            title
                          }
                          title
                          uri
                        }
                      }
                    }
                    experienceTabs {
                      heading
                      subheading
                      aDayInTheLife
                      altText1
                      altText2
                      altText3
                      healthAndSafety
                      nutrition
                      classroomGallery {
                        caption
                        title
                        image {
                          sourceUrl
                        }
                        altText
                      }
                      image1 {
                        sourceUrl
                      }
                      image2 {
                        sourceUrl
                      }
                      image3 {
                        sourceUrl
                      }
                    }
                    featuredBanner {
                      altText
                      blurb
                      heading
                      button {
                        target
                        title
                        url
                      }
                      icon {
                        sourceUrl
                      }
                    }
                  }
                }
                selectClassrooms
              }
            }
            staff {
              staffMembers {
                image {
                  sourceUrl
                }
                altText
                bio
                classroomAssignment
                name
                title
              }
            }
          }
        }
      }
    `;

  try {
    const response = await client.query({
      query: GET_CLASSROOM_TYPE,
      variables: {
        id: `/schools/${schoolSlug}/`
      },
    });

    if (!response || !response.data || !response.data.school) {
      return { notFound: true };
    }

    const school = response.data.school;
    console.log(school)
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
interface StaffMember {
  altText?: string;
  image: {
    sourceUrl: string;
  };
  name: string;
  title: string;
  bio: string;
  group: string;
}

export default function ClassroomTypePage({ school }) {

  const hasData = (data) => {
    return data && Object.keys(data).length > 0 && data.constructor === Object;
  };

  const featuredBanner = school?.schoolSettings?.classrooms?.classroomSelection?.classroomDetails?.infant?.featuredBanner || {};

  const generalButtonCTAProps = {
    icon: featuredBanner.icon,
    heading: featuredBanner.heading,
    subheading: featuredBanner.blurb,
    button: featuredBanner.button,
  };
  const shouldRenderCTA = hasData(featuredBanner) && featuredBanner.icon && featuredBanner.heading && featuredBanner.blurb && featuredBanner.button;

  const CustomVerticalTab = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const experienceTabsData = school?.schoolSettings?.classrooms?.classroomSelection?.classroomDetails?.infant?.experienceTabs || {};
    const classroomExperienceData = school?.schoolSettings?.details?.corporate?.classroomExperienceTabs?.infant || {};
    const tabHeading = experienceTabsData?.heading || 'Our Classroom Experience';
    const tabSubheading = experienceTabsData?.subheading || '';
    const galleryData = school?.schoolSettings?.classrooms?.classroomSelection?.classroomDetails?.infant?.experienceTabs?.classroomGallery || [];

    const hardcodedTabs = [
      {
        label: "A Day in the Life",
        content: {
          heading: "A Day in the Life",
          blurb: `${classroomExperienceData?.aDayInTheLife || ''}\n${experienceTabsData?.aDayInTheLife || ''}`,
        },
        image: {
          sourceUrl: experienceTabsData.image1?.sourceUrl || 'defaultImageUrl',
          altText: experienceTabsData.altText1 || 'Default Alt Text'
        }
      },
      {
        label: "Health & Safety",
        content: {
          heading: "Their Health & Safety. Our Top Priority.",
          blurb: `${classroomExperienceData?.nutrition || ''}\n${experienceTabsData?.nutrition || ''}`,
        },
        image: {
          sourceUrl: experienceTabsData.image2?.sourceUrl || 'defaultImageUrl',
          altText: experienceTabsData.altText2 || 'Default Alt Text'
        }
      },
      {
        label: "Nutrition",
        content: {
          heading: "Nutrition",
          blurb: `${classroomExperienceData?.healthAndSafety || ''}\n${experienceTabsData?.healthAndSafety || ''}`,
        },
        image: {
          sourceUrl: experienceTabsData.image3?.sourceUrl || 'defaultImageUrl',
          altText: experienceTabsData.altText3 || 'Default Alt Text'
        }
      },
      {
        label: "Classroom Gallery",
        content: {
          component: <GallerySlider gallery={galleryData} uniqueId="gallerySlider" />
        },
        // No image for Tab 4 as per the provided data structure
      },
    ];

    const [expandedTabVT, setExpandedTabVT] = useState<number | null>(0);
    const buttonRefsVT = useRef<(HTMLButtonElement | null)[]>([]);
    const contentRefsVT = useRef<(HTMLDivElement | null)[]>([]);
    const containerRefVT = useRef<HTMLDivElement | null>(null);
    const contentHeightRefVT = useRef<number | null>(null);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    const calculateHeight = (index: number) => {
      const contentElement = contentRefsVT.current[index];
      if (contentElement) {
        const height = contentElement.scrollHeight;
        console.log("Calculated Height:", height);
        contentHeightRefVT.current = height;
      }
    };
    const handleLabelClick = (index: number) => {
      if (expandedTabVT === index) {
        setExpandedTabVT(null);
        contentHeightRefVT.current = null;

        setTimeout(() => {
          window.scrollBy(0, -contentHeightRefVT.current!);
        }, 50);
      } else {
        calculateHeight(index);
        setExpandedTabVT(index);
      }
    };

    return (
      <div className='container' ref={containerRefVT}>

        <div className="general-vertical-tabs">
          <div className="heading-wrapper">
            <h2 className='h1 blue'>
              {tabHeading}
            </h2>
            <div className='b4'>
              {tabSubheading}
            </div>
          </div>
          {/* Mobile layout */}
          <div className="mobile-layout d-block d-lg-none">
            {hardcodedTabs.map((tab, index) => (
              <div key={index} className="mobile-tab">
                <button
                  ref={el => buttonRefsVT.current[index] = el}
                  onClick={() => handleLabelClick(index)}
                  className={`tab-button ${expandedTabVT === index ? 'active' : ''}`}
                >
                  <Heading level='h5'>{tab.label}</Heading>
                  <div id="button">
                    <span></span>
                    <span></span>
                  </div>
                </button>
                <div
                  ref={el => contentRefsVT.current[index] = el}
                  className={`tab-content ${expandedTabVT === index ? 'expanded' : ''} ${tab.content.component ? 'gallery' : ''}`}
                  >
                   {tab.content.component}
                  {tab.image?.sourceUrl && tab.image.sourceUrl !== 'defaultImageUrl' && (
                    <div className='image-wrapper fullwidth'>
                      <img
                        src={tab.image.sourceUrl}
                        alt={tab.image.altText || 'Default Alt Text'}
                      />
                    </div>
                  )}
                  {tab.content.heading || (isClient && tab.content.blurb) ? (
                    <div className='content'>
                      <Heading level='h3'>{tab.content.heading}</Heading>
                      {isClient && tab.content.blurb && (
                        <p className='b3' dangerouslySetInnerHTML={{ __html: tab.content.blurb }}></p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop layout */}
          <div className="desktop-layout d-lg-block d-none">
            <div className="buttons-container">
              {hardcodedTabs.map((tab, index) => (
                <button
                  key={index}
                  ref={el => buttonRefsVT.current[index] = el}
                  onClick={() => handleLabelClick(index)}
                  className={`tab-button ${expandedTabVT === index ? 'active' : ''}`}
                >
                  <Heading level='h5'>{tab.label}</Heading>
                </button>
              ))}
            </div>
            <div className="desktop-content">
              {hardcodedTabs.map((tab, index) => (
                <div
                  key={index}
                  ref={el => contentRefsVT.current[index] = el}
                  className={`tab-content ${expandedTabVT === index ? 'expanded' : ''} ${tab.content.component ? 'gallery' : ''}`}
                  >
                  <div className='gallery-wrapper'>{tab.content.component}</div>
                  {tab.image?.sourceUrl && tab.image.sourceUrl !== 'defaultImageUrl' && (
                    <div className='image-wrapper fullwidth'>
                      <img
                        src={tab.image.sourceUrl}
                        alt={tab.image.altText || 'Default Alt Text'}
                      />
                    </div>
                  )}
                  {tab.content.heading || (isClient && tab.content.blurb) ? (
                    <div className='content col-6'>
                      <Heading level='h3'>{tab.content.heading}</Heading>
                      {isClient && tab.content.blurb && (
                        <p className='b3' dangerouslySetInnerHTML={{ __html: tab.content.blurb }}></p>
                      )}
                    </div>
                  ) : null}
                 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const testimonialSection = () => {
    const testimonials = school.schoolSettings.classrooms.classroomSelection.classroomDetails.infant.testimonials;
    const transformedTestimonials = testimonials.testimonials.map(testimonial => ({
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
    const { facebook, google, yelp } = testimonials;

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
            {facebook && facebook.url && (
              <a href={facebook.url} target="_blank" rel="noopener noreferrer" className='fb'>
                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                  <path d="M30.5 20.7605C30.5 15.2037 26.0231 10.6992 20.5013 10.6992C14.9769 10.7005 10.5 15.2037 10.5 20.7617C10.5 25.7823 14.157 29.9443 18.9364 30.6992V23.6688H16.3993V20.7617H18.9389V18.5432C18.9389 16.0223 20.4325 14.63 22.716 14.63C23.8108 14.63 24.9544 14.8262 24.9544 14.8262V17.3009H23.6934C22.4523 17.3009 22.0648 18.077 22.0648 18.8732V20.7605H24.837L24.3945 23.6676H22.0636V30.698C26.843 29.9431 30.5 25.7811 30.5 20.7605Z" fill="black" />
                </svg>
              </a>
            )}
            {google && google.url && (
              <a href={google.url} target="_blank" rel="noopener noreferrer" className='google'>
                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                  <path d="M30.0049 19.1581L29.904 18.73H20.5987V22.6684H26.1585C25.5812 25.4095 22.9027 26.8523 20.7147 26.8523C19.1228 26.8523 17.4446 26.1827 16.3339 25.1064C15.7479 24.5294 15.2815 23.8425 14.9612 23.0851C14.641 22.3276 14.4734 21.5144 14.4679 20.6921C14.4679 19.0331 15.2134 17.3738 16.2982 16.2823C17.383 15.1907 19.0214 14.58 20.6504 14.58C22.5161 14.58 23.8531 15.5706 24.3531 16.0224L27.1518 13.2385C26.3308 12.5171 24.0754 10.6992 20.5603 10.6992C17.8482 10.6992 15.2478 11.7381 13.3469 13.6327C11.471 15.4983 10.5 18.1961 10.5 20.6992C10.5 23.2023 11.4188 25.7653 13.2366 27.6456C15.179 29.651 17.9299 30.6992 20.7625 30.6992C23.3397 30.6992 25.7826 29.6894 27.5237 27.8573C29.2353 26.0537 30.1205 23.5581 30.1205 20.9421C30.1205 19.8407 30.0098 19.1867 30.0049 19.1581Z" fill="black" />
                </svg>
              </a>
            )}
            {yelp && yelp.url && (
              <a href={yelp.url} target="_blank" rel="noopener noreferrer" className='yelp'>
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

  const findASchool = () => {
    const ScheduleATour = school?.schoolSettings?.details?.general?.scheduleATour || {};
    const hasScheduleATour = !!ScheduleATour.heading || !!ScheduleATour.subheading || !!ScheduleATour.button || (ScheduleATour.images && ScheduleATour.images.length > 0);
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
    if (!hasScheduleATour) return null;
    return (

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
    )
  }

  const StaffMembers = () => {
    const [visibleStaffCount, setVisibleStaffCount] = useState(20);
    const [activeBio, setActiveBio] = useState(null);
    const [bioHeights, setBioHeights] = useState({});
    const router = useRouter();
    const { classroomType } = router.query;
    const staffMembersData = school?.schoolSettings?.staff?.staffMembers || [];
    const currentClassroomType = classroomType?.toString().toLowerCase();
    const assignedStaffMembers = staffMembersData.filter(member =>
      member.classroomAssignment?.toLowerCase() === currentClassroomType
    );
    const canLoadMore = assignedStaffMembers.length > visibleStaffCount;
    const classroomTypeString = Array.isArray(classroomType) ? classroomType[0] : classroomType;
    const classroomTypeFormatted = classroomTypeString
      ? classroomTypeString.charAt(0).toUpperCase() + classroomTypeString.slice(1).toLowerCase()
      : 'Classroom';

    const loadMoreStaff = () => {
      setVisibleStaffCount(prevCount => prevCount + 4);
    };

    const measureBioHeight = (index) => {
      requestAnimationFrame(() => {
        const bioElement = document.querySelector(`#bio-${index}`);
        if (bioElement) { // null check
          const height = bioElement.scrollHeight;
          setBioHeights({ ...bioHeights, [index]: height });
        }
      });
    };

    const handleToggleBio = (index) => {
      if (activeBio !== index) {
        measureBioHeight(index);
      }
      setActiveBio(activeBio === index ? null : index);
    };

    return (
      <div className='staff'>
        <div className='heading'>
          <h2>Our {classroomTypeFormatted} Classroom Faculty & Staff</h2>
        </div>
        <div className='row'>
          <div className='staff-members-section'>
            <div className='staff-members'>
              {assignedStaffMembers.slice(0, visibleStaffCount).map((member, index) => (
                <div className={`staff-member ${activeBio === index ? 'expanded' : ''}`} key={index}>
                  <div className='row align-items-center'>
                    <div className='col-4'>
                      {member.image && <img src={member.image.sourceUrl} alt={member.name} className='img-fluid' />}
                    </div>
                    <div className='col-7 '>
                      <div className='text-wrap pe-5'>
                        <h5 className='mb-0'>{member.name}</h5>
                        <div className='b3'>{member.title}</div>
                        <span className='staff-group'>{member.group}</span>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div
                        className={`bio ${activeBio === index ? 'expanded' : ''}`}
                        id={`bio-${index}`}
                        style={{ maxHeight: activeBio === index ? `${bioHeights[index]}px` : '0' }}
                      >
                        <div className='b3 p-3' dangerouslySetInnerHTML={{ __html: member.bio }} />
                      </div>
                    </div>
                    <div id="button" onClick={() => handleToggleBio(index)} className={activeBio === index ? 'expanded' : ''}>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {canLoadMore && (
              <div className="load-more">
                <Button onClick={loadMoreStaff}>Load More</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const selectedDomains = school?.schoolSettings?.classrooms?.classroomSelection?.classroomDetails?.infant?.learningDomains?.selectDomains || [];
  const isDomainSelected = (domain) => {
    return selectedDomains.includes(domain);
  };

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

  }, []);

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

  const heroData = school?.schoolSettings?.classrooms?.classroomSelection?.classroomDetails?.infant?.hero;
  const shouldReverseColumn = true;
  const heroProps = {
    leftColumn: {
      image: {
        sourceUrl: heroData?.image?.sourceUrl,
        altText: heroData?.image?.altText || ''
      },
    },
    rightColumn: {
      heading: heroData?.heading,
      blurb: heroData?.blurb,
      button: {
        target: heroData?.button?.target || '_self',
        title: heroData?.button?.title,
        url: heroData?.button?.url
      },
    },
    switchColumnOrderOnDesktop: shouldReverseColumn,
    // Add other properties as needed, like accent, switchColumnOrderOnDesktop, customizations, etc.
  };

  return (

    <div className='school classroom-type'>
      <HeroWithImage {...heroProps} />
      <div className="container">
        <div className="general-horizontal-tabs-module">
          <h2 className="heading">Overview of Learning Domains</h2>
          <div className="general-horizontal-tabs">
            <div className="inner">
              {isDomainSelected('Language and Literacy') && (
                <div>
                  <button data-target="infant" className={`clickable ${activeTab === 'infant' ? 'expanded' : ''}`} onClick={() => handleTabClick('infant')}>
                    <Heading level='h5'>Language and Literacy
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'infant' ? 'active' : ''}`} style={{ opacity: activeTab === 'infant' ? '1' : '0' }}>

                      <img src="/assets/tabpic1.png" alt="Language and Literacy" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>Language and Literacy</Heading>
                        <Subheading level='div' className='b3'>From the moment they are born, babies listen, process and imitate speech sounds they hear. That’s why your child’s teachers interact with your baby in meaningful “serve and return” exchanges, like responding to babbles, gestures or cries with eye contact, encouragement and more.</Subheading>

                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDomainSelected('STEM') && (
                <div>
                  <button data-target="toddler" className={`clickable ${activeTab === 'toddler' ? 'expanded' : ''}`} onClick={() => handleTabClick('toddler')}>
                    <Heading level='h5'>Science, Technology, Engineering and Math
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'toddler' ? 'active' : ''}`} style={{ opacity: activeTab === 'toddler' ? '1' : '0' }}>

                      <img src="/assets/tabpic2.png" alt="Toddler" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>STEM</Heading>
                        <Subheading level='div' className='b3'>Infants are very perceptive of the people around them. Your baby is learning about the people in their immediate surroundings and how to interact kindly with others. Teachers help your child learn about others through books, images, and scenarios with the Primrose Friends puppets.</Subheading>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDomainSelected('Physical Development') && (
                <div>
                  <button data-target="early-preschool" className={`clickable ${activeTab === 'early-preschool' ? 'expanded' : ''}`} onClick={() => handleTabClick('early-preschool')}>
                    <Heading level='h5'>Physical Development
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'early-preschool' ? 'active' : ''}`} style={{ opacity: activeTab === 'early-preschool' ? '1' : '0' }}>

                      <img src="/assets/tabpic3.png" alt="Early Preschool" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>Physical Development</Heading>
                        <Subheading level='div' className='b3'>Motor skills are important building blocks for physical activity. Your child's teacher helps your infant focus on key small and large motor skills throughout each day.</Subheading>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDomainSelected('Music, Creative Arts and Expression') && (
                <div>
                  <button data-target="preschool" className={`clickable ${activeTab === 'preschool' ? 'expanded' : ''}`} onClick={() => handleTabClick('preschool')}>
                    <Heading level='h5'>Music, Creative Arts and Expression
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'preschool' ? 'active' : ''}`} style={{ opacity: activeTab === 'preschool' ? '1' : '0' }}>

                      <img src="/assets/tabpic4.png" alt="Preschool" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>Music, Creative Arts and Expression</Heading>
                        <Subheading level='div' className='b3'>Visual and creative arts stimulate your child’s imagination and critical-thinking skills, which help in other areas of learning and development.</Subheading>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDomainSelected('Social Studies and Emotional Skills') && (
                <div>
                  <button data-target="pre-kindergarten" className={`clickable ${activeTab === 'pre-kindergarten' ? 'expanded' : ''}`} onClick={() => handleTabClick('pre-kindergarten')}>
                    <Heading level='h5'>Social Studies and Emotional Skills
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'pre-kindergarten' ? 'active' : ''}`} style={{ opacity: activeTab === 'pre-kindergarten' ? '1' : '0' }}>

                      <img src="/assets/tabpic5.png" alt="Pre-Kindergarten" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>Social Studies and Emotional Skills'</Heading>
                        <Subheading level='div' className='b3'>Children enter the world as natural scientists, curious to observe and explore how the world works and their role in it. While math and science may sound like big topics for an infant, they’re learning about shapes as they interact with toys, they explore numbers as teachers count their toes and they use all their senses to explore problems and try to find solutions.</Subheading>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDomainSelected('Character Development and Life Skills') && (
                <div>
                  <button data-target="kindergarten" className={`clickable ${activeTab === 'kindergarten' ? 'expanded' : ''}`} onClick={() => handleTabClick('kindergarten')}>
                    <Heading level='h5'>Character Development and Life Skills
                      <div id="button">
                        <span></span>
                        <span></span>
                      </div>
                    </Heading>
                  </button>

                  {/* Mobile: Content rendered right below the label */}
                  <div className="d-lg-none">
                    <div className={`tab-content ${activeTab === 'kindergarten' ? 'active' : ''}`} style={{ opacity: activeTab === 'kindergarten' ? '1' : '0' }}>

                      <img src="/assets/tabpic6.png" alt="Kindergarten" />

                      <div className='content-wrapper'>
                        <Heading level='h3'>Character Development and Life Skills</Heading>
                        <Subheading level='div' className='b3'>We believe who children become is as important as what they know. That’s why Infant teachers develop loving, nurturing relationships with your baby to build a sense of security and trust that lays the foundation for social skills later in life.</Subheading>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: Content rendered outside the loop in a designated area */}
            <div className='desktop-content d-none d-lg-block'>
              {isDomainSelected('Language and Literacy') && (
                <div id="infant" className="tab-content d-flex">
                  <img src="/assets/tabpic1.png" alt="Language and Literacy" />

                  <div className='content-wrapper'>
                    <Heading level='h3'>Language and Literacy</Heading>
                    <Subheading level='div' className='b3'>Infants are very perceptive of the people around them. Your baby is learning about the people in their immediate surroundings and how to interact kindly with others. Teachers help your child learn about others through books, images, and scenarios with the Primrose Friends puppets.</Subheading>
                  </div>
                </div>
              )}
              {isDomainSelected('STEM') && (
                <div id="toddler" className="tab-content d-flex">
                  <img src="/assets/tabpic2.png" alt="STEM" />
                  <div className='content-wrapper'>
                    <Heading level='h3'>Science, Technology, Engineering and Math</Heading>
                    <Subheading level='div' className='b3'>Infants are very perceptive of the people around them. Your baby is learning about the people in their immediate surroundings and how to interact kindly with others. Teachers help your child learn about others through books, images, and scenarios with the Primrose Friends puppets.</Subheading>
                  </div>
                </div>
              )}
              {isDomainSelected('Physical Development') && (
                <div id="early-preschool" className="tab-content d-flex">
                  <img src="/assets/tabpic3.png" alt="Physical Development" />
                  <div className='content-wrapper'>
                    <Heading level='h3'>Physical Development</Heading>
                    <Subheading level='div' className='b3'>Motor skills are important building blocks for physical activity. Your child's teacher helps your infant focus on key small and large motor skills throughout each day.</Subheading>
                  </div>
                </div>
              )}
              {isDomainSelected('Music, Creative Arts and Expression') && (
                <div id="preschool" className="tab-content d-flex">
                  <img src="/assets/tabpic4.png" alt="Music, Creative Arts and Expression" />
                  <div className='content-wrapper'>
                    <Heading level='h3'>Music, Creative Arts and Expression</Heading>
                    <Subheading level='div' className='b3'>Visual and creative arts stimulate your child’s imagination and critical-thinking skills, which help in other areas of learning and development.</Subheading>
                  </div>
                </div>
              )}
              {isDomainSelected('Social Studies and Emotional Skills') && (
                <div id="pre-kindergarten" className="tab-content d-flex">
                  <img src="/assets/tabpic5.png" alt="Social Studies and Emotional Skills" />
                  <div className='content-wrapper'>
                    <Heading level='h3'>Social Studies and Emotional Skills</Heading>
                    <Subheading level='div' className='b3'>Children enter the world as natural scientists, curious to observe and explore how the world works and their role in it. While math and science may sound like big topics for an infant, they’re learning about shapes as they interact with toys, they explore numbers as teachers count their toes and they use all their senses to explore problems and try to find solutions.</Subheading>
                  </div>
                </div>
              )}
              {isDomainSelected('Character Development and Life Skills') && (
                <div id="kindergarten" className="tab-content d-flex">
                  <img src="/assets/tabpic6.png" alt="Character Development and Life Skills" />
                  <div className='content-wrapper'>
                    <Heading level='h3'>Character Development and Life Skills</Heading>
                    <Subheading level='div' className='b3'>We believe who children become is as important as what they know. That’s why Infant teachers develop loving, nurturing relationships with your baby to build a sense of security and trust that lays the foundation for social skills later in life.</Subheading>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='background-color'>
        {StaffMembers()}
       {shouldRenderCTA && (
        <GeneralButtonCTA
          variation="violet"
          buttonStyle="white"
          accents={{
            accentOne: {
              sourceUrl: '/assets/transparent-square.svg',
            },
            accentTwo: {
              sourceUrl: '/assets/transparent-circle.svg',
            }
          }}
          {...generalButtonCTAProps}
        />
        )}
      </div>
      {CustomVerticalTab()}
      {testimonialSection()}
      {findASchool()}
    </div>
  );

}



