import { useRouter } from 'next/router';
import { client } from '../../../../app/lib/apollo';
import { gql } from '@apollo/client';
import HeroWithImage from '../../../../app/components/modules/HeroWithImage/HeroWithImage';
import TwoColumnsImageAndText from '../../../../app/components/modules/TwoColumnsImageAndText/TwoColumnsImageAndText';
import TestimonialsWithVideoOrImage from '../../../../app/components/modules/TestimonialsWithVideoOrImage/TestimonialsWithVideoOrImage';
import GeneralButtonCTA from '../../../../app/components/modules/GeneralButtonCTA/GeneralButtonCTA';
import GallerySlider from '../../../../app/components/modules/GallerySlider/GallerySlider';
import FindASchoolMap from '../../../../app/components/modules/FindASchoolModule/FindASchoolModule';
import OpenPositions from '../../../../app/components/modules/OpenPositions/OpenPositions';
import LargeCardSlider from '../../../../app/components/modules/LargeCardSlider/LargeCardSlider';

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
      leftColumn: {image: {sourceUrl: market.marketSettings.careersHero.heroImage.sourceUrl, altText: market.marketSettings.careersHero.heroImage.altText}},
      rightColumn: {heading: "Primrose Schools Careers in the " + market.name + " Area", headingColor: "white", blurbColor:"white", blurb: market.marketSettings.heroParagraph, button: {title:"See Open Positions", url: "#jobs"}, buttonStyle: 'white'},
      customizations: {backgroundColor: '#5E6738'},
      switchColumnOrderOnDesktop: true
    };
    const fiftyFifty1_props = {
      switchColumnOrderOnDesktop: false,
      centerModule: true,
      rightColumn: {
        heading: market.marketSettings.careersFiftyFifty1.title,
        blurb: market.marketSettings.careersFiftyFifty1.paragraph,
        button: {
          title: market.marketSettings.careersFiftyFifty1.cta?.title,
          url: market.marketSettings.careersFiftyFifty1.cta?.url,
          target: market.marketSettings.careersFiftyFifty1.cta?.target
        }
      },
        leftColumn: {
          imageOrVideo: "Image",
          imageDesktop: {
           sourceUrl: market.marketSettings.careersFiftyFifty1.image.sourceUrl,
           altText: market.marketSettings.careersFiftyFifty1.image.altText
          },
          imageMobile: {
            sourceUrl: market.marketSettings.careersFiftyFifty1.image.sourceUrl,
            altText: market.marketSettings.careersFiftyFifty1.image.altText
           }

        }
      }
     
      const testimonials = [];
      market.marketSettings.careersTestimonials.map((testimonial, index) => {
          testimonials.push({
            imageOrVideo: 'image',
            image: {
              sourceUrl: testimonial.testimonialImage.sourceUrl,
              altText: testimonial.testimonialImage.altText
            },
            title: testimonial.name,
            position: testimonial.title,
            testimonial: testimonial.testimonial
            
          })
        });
    const testimonials_props = {
      slider: testimonials,
      heading: market.marketSettings.testimonialsSectionTitle,
      subheading: market.marketSettings.testimonialsSectionDescription
    }
    let benefits = market.marketSettings.schoolBenefitsSection;
    
    let benefitsItems = [];
    benefits.benefits.map((benefit, index) =>{
        benefitsItems.push({
            icon: {
                sourceUrl: benefit.icon.sourceUrl,
                altText: benefit.icon.altText
            },
            title: benefit.title,
            paragraph: benefit.paragraph
        });
    }
    );
    const benefits_props={
        buttonStyle: 'secondary',
        button: {
            title: benefits.cta.title,
            target: benefits.cta.target,
            url: benefits.cta.url
        },
        heading: benefits.headline,
        paragraph: benefits.paragraph,
        image: {
            altText: benefits.image.altText,
            sourceUrl: benefits.image.sourceUrl
        },
        slider: benefitsItems
    }
    console.log(benefits_props);

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
    const positions_props = {
        careerPlugId: 123456
    }
    return(
        <>
        <div className="modules--container market mt-5 pt-5">
          
            <HeroWithImage {...hero_props} />
            <TwoColumnsImageAndText  {...fiftyFifty1_props} />
            <LargeCardSlider {...benefits_props} />
            <TestimonialsWithVideoOrImage {...testimonials_props} />
            <OpenPositions {...positions_props} />
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
                schools (first:100000) {
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
                  careerplugSchoolId
                    careersFiftyFifty1 {
                        cta {
                        target
                        title
                        url
                        }
                        image {
                        altText
                        mediaItemUrl
                        sourceUrl
                        }
                        paragraph
                        title
                    }
                    careersHero {
                        heroDisclaimer
                        heroImage{
                            altText
                            mediaItemUrl
                            sourceUrl
                        }
                        heroParagraph
                    }
                    testimonialsSectionDescription
                    testimonialsSectionTitle
                    careersTestimonials {
                        name
                        testimonial
                        title
                        testimonialImage {
                        altText
                        mediaItemUrl
                        sourceUrl
                        }
                    }
                    schoolBenefitsSection {
                        benefits {
                            paragraph
                            title,
                        
                            icon {
                                altText
                                mediaItemUrl
                                sourceUrl
                            }
                        }
                        cta {
                            target
                            title
                            url
                        }
                        headline
                        paragraph
                        image{
                            altText
                            mediaItemUrl
                            sourceUrl
                        }
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