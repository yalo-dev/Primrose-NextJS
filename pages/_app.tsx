import { useEffect, useState } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/styles/globals.scss';
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../app/lib/apollo";
import Layout from '../app/components/templates/Layout/Layout';
import { gql } from '@apollo/client';
// import $ from '../app/lib/jquery';

function MyApp({ Component, pageProps }) {
  const [headerMenuItems, setHeaderMenuItems] = useState([]);
  const [footerMenuItems, setFooterMenuItems] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }

    const fetchMenuItems = async () => {
      // header menu query
      const HEADER_MENU_QUERY = gql`
        query HeaderMenu {
          menu(id: "4", idType: DATABASE_ID) {
            menuItems {
              nodes {
                url
                label
              }
            }
          }
        }
      `;

      // footer menu query
      const FOOTER_MENU_QUERY = gql`
        query FooterMenu {
          menu(id: "2", idType: DATABASE_ID) {
            menuItems {
              nodes {
                url
                label
              }
            }
          }
        }
      `;

      // site settings query
      const SITE_SETTINGS_QUERY = gql`
        query SiteSettings {
          siteSettings {
            siteSettings {
              copyrightInfo
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
                icon {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `;

      const { data: headerData } = await client.query({
        query: HEADER_MENU_QUERY,
      });

      const { data: footerData } = await client.query({
        query: FOOTER_MENU_QUERY,
      });

      const { data: siteSettingsData } = await client.query({
        query: SITE_SETTINGS_QUERY,
      });

      setHeaderMenuItems(headerData.menu.menuItems.nodes);
      setFooterMenuItems(footerData.menu.menuItems.nodes);
      setSiteSettings(siteSettingsData.siteSettings.siteSettings);
    };

    fetchMenuItems();
  }, []);

  return (
    <ApolloProvider client={client}>
      <Head>
        <link 
          href="//fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@200;400&family=Poppins:wght@300;400;500&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <Layout 
        menuItems={headerMenuItems} 
        footerMenuItems={footerMenuItems} 
        siteSettings={siteSettings}
      >
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
