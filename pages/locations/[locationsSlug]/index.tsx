import { gql, useQuery } from "@apollo/client";
import camelize from "camelize";
import GallerySlider from "../../../app/components/modules/GallerySlider/GallerySlider";
import GeneralButtonCTA from "../../../app/components/modules/GeneralButtonCTA/GeneralButtonCTA";
import GeneralVerticalTabs, {
  VerticalTabProps,
} from "../../../app/components/modules/GeneralVerticalTabs/GeneralVerticalTabs";
import HeroWithImage from "../../../app/components/modules/HeroWithImage/HeroWithImage";
import FindASchoolMap from "../../../app/components/modules/MapSearch/MapSearch";
import QuoteTestimonials from "../../../app/components/modules/QuoteTestimonials/QuoteTestimonials";
import TwoColumnsImageAndText from "../../../app/components/modules/TwoColumnsImageAndText/TwoColumnsImageAndText";

export default function Location({ locationData }) {
  const siteSettings = locationData?.data?.siteSettings?.siteSettings;
  const market = locationData.data.market;

  const headerImage = market?.marketSettings?.heroImage?.sourceUrl
    ? {
        sourceUrl: market?.marketSettings?.heroImage?.sourceUrl,
        altText: market?.marketSettings?.heroImage?.altText,
      }
    : {
        sourceUrl: siteSettings?.enrollmentHeaderImage?.sourceUrl,
        altText: siteSettings?.enrollmentHeaderImage?.altText,
      };
  const hero_props = {
    leftColumn: { image: headerImage },
    rightColumn: {
      heading: "Primrose Schools in the " + market.name + " Area",
      headingColor: "white",
      blurbColor: "white",
      blurb: market.marketSettings.heroParagraph,
      button: { title: "See Nearest Schools", url: "#map" },
      buttonStyle: "secondary",
    },
    customizations: {
      backgroundColor: "#5E6738",
      topPaddingDesktop: "None",
      topPaddingMobile: "None",
    },
  };

  const ff1 = market?.marketSettings?.fiftyFifty1;
  const ff1Checks =
    ff1 && (ff1.title || ff1.paragraph || ff1.url || ff1.target || ff1.image);
  const ff1Image = ff1.image?.sourceUrl
    ? { sourceUrl: ff1.image?.sourceUrl, altText: ff1.image?.altText }
    : {
        sourceUrl: siteSettings?.educationalChildcareImage?.sourceUrl,
        altText: siteSettings?.educationalChildcareImage.altText,
      };
  const fiftyFifty1_props = !ff1Checks
    ? null
    : {
        customizations: {
          topPaddingDesktop: "None",
          bottomPaddingDesktop: "None",
        },
        switchRowOrderOnMobile: true,
        switchColumnOrderOnDesktop: true,
        centerModule: true,
        rightColumn: {
          heading: ff1.title,
          blurb: ff1.paragraph,
          button: {
            title: ff1.title,
            url: ff1.url,
            target: ff1.target,
          },
        },
        leftColumn: {
          imageOrVideo: "Image",
          imageDesktop: ff1Image,
          imageMobile: ff1Image,
        },
      };

  const testimonials = [];
  market.marketSettings.testimonials?.map((testimonial, index) => {
    testimonials.push({
      avatar: {
        sourceUrl: testimonial.testimonialImage?.sourceUrl,
        altText: testimonial.testimonialImage?.altText,
      },
      name: testimonial.name,
      position: testimonial.title,
      content: {
        heading: testimonial.headline,
        blurb: testimonial.testimonial,
      },
    });
  });
  const testimonials_props = testimonials.length > 0 && {
    tabs: testimonials,
    heading: "See What Families Are Saying",
  };
  const cta_props = !market?.marketSettings?.schoolLocatorCta?.image?.sourceUrl
    ? null
    : {
        customizations: {
          topPaddingDesktop: "None",
          bottomPaddingDesktop: "Small",
        },
        subheading: market.marketSettings.schoolLocatorCta.paragraph,
        heading: market.name + " Area Schools",
        image: {
          sourceUrl: market.marketSettings.schoolLocatorCta.image?.sourceUrl,
          altText: market.marketSettings.schoolLocatorCta.image?.altText,
        },
        button: {
          title: "See Nearest Schools",
          url: "#map",
        },
      };
  const gallery_props = market?.marketSettings?.gallery && {
    gallery: market.marketSettings.gallery,
    uniqueId: 1,
  };
  const schools = market?.schools?.nodes;

  const map_props = {
    title:
      market?.marketSettings?.marketEnrollmentPageHeadline ??
      "Primrose Schools in the " + market.name + " Area",
    schools: schools,
    center: {
      latitude: market?.marketSettings?.marketCenter?.latitude,
      longitude: market?.marketSettings?.marketCenter?.longitude,
    },
  };
  const ageGroupTabs = Object.values(
    market?.marketSettings?.ageGroups?.classrooms,
  ).filter((item) => typeof item === "object");
  const tabs = ageGroupTabs.map((item: any) => {
    const defaultImg =
      siteSettings.marketClassroomsImageDefaults[
        camelize(item.title.toLowerCase())
      ];
    const tabImg = item.backgroundImage?.sourceUrl
      ? {
          sourceUrl: item.backgroundImage?.sourceUrl,
          altText: item.backgroundImage?.altText,
        }
      : { sourceUrl: defaultImg?.sourceUrl, altText: defaultImg?.altText };
    return {
      label: item.title,
      content: {
        heading: item.title,
        blurb: item.description,
        image: tabImg,
      },
    };
  });
  const gva_customizations = {
    topPaddingMobile: "None",
    topPaddingDesktop: "None",
    bottomPaddingMobile: "None",
    bottomPaddingDesktop: "None",
  };
  const gva_props = {
    customizations: gva_customizations,
    tabs: tabs,
    heading:
      market?.marketSettings?.ageGroups?.heading &&
      market?.marketSettings?.ageGroups?.heading,
    subheading:
      market?.marketSettings?.ageGroups?.subheading &&
      market?.marketSettings?.ageGroups?.subheading,
  };

  return (
    <>
      <div className="modules--container market mt-4 pt-4">
        <HeroWithImage {...hero_props} />
        {fiftyFifty1_props && <TwoColumnsImageAndText {...fiftyFifty1_props} />}
        {/* @ts-ignore */}
        {market?.marketSettings?.ageGroups && (
          <GeneralVerticalTabs {...(gva_props as VerticalTabProps)} />
        )}
        {testimonials_props && <QuoteTestimonials {...testimonials_props} />}
        {cta_props && <GeneralButtonCTA {...cta_props} />}
        {gallery_props && <GallerySlider {...gallery_props} />}
        <FindASchoolMap {...map_props} />
      </div>
    </>
  );
}

//export async function getStaticProps({params={slug:""}, preview=false} = {}) {
export function getServerSideProps({
  params = { locationsSlug: "" },
  preview = false,
} = {}) {
  const slug = params.locationsSlug;
  //console.log(params);
  const GET_LOCATION = gql`
        query GetLocationData {
            siteSettings {
              siteSettings {
                enrollmentHeaderImage {
                  altText
                  sourceUrl
                }
                educationalChildcareImage {
                  altText
                  sourceUrl
                }
                marketClassroomsImageDefaults {
                  infant {
                    altText
                    sourceUrl
                  }
                  kindergarten {
                    altText
                    sourceUrl
                  }
                  preKindergarten {
                    altText
                    sourceUrl
                  }
                  preschool {
                    altText
                    sourceUrl
                  }
                  toddler {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            market(id: "${"locations/" + slug}", idType: URI) {
                name
                seo {
                  fullHead
                }
                schools (first:100000, where: {orderby: {field: TITLE, order: ASC}}) {
                  nodes {
                    title
                    uri
                    slug
                    databaseId
                    schoolAdminSettings {
                      hoursOfOperation {
                        closingTime
                        openingTime
                      }
                    }
                    schoolCorporateSettings {
                      schoolOfAtOn
                      address {
                        streetAddress
                        streetAddress2
                        city
                        state
                        zipcode
                        latitude
                        longitude
                        googlePlaceUrl
                      }
                    }
                  }
                }
                marketSettings {
                  marketEnrollmentPageHeadline
                  heroImage {
                    mediaItemUrl
                    sourceUrl
                    altText
                  }
                  heroParagraph
                  fiftyFifty1 {
                    title
                    paragraph
                    image {
                      altText
                      mediaItemUrl
                      sourceUrl
                    }
                    cta {
                      target
                      title
                      url
                    }
                  }
                  gallery {
                    caption
                    image {
                      altText
                      mediaItemUrl
                      sourceUrl
                    }
                    title
                  }
                  schoolLocatorCta {
                    image {
                      altText
                      mediaItemUrl
                      sourceUrl
                    }
                    paragraph
                  }
                  testimonials {
                    headline
                    name
                    testimonial
                    title
                    testimonialImage {
                      altText
                      mediaItemUrl
                      sourceUrl
                    }
                  }
                  marketCenter {
                    latitude
                    longitude
                  }
                  ageGroups {
                      heading
                      subheading
                      classrooms {
                        infant {
                          description
                          title
                          backgroundImage {
                            altText
                            sourceUrl
                          }
                        }
                        toddler {
                          description
                          title
                          backgroundImage {
                            altText
                            sourceUrl
                          }
                        }
                        preschool {
                          description
                          title
                          backgroundImage {
                            altText
                            sourceUrl
                          }
                        }
                        preKindergarten {
                          description
                          title
                          backgroundImage {
                            altText
                            sourceUrl
                          }
                        }
                        kindergarten {
                          description
                          title
                          backgroundImage {
                            altText
                            sourceUrl
                          }
                        }
                      }
                  }
                }
            }
        }
        `;

  const locationData = useQuery(GET_LOCATION);

  if (!locationData?.data?.market) return { notFound: true };
  const seoData = locationData?.data?.market?.seo;

  return {
    props: {
      locationData: locationData,
      seoData,
    },
  };
}
