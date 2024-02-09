import { useRouter } from 'next/router';
import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import HeroWithImage from '../../../app/components/modules/HeroWithImage/HeroWithImage';
import TwoColumnsImageAndText from '../../../app/components/modules/TwoColumnsImageAndText/TwoColumnsImageAndText';
import QuoteTestimonials from '../../../app/components/modules/QuoteTestimonials/QuoteTestimonials';
import GeneralButtonCTA from '../../../app/components/modules/GeneralButtonCTA/GeneralButtonCTA';
import GallerySlider from '../../../app/components/modules/GallerySlider/GallerySlider';
import FindASchoolMap from '../../../app/components/modules/FindASchoolModule/FindASchoolModule';

const GET_LOCATIONS = gql`
query GetLocations {
    markets {
        edges{
            node{
                uri
                slug
            }
        }
      nodes {
        slug
        uri
      }
    }
  }
`;
export async function getAllLocations(){
    const locations =  await client.query({query:GET_LOCATIONS});
    return locations?.data!.markets.edges;
}

export default function Location({ locationData }){
  console.log(locationData);
    const market = locationData.data.market;
    const router = useRouter();

    const hero_props = {
      leftColumn: {image: {sourceUrl: market.marketSettings.heroImage.sourceUrl, altText: market.marketSettings.heroImage.altText}},
      rightColumn: {heading: "Primrose Schools in the " + market.name + " Area", headingColor: "white", blurbColor:"white", blurb: market.marketSettings.heroParagraph, button: {title:"See Nearest Schools", url: "#map"}, buttonStyle: 'white'},
      customizations: {backgroundColor: '#5E6738'},
      switchColumnOrderOnDesktop: true
    };
    const fiftyFifty1_props = {
      switchColumnOrderOnDesktop: false,
      centerModule: true,
      rightColumn: {
        heading: market.marketSettings.fiftyFifty1.title,
        blurb: market.marketSettings.fiftyFifty1.paragraph,
        button: {
          title: market.marketSettings.fiftyFifty1.cta?.title,
          url: market.marketSettings.fiftyFifty1.cta?.url,
          target: market.marketSettings.fiftyFifty1.cta?.target
        }
      },
        leftColumn: {
          imageOrVideo: "Image",
          imageDesktop: {
           sourceUrl: market.marketSettings.fiftyFifty1.image.sourceUrl,
           altText: market.marketSettings.fiftyFifty1.image.altText
          },
          imageMobile: {
            sourceUrl: market.marketSettings.fiftyFifty1.image.sourceUrl,
            altText: market.marketSettings.fiftyFifty1.image.altText
           }

        }
      }
      const fiftyFifty2_props = {
        switchColumnOrderOnDesktop: true,
        centerModule: true,
        rightColumn: {
          heading: market.marketSettings.fiftyFifty2.title,
          blurb: market.marketSettings.fiftyFifty2.paragraph,
          button: {
            title: market.marketSettings.fiftyFifty2.cta?.title,
            url: market.marketSettings.fiftyFifty2.cta?.url,
            target: market.marketSettings.fiftyFifty2.cta?.target
          }
        },
          leftColumn: {
            imageOrVideo: "Image",
            imageDesktop: {
             sourceUrl: market.marketSettings.fiftyFifty2.image.sourceUrl,
             altText: market.marketSettings.fiftyFifty2.image.altText
            },
            imageMobile: {
              sourceUrl: market.marketSettings.fiftyFifty2.image.sourceUrl,
              altText: market.marketSettings.fiftyFifty2.image.altText
             }
  
          }
        }
      const testimonials = [];
      market.marketSettings.testimonials.map((testimonial, index) => {
          testimonials.push({
            avatar: {
              sourceUrl: testimonial.testimonialImage.sourceUrl,
              altText: testimonial.testimonialImage.altText
            },
            name: testimonial.name,
            position: testimonial.title,
            content: {
              heading: testimonial.headline,
              blurb: testimonial.testimonial
            }
          })
        });
    const testimonials_props = {
      tabs: testimonials,
      heading: "See What Families Are Saying"
    }
    const cta_props = {
      subheading: market.marketSettings.schoolLocatorCta.paragraph,
      heading: market.name + " Area Schools",
      image: {
        sourceUrl: market.marketSettings.schoolLocatorCta.image.sourceUrl,
        altText: market.marketSettings.schoolLocatorCta.image.altText
      },
      button: {
        title: "See Nearest Schools",
        url: "#map"
      }
    }
    const gallery_props = { gallery: market.marketSettings.gallery, uniqueId: 1};
    const schools = [];

    market.schools.nodes.map((school, index) => {
      schools.push({
        id: school.slug,
        name: "Primrose School " + school.schoolCorporateSettings.schoolOfAtOn + " " + school.title,
        address: school.schoolCorporateSettings.address.streetAddress +  "  " + school.schoolCorporateSettings.address.city + ", " + school.schoolCorporateSettings.address.state + "  " + school.schoolCorporateSettings.address.zipcode,
        //hours: school.schoolAdminSettings.hoursOfOperation.openingTime + " - " + school.schoolAdminSettings.hoursOfOperation.closingTime,
        notes: " ",
        coordinates: {
          lat: school.schoolCorporateSettings.address.latitude as number,
          lng: school.schoolCorporateSettings.address.longitude as number
        }

      })
    });
    const map_props = {
      title: "Primrose Schools in the " + market.name + " Area",
      schools: schools,
      center: {
        lat: market.marketSettings.marketCenter.latitude,
        lng: market.marketSettings.marketCenter.longitude
      }
    }
    return(
        <>
        <div className="modules--container market mt-5 pt-5">
          
            <HeroWithImage {...hero_props} />
            <TwoColumnsImageAndText  {...fiftyFifty1_props} />
            <QuoteTestimonials {...testimonials_props} />
            <TwoColumnsImageAndText  {...fiftyFifty2_props} />
            <GeneralButtonCTA {...cta_props} />
            <GallerySlider {...gallery_props} />
            <FindASchoolMap {...map_props} />
        </div>
        
        </>
    );
}

//export async function getStaticProps({params={slug:""}, preview=false} = {}) {
  export async function getServerSideProps({params={locationsSlug:""}, preview=false} = {}) {
    const slug  = params.locationsSlug;
    console.log(params); 
    const GET_LOCATION = gql`
        query GetLocationData {
            market(id: "${'locations/' + slug}", idType: URI) {
                name
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
                      schoolName
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
                  fiftyFifty2 {
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
                }
            }
        }
        `;


    const locationData =  await client.query({query: GET_LOCATION}) ;
    
    return {
      props: {
        locationData: locationData,
      },
    };
  }
  
/*   export async function getStaticPaths() {
    const allLocations  = await getAllLocations();;
    const paths = allLocations.map((item) => ({
        params: { slug: [item.node.slug] },
      }));
    return {
      paths,
      fallback: 'blocking',
    };
  }
   */