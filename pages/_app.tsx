import { useEffect, useState, createContext, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/styles/globals.scss';
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../app/lib/apollo";
import Layout from '../app/components/templates/Layout/Layout';
import { gql } from '@apollo/client';
import Head from "next/head";
import { LoadScript, useJsApiLoader } from '@react-google-maps/api';
import ErrorBoundary from "../app/components/organisms/ErrorBoundary";
import parse from "html-react-parser";


const GOOGLE_MAP_LIBRARIES: ("places")[] = ['places'];

export const SliderSpeed = createContext(null);

function MyApp({ Component, pageProps }) {
	//console.log(pageProps);
	const [headerMenuItems, setHeaderMenuItems] = useState([]);
	const [footerMenuItems, setFooterMenuItems] = useState([]);
	const [siteSettings, setSiteSettings] = useState(null);

	const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
        libraries: GOOGLE_MAP_LIBRARIES,
      }); 

	useEffect(() => {

		if (process.env.NODE_ENV === 'development') {
			(window as any).resetApolloCache = () => {
				client.resetStore();
				console.log('Apollo cache reset.');
			};
		}

		const fetchMenuItems = async () => {
			// header menu query
			const HEADER_MENU_QUERY = gql`
			query HeaderMenu {
				menu(id: "4", idType: DATABASE_ID) {
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

	let seo = null;
	if(pageProps.page){
		seo = parse(pageProps.page.data.page.seo.fullHead);
	}else if(pageProps.school){
		if(pageProps.data?.classroom.seo){
			seo = parse(pageProps.data.classroom.seo.fullHead);
		}
		else if(pageProps.school.seo){
			seo = parse(pageProps.school.seo.fullHead);
		}
	}else if(pageProps.seo){
		seo = parse(pageProps.seo.contentTypes.resource.archive.fullHead);
	}else if(pageProps.resources?.resourceType?.seo){
		seo = parse(pageProps.resources.resourceType.seo.fullHead);
	}else if(pageProps.resources?.resourceTag?.seo){
		seo = parse(pageProps.resources.resourceTag.seo.fullHead);
	}else if(pageProps.resource?.seo){
		seo = parse(pageProps.resource.seo.fullHead);
	}else if(pageProps.locationsSeo){
		seo = parse(
			`<title>${pageProps.locationsSeo.title}</title>
			<meta name="description" content="${pageProps.locationsSeo.description}" />`
			
		);
	}
	return (
		<ErrorBoundary>
			<ApolloProvider client={client}>
				<Head>

					<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
					{seo}
				</Head>
				<SliderSpeed.Provider value={siteSettings?.carouselRotationTiming}>
					<Layout
						menuItems={headerMenuItems}
						footerMenuItems={footerMenuItems}
						siteSettings={siteSettings}
					>

						{isLoaded && (
							<Component {...pageProps} />
						)}
					</Layout>
				</SliderSpeed.Provider>
			</ApolloProvider>
		</ErrorBoundary>
	);
}

export default MyApp;
