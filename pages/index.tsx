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
            }
          }
          customizations {
            backgroundColor
            topMarginMobile
            topMarginDesktop
            bottomMarginMobile
            bottomMarginDesktop
          }
        }
        ... on Page_Modules_Modules_GeneralButtonCta {
          accents {
            accentOne {
            sourceUrl
            }
            accentTwo {
            sourceUrl
            }
          }
          icon {
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
          variation
          customizations {
            topMarginMobile
            bottomMarginMobile
            topMarginDesktop
            bottomMarginDesktop
          }
        }
        ... on Page_Modules_Modules_GeneralHorizontalTabs {
          tabs {
            label
            tabLabelColor
            content {
              image {
                sourceUrl
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
        ... on Page_Modules_Modules_HeroWithImage {
          leftColumn {
            image {
              sourceUrl
            }
          }
          rightColumn {
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
            topMarginMobile
            bottomMarginMobile
            topMarginDesktop
            bottomMarginDesktop
            backgroundColor
          }
        }
        ... on Page_Modules_Modules_HeroWithVideo {
          leftColumn {
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
            topMarginMobile
            bottomMarginMobile
            topMarginDesktop
            bottomMarginDesktop
            backgroundColor
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
            bottomMarginDesktop
            bottomMarginMobile
            topMarginDesktop
            topMarginMobile
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
            }
          }
          customizations {
            backgroundColor
            bottomMarginDesktop
            bottomMarginMobile
            topMarginDesktop
            topMarginMobile
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
            bottomMarginDesktop
            bottomMarginMobile
            topMarginDesktop
            topMarginMobile
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
            customizations {
              backgroundColor
              bottomMarginDesktop
              bottomMarginMobile
              topMarginDesktop
              topMarginMobile
            }
            
          }
          rightColumn {
            image {
              sourceUrl
            }
          }
        }
        ... on Page_Modules_Modules_TwoColumnsImageAndText {
          leftColumn {
            imageDesktop {
              sourceUrl
            }
            imageMobile {
              sourceUrl
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
          }
          switchColumnOrderOnDesktop
          customizations {
            backgroundColor
            bottomMarginDesktop
            bottomMarginMobile
            topMarginDesktop
            topMarginMobile
          }
        }
        ... on Page_Modules_Modules_WysiwygEditor {
          editor
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

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	console.log('Fetched Data:', data);
	console.log('Modules:', data.page.modules.modules);

	const modules = data?.page?.modules?.modules || [];

	return <CommonPageComponent modules={modules} />;
};

export default HomePage;
