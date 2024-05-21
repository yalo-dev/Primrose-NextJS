import { gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import "bootstrap/dist/css/bootstrap.min.css";
import parse from "html-react-parser";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import ErrorBoundary from "../app/components/organisms/ErrorBoundary";
import Layout from "../app/components/templates/Layout/Layout";
import { client } from "../app/lib/apollo";
import "../app/styles/globals.scss";
import { poppins, serif } from "../font";

export const SliderSpeed = createContext(null);

const LAYOUT_QUERY = gql`
  query LayoutQuery {
    headerMenu: menu(id: "4", idType: DATABASE_ID) {
      menuItems(first: 100) {
        nodes {
          title
          label
          url
          parentId
          cssClasses
          childItems(first: 100) {
            nodes {
              title
              label
              url
              parentId
              cssClasses
              childItems(first: 100) {
                nodes {
                  label
                  title
                  url
                  parentId
                  cssClasses
                }
              }
            }
          }
        }
      }
    }
    footerMenu: menu(id: "2", idType: DATABASE_ID) {
      menuItems {
        nodes {
          url
          label
        }
      }
    }
    siteSettings {
      siteSettings {
        copyrightInfo
        disclaimer
        footerLinks {
          link {
            url
            title
            target
          }
        }
        logoFooter {
          sourceUrl
          altText
        }
        socialIcons {
          link {
            url
          }
          icon {
            sourceUrl
            altText
          }
        }
        carouselRotationTiming
      }
    }
  }
`;

function MyApp({ Component, pageProps }) {
  console.log('app')
  const [layoutSettings, setLayoutSettings] = useState({
      headerMenu: {
        menuItems: {
          nodes: [],
        },
      },
      footerMenu: {
        menuItems: {
          nodes: [],
        },
      },
      siteSettings: {
        siteSettings: null,
      },
    },
  )

  const fetchMenuItems = async () => {
    const { data: layoutData } = await client.query({
      query: LAYOUT_QUERY,
    });
    setLayoutSettings(layoutData);
  };
  fetchMenuItems();

  useEffect(() => {
    if (window.location.hash) {
      // check for the hash element to scroll to, or stop after the 5th check
      let check = 0;
      const checkHashScroll = setInterval(() => {
        const hashElement: HTMLElement = document.querySelector(
          `${window.location.hash}`,
        );
        const nav = document.getElementsByTagName("nav")[0];

        if (hashElement) {
          window.scrollTo({
            top: hashElement.offsetTop - nav.scrollHeight * 2,
          });
          clearInterval(checkHashScroll);
        } else if (check >= 4) {
          clearInterval(checkHashScroll);
        }
        check++;
      }, 100);
    }

    if (process.env.NODE_ENV === "development") {
      (window as any).resetApolloCache = () => {
        client.resetStore();
        console.log("Apollo cache reset.");
      };
    }
  }, []);

  let seo = null;
  if (pageProps.page?.data?.page?.seo) {
    seo = parse(pageProps.page.data.page.seo.fullHead);
  } else if (pageProps.school) {
    if (pageProps.data?.classroom.seo) {
      if (pageProps.customSeo) {
        seo = parse(pageProps.customSeo.fullHead);
      } else {
        seo = parse(pageProps.data.classroom.seo.fullHead);
      }
    } else if (pageProps.school.seo) {
      if (pageProps.customSeo) {
        seo = parse(pageProps.customSeo.fullHead);
      } else {
        seo = parse(pageProps.school.seo.fullHead);
      }
    }
  } else if (pageProps.seo) {
    seo = parse(pageProps.seo.contentTypes.resource.archive.fullHead);
  } else if (pageProps.resources?.resourceType?.seo) {
    seo = parse(pageProps.resources.resourceType.seo.fullHead);
  } else if (pageProps.resources?.resourceTag?.seo) {
    seo = parse(pageProps.resources.resourceTag.seo.fullHead);
  } else if (pageProps.resource?.seo) {
    seo = parse(pageProps.resource.seo.fullHead);
  } else if (pageProps.locationsSeo) {
    seo = parse(
      `<title>${pageProps.locationsSeo.title}</title>
			<meta name="description" content="${pageProps.locationsSeo.description}" />`,
    );
  } else if (pageProps.seoData) {
    seo = parse(pageProps.seoData.fullHead);
  }

  return (
    <ApolloProvider client={client}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        {seo}
      </Head>
      <style jsx global>{`
        :root {
          --font-family-poppins: ${poppins.style.fontFamily};
          --font-family-serif: ${serif.style.fontFamily};
        }
      `}</style>
      <SliderSpeed.Provider value={layoutSettings.siteSettings.siteSettings?.carouselRotationTiming}>
        <Layout layoutSettings={layoutSettings} >
            <Component {...pageProps} />
        </Layout>
      </SliderSpeed.Provider>
    </ApolloProvider>
  );
}

export default MyApp;
