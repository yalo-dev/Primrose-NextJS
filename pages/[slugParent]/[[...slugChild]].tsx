<<<<<<< HEAD:pages/[slugParent]/[[...slugChild]].tsx
import { useRouter } from 'next/router';
import { CommonPageComponent } from '../../app/components/templates/Layout/CommonPageComponent';
import { useQuery } from '@apollo/client';
import { client } from '../../app/lib/apollo';
import gql from 'graphql-tag';
import { getPageByUri, getAllPages } from '../../app/lib/pages';
=======
import {useRouter} from 'next/router';
import {CommonPageComponent} from '../app/components/templates/Layout/CommonPageComponent';
import {useQuery} from '@apollo/client';
import {client} from '../app/lib/apollo';
import gql from 'graphql-tag';
import {notFound} from 'next/navigation'
import Custom404 from "./404";
>>>>>>> ec033b165d72977a7e6ec736314c4b9460cd3b91:pages/[...pageId].tsx

const MODULES_QUERY = gql`
query GetModules($id: ID = "") {
	page(id: $id, idType: URI) {
	  uri
	  modules {
		modules {
			... on Page_Modules_Modules_BlockAndSlider {
				moduleId
				blurb
				heading
				image {
				  altText
				  sourceUrl
				}
				customizations {
				  bottomMarginDesktop
				  bottomMarginMobile
				  topMarginDesktop
				  topMarginMobile
				}
				slider {
				  blurb
				  fieldGroupName
				  title
				  icon {
					altText
					sourceUrl
				  }
				}
			  }
		  ... on Page_Modules_Modules_ClassroomSelectAndContent {
			moduleId
			accents {
			  accentOne {
				sourceUrl
			  }
			  accentTwo {
				sourceUrl
			  }
			}
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			  backgroundColorLeft
			  backgroundColorRight
			}
			leftColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  button {
				target
				title
				url
			  }
			  buttonStyle
			  image {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  dropdown {
				option {
				  target
				  title
				  url
				}
			  }
			}
		  }
		  ... on Page_Modules_Modules_ClassroomSelectAndImage {
			moduleId
			leftColumn {
			  image {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  heading
			  subheading
			  headingColor
			  subheadingColor
			  dropdown {
				option {
				  target
				  title
				  url
				}
			  }
			}
			accents {
			  accentOne {
				sourceUrl
			  }
			  accentTwo {
				sourceUrl
			  }
			}
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			  backgroundColorRight
			}
		  }
		  ... on Page_Modules_Modules_ContentWithSchoolhouse {
			moduleId
			editor
			customizations {
			  backgroundColor
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
          ... on Page_Modules_Modules_DynamicColumns {
              fieldGroupName
              columns {
				imageOrVideo
            	video {
              		target
              		title
              		url
            	}
                blurb
                fieldGroupName
                button {
                  buttonLink {
                    target
                    title
                    url
                  }
                  buttonStyle
                  fieldGroupName
                }
                image {
                  columnImage {
                    altText
                    sourceUrl
                  }
                  imageType
                }
                title {
					columnTitle
					headingLevel
					fieldGroupName
				  }
              }
              acfeFlexibleToggle
              customizations {
                bottomPaddingDesktop
                bottomPaddingMobile
                topPaddingDesktop
                topPaddingMobile
              }
              moduleId
            }
		  ... on Page_Modules_Modules_DynamicForm {
			headings {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			}
			moduleId
			formid
			portalid
			region
			version
			customizations {
			  outerBackgroundColor
			  topMarginMobile
			  topMarginDesktop
			  bottomMarginMobile
			  bottomMarginDesktop
			}
		  }
		  ... on Page_Modules_Modules_EyebrowHeadingSubheading {
			moduleId
			alignment
			eyebrow
			eyebrowColor
			heading
			headingColor
			headingSize
			subheading
			subheadingColor
			subheadingSize
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_FeaturedBlogs {
			moduleId
			heading
			headingColor
			blogs {
			  ... on Resource {
				id
				title
				uri
				slug
				featuredImage {
				  node {
					altText
					sourceUrl
				  }
				}
				excerpt
				date
				resourceTags {
				  nodes {
					slug
					link
					uri
					name
				  }
				}
				resourceTypes {
				  nodes {
					slug
					uri
					name
					link
				  }
				}
			  }
			}
			customizations {
			  backgroundColor
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_FeaturedSection {
			moduleId
			heading
			headingColor
			subheading
			subheadingColor
			customizations {
			  topMarginMobile
			  topMarginDesktop
			  bottomMarginMobile
			  bottomMarginDesktop
			  backgroundColor
			}
			slider {
			  blurb
			  blurbColor
			  title
			  titleColor
			  image {
				sourceUrl
				altText
			  }
			}
		  }
		  ... on Page_Modules_Modules_FindASchool {
			moduleId
			heading
			headingColor
			subheading
			subheadingColor
			button {
			  target
			  title
			  url
			}
			buttonStyle
			images {
			  image {
				sourceUrl
				altText
			  }
			}
			customizations {
			  backgroundColor
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_FindASchoolMap {
            center {
              latitude
              longitude
            }
            customizations {
              bottomPaddingDesktop
              bottomPaddingMobile
              topPaddingDesktop
              topPaddingMobile
            }
            heading
			headingColor
			backgroundColor
            moduleId
            schools {
              ... on School {
                id
                title
                uri
                slug
                schoolCorporateSettings {
				  schoolOfAtOn
                  schoolName
                  phoneNumber
                  address {
                    streetAddress
                    streetAddress2
                    city
                    state
                    zipcode
                    latitude
                    longitude
                  }
                  corporateChildcare
                  preopening
                  openingIn {
                    season
                  }
                }
                schoolAdminSettings {
                  hoursOfOperation {
                    closingTime
                    openingTime
                  }
                  enrollingNow
                }
              }
            }
          }
		  ... on Page_Modules_Modules_FourAcrossSlider {
			moduleId
			customizations {
			  backgroundColor
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
			fourAcrossSlider {
			  blurb
			  blurbColor
			  title
			  titleColor
			  image {
				sourceUrl
				altText
			  }
			}
		  }
		  ... on Page_Modules_Modules_GeneralButtonCta {
			moduleId
			icon {
			  sourceUrl
			  altText
			}
			heading
			headingColor
			subheading
			subheadingColor
			button {
			  target
			  title
			  url
			}
			accents {
			  accentOne {
				sourceUrl
			  }
			  accentTwo {
				sourceUrl
			  }
			}
			buttonStyle
			variation
			dropdown {
			  option {
				target
				title
				url
			  }
			}
			image {
			  sourceUrl
			  altText
			}
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_GeneralHorizontalTabs {
			moduleId
			tabs {
			  label
			  tabLabelColor
			  content {
				image {
				  sourceUrl
				  altText
				}
				heading
				headingColor
				subheading
				subheadingColor
				list {
				  icon {
					sourceUrl
				  }
				  text
				  textColor
				  detailsPopUp
				}
			  }
			}
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_GeneralVerticalTabs {
			moduleId
			customizations {
			  topMarginMobile
			  topMarginDesktop
			  bottomMarginMobile
			  bottomMarginDesktop
			  backgroundColor
			}
			tabs {
			  label
			  tabLabelColor
			  content {
				blurb
				blurbColor
				button {
				  target
				  title
				  url
				}
				buttonStyle
				fullWidthOrFeatured
				heading
				headingColor
				image {
				  sourceUrl
				  altText
				}
				subheading
				subheadingColor
				list {
				  textColor
				  text
				}
				table {
				  label
				  description
				}
				eyebrow
				eyebrowColor
			  }
			}
			heading
			headingColor
			subheading
			subheadingColor
		  }
		  ... on Page_Modules_Modules_HarmonyAndHeart {
			acfeFlexibleToggle
			fieldGroupName
			leftColumn {
			  displayMusicPlayer
			  heading
			  musicPlayer {
				artistAuthor
				audio {
				  url
				}
				coverImage {
				  altText
				  sourceUrl
				}
				trackTitle
			  }
			}
			moduleId
			rightHarmonyColumn {
			  musicCollection {
				appleMusicLink {
				  target
				  title
				  url
				}
				description
				image {
				  altText
				  sourceUrl
				}
				spotifyLink {
				  target
				  title
				  url
				}
				title
			  }
			}
		  }
		  ... on Page_Modules_Modules_HeroWithImage {
			moduleId
			leftColumn {
			  image {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  eyebrow
			  eyebrowColor
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  blurb
			  blurbColor
			  button {
				target
				title
				url
			  }
			  buttonStyle
			}
			accent {
			  sourceUrl
			}
			switchColumnOrderOnDesktop
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			  backgroundColor
			}
		  }
		  ... on Page_Modules_Modules_HeroWithVideo {
			moduleId
			leftColumn {
			  eyebrow
			  eyebrowColor
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  blurb
			  blurbColor
			  button {
				target
				title
				url
			  }
			  buttonStyle
			}
			rightColumn {
			  video {
				url
			  }
			}
			accent {
			  sourceUrl
			}
			switchColumnOrderOnDesktop
			customizations {
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			  backgroundColor
			}
		  }
		  ... on Page_Modules_Modules_HomeHeroWithVideo {
			moduleId
			customizations {
			  backgroundColor
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
			leftColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			}
			rightColumn {
			  video {
				target
				title
				url
			  }
			  videoOrImage
			  image {
				altText
				sourceUrl
			  }
			}
		  }
		  ... on Page_Modules_Modules_NewsletterFormCta {
			moduleId
			heading
			headingColor
			subheading
			subheadingColor
			accentOne {
			  sourceUrl
			}
			accentTwo {
			  sourceUrl
			}
			customizations {
			  backgroundColor
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_PathwayToOwnership {
			moduleId
			heading
			subheading
			subheadingColor
			headingColor
			image {
			  sourceUrl
			  altText
			}
			boxes {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  list {
				listItem
				listItemColor
			  }
			  icon {
				sourceUrl
			  }
			}
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_PrimroseFriends {
			moduleId
			tabs {
			  label
			  tabLabelColor
			  content {
				image {
				  sourceUrl
				  altText
				}
				name
				nameColor
				characterTrait
				traitColor
				bio
				watchNow
				videoUrl {
				  url
				  title
				  target
				}
				learnMore {
				  target
				  title
				  url
				}
			  }
			  friendColor
			}
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_Q1Skills {
			moduleId
			eyebrow
			eyebrowColor
			heading
			headingColor
			subheading
			subheadingColor
			list {
			  detailsPopUp
			  description
			  title
			  icon {
				sourceUrl
				altText
			  }
			}
			customizations {
			  backgroundColor
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_QuoteTestimonials {
			moduleId
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
			heading
			headingColor
			tabs {
			  avatar {
				sourceUrl
				altText
			  }
			  name
			  nameColor
			  position
			  positonColor
			  content {
				heading
				headingColor
				blurb
				blurbColor
			  }
			}
		  }
		  ... on Page_Modules_Modules_SeasonalBanner {
			moduleId
			accentOne {
			  sourceUrl
			}
			accentTwo {
			  sourceUrl
			}
			accentThree {
			  sourceUrl
			}
			image {
				sourceUrl
				altText
			}
			heading
			headingColor
			subheading
			subheadingColor
			button {
			  target
			  title
			  url
			}
			buttonStyle
			customizations {
			  backgroundColor
			  topPaddingMobile
			  bottomPaddingMobile
			  topPaddingDesktop
			  bottomPaddingDesktop
			}
		  }
		  ... on Page_Modules_Modules_StandardAccordionList {
			moduleId
			heading
			headingColor
			accordion {
			  question
			  questionColor
			  answer
			  answerColor
			}
			footnote
			footnoteColor
			accent {
			  sourceUrl
			}
			customizations {
			  backgroundColor
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_TestimonialsWithVideoOrImage {
			moduleId
			buttonStyle
			button {
			  target
			  title
			  url
			}
			heading
			headingColor
			subheading
			subheadingColor
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
			slider {
			  image {
				sourceUrl
				altText
			  }
			  position
			  positionColor
			  testimonial
			  testimonialColor
			  title
			  titleColor
			  imageOrVideo
			  video {
				target
				title
				url
			  }
			}
		  }
		  ... on Page_Modules_Modules_Timeline {
            customizations {
              bottomPaddingDesktop
              bottomPaddingMobile
              topPaddingDesktop
              topPaddingMobile
            }
            heading
            headingColor
            subheading
            subheadingColor
            tilesTitle
            tilesTitleColor
            tiles {
              tileBlurb
              tileTitle
              content {
                blurb
                blurbColor
                title
                titleColor
                switchColumns
                image {
                  altText
                  sourceUrl
                }
              }
            }
          }
		  ... on Page_Modules_Modules_TwoColumnsFeaturedBlock {
			moduleId
			leftColumn {
			  imageDesktop {
				sourceUrl
				altText
			  }
			  imageMobile {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  blurb
			  blurbColor
			  icon {
				sourceUrl
				altText
			  }
			}
			switchColumnOrderOnDesktop
			centerModule
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_TwoColumnsFeaturedImage {
			moduleId
			leftColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  blurb
			  blurbColor
			  buttonStyle
			  button {
				target
				title
				url
			  }
			}
			rightColumn {
			  image {
				sourceUrl
				altText
			  }
			  imageTwo {
				sourceUrl
				altText
			  }
			  content {
				imageOrVideo
				image {
				  sourceUrl
				  altText
				}
				video {
				  target
				  title
				  url
				}
			  }
			}
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_TwoColumnsGreenBackground {
			moduleId
			customizations {
			  topMarginMobile
			  topMarginDesktop
			  bottomMarginMobile
			  bottomMarginDesktop
			}
			leftColumn {
			  imageDesktop {
				sourceUrl
				altText
			  }
			  imageMobile {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  blurb
			  blurbColor
			  buttonStyle
			  button {
				target
				title
				url
			  }
			  heading
			  headingColor
			  subheading
			  subheadingColor
			}
		  }
		  ... on Page_Modules_Modules_TwoColumnsImageAndTextAlternative {
			moduleId
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
			switchColumnOrderOnDesktop
			leftColumn {
			  imageDesktop {
				sourceUrl
				altText
			  }
			  imageMobile {
				sourceUrl
				altText
			  }
			}
			rightColumn {
			  blurb
			  blurbColor
			  buttonStyle
			  button {
				target
				title
				url
			  }
			  heading
			  headingColor
			  subheading
			  subheadingColor
			}
		  }
		  ... on Page_Modules_Modules_TwoColumnsImageAndText {
			moduleId
			leftColumn {
			  imageDesktop {
				sourceUrl
				altText
			  }
			  imageMobile {
				sourceUrl
				altText
			  }
			  announcement {
				backgroundColor
				bottomLine
				midLine
				topLine
				bottomLineColor
				midLineColor
				topLineColor
			  }
			  imageOrVideo
			  video {
				target
				title
				url
			  }
			  showAnnouncementTile
			}
			rightColumn {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			  blurb
			  blurbColor
			  buttonStyle
			  button {
				target
				title
				url
			  }
			  buttonTwoStyle
			  buttonTwo {
				target
				title
				url
			  }
			  showDropdown
			  options {
				option {
				  target
				  title
				  url
				}
			  }
			}
			switchColumnOrderOnDesktop
			centerModule
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			}
		  }
		  ... on Page_Modules_Modules_WysiwygEditor {
			moduleId
			editor
			customizations {
			  bottomPaddingDesktop
			  bottomPaddingMobile
			  topPaddingDesktop
			  topPaddingMobile
			  outerBackgroundColor
			}
		  }
		}
	  }
	}
	resourcesSettings {
		resourceSettings {
		  featuredResources {
			... on Resource {
			  id
			  slug
			  uri
			}
		  }
		}
	  }
  }
`;

<<<<<<< HEAD:pages/[slugParent]/[[...slugChild]].tsx
const DynamicPage = ({page}) => {
	const router = useRouter();
	const { pageId } = router.query;
  
	let id: string | null = null;
	if (Array.isArray(pageId)) {
	  id = pageId.join('/');
	} else if (pageId) {
	  id = pageId;
	}
  
	const { loading, error, data } = useQuery(MODULES_QUERY, {
	  variables: { id },
	  client,
	  skip: !id, 
	});
  
	if (loading || !id) return <p></p>;
	if (error) return <p>Error: {error.message}</p>;
  
	const modules = page?.data?.page?.modules?.modules || [];

	return <CommonPageComponent modules={modules} />;
  };
  
  export async function getStaticProps({params}) {
	const { slugParent, slugChild, uri } = params;
	let pageUri = `/${slugParent}/`;
	if (Array.isArray(slugChild) && slugChild.length > 0) {
		pageUri = `${pageUri}${slugChild.join('/')}/`;
	}
	console.log("pageUri");
	console.log(uri);
	const page = await getPageByUri(pageUri); 
	return {
	  props: {
		page,
	  },
	  revalidate: 10,
	};
  }
=======
const DynamicPage = ({testProp}) => {
    const router = useRouter();
    const {pageId} = router.query;

    let id: string | null = null;
    if (Array.isArray(pageId)) {
        id = pageId.join('/');
    } else if (pageId) {
        id = pageId;
    }

    const {loading, error, data} = useQuery(MODULES_QUERY, {
        variables: {id},
        client,
        skip: !id,
    });

    if (loading || !id) return <p></p>;
    if (error) return <p>Error: {error.message}</p>;

    const modules = data?.page?.modules?.modules || [];

    // Wordpress will best match the uri with whatever slug is provided (i.e. open-a-school will pull a query for franchising/open-a-school)
    // This validates an exact match and throws 404 if not exact
    if (!(`/${id}/` === data?.page?.uri)) return <Custom404/>

    return <CommonPageComponent modules={modules}/>;
};
>>>>>>> ec033b165d72977a7e6ec736314c4b9460cd3b91:pages/[...pageId].tsx


  export async function getStaticPaths() {
	const pages = await getAllPages();
	const dynamicPages = pages.filter(
		(el) => el?.node.uri.length > 1
	  );
	  const paths = dynamicPages.map((page) => {
        const segments = page.node.uri.split('/').filter((seg) => seg !== '');
		let slugParent = segments.shift();
		let slugChild = segments;
		console.log(page.node.uri);
			return {
			params: {
				slugParent: slugParent,
				slugChild: slugChild,
				uri: page.uri
			},
			};
	  });
  
	return {
	  paths,
	  fallback: 'blocking'
	};
  }

export default DynamicPage;