import { CommonPageComponent } from '../app/components/templates/Layout/CommonPageComponent';
import { useQuery } from '@apollo/client';
import { client } from '../app/lib/apollo';
import gql from 'graphql-tag';


const MODULES_QUERY = gql`
query GetModules($id: ID = "") {
	page(id: $id, idType: URI) {
	  modules {
		modules {
		  ... on Page_Modules_Modules_ClassroomSelectAndContent {
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
		  ... on Page_Modules_Modules_DynamicForm {
			headings {
			  heading
			  headingColor
			  subheading
			  subheadingColor
			}
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
		  ... on Page_Modules_Modules_FeaturedSection {
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
			  accentLeftOrRight
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
		  ... on Page_Modules_Modules_FourAcrossSlider {
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
		  ... on Page_Modules_Modules_HeroWithImage {
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
			}
		}
		  ... on Page_Modules_Modules_NewsletterFormCta {
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
			accentOne {
			  sourceUrl
			}
			accentTwo {
			  sourceUrl
			}
			accentThree {
			  sourceUrl
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
		  ... on Page_Modules_Modules_TwoColumnsFeaturedImage {
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
  }
`;

const HomePage = () => {
  const { loading, error, data } = useQuery(MODULES_QUERY, {
    variables: { id: 'home' },
    client,
  });

  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;

//   console.log('Fetched Data:', data);
//   console.log('Modules:', data.page.modules.modules);

  const modules = data?.page?.modules?.modules || [];

  return <CommonPageComponent modules={modules} />;
};

export default HomePage;
