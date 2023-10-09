import { CommonPageComponent } from '../app/components/templates/Layout/CommonPageComponent';
import { useQuery } from '@apollo/client';
import { client } from '../app/lib/apollo';
import gql from 'graphql-tag';


const GET_MODULES = gql`
query GetModules($id: ID = "") {
  page(id: $id, idType: URI) {
    modules {
      modules {
        ... on Page_Modules_Modules_HeroWithImage {
          accent {
            sourceUrl
          }
          switchColumnOrderOnDesktop
          leftColumn {
            image {
              sourceUrl
            }
          }
          rightColumn {
            heading
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
        }
        ... on Page_Modules_Modules_HeroWithVideo {
          accent {
            sourceUrl
          }
          switchColumnOrderOnDesktop
          leftColumn {
            heading
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
          rightColumn {
            video {
              url
            }
          }
        }
        ... on Page_Modules_Modules_PointersForParents {
          pfpHeading
          pfpSubheading
        }
        ... on Page_Modules_Modules_SeasonalBanner {
          seasonalHeading
          seasonalSubheading
          seasonalButton {
            target
            title
            url
          }
        }
        ... on Page_Modules_Modules_TwoColumnsFeaturedImage {
          leftColumn {
            heading
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
          rightColumn {
            image {
              sourceUrl
            }
          }
        }
        ... on Page_Modules_Modules_TwoColumnsImageAndText {
          switchColumnOrderOnDesktop
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
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
        }
        ... on Page_Modules_Modules_GeneralButtonCta {
          heading
          subheading
          button {
            target
            title
            url
          }
          icon {
            sourceUrl
          }
          variation
        }
        ... on Page_Modules_Modules_StandardAccordionList {
          heading
          footnote
          accordion {
            question
            answer
          }
        }
        ... on Page_Modules_Modules_GeneralHorizontalTabs {
          tabs {
            label
            content {
              image {
                sourceUrl
              }
              heading
              subheading
              list {
                icon {
                  sourceUrl
                }
                text
              }
            }
          }
        }
        ... on Page_Modules_Modules_WysiwygEditor {
          editor
        }
        ... on Page_Modules_Modules_Q1Skills {
          eyebrow
          heading
          subheading
          list {
            detailsPopUp
            description
            title
            icon {
              sourceUrl
            }
          }
        }
        ... on Page_Modules_Modules_FindASchool {
          heading
          subheading
          images {
            image {
              sourceUrl
            }
          }
          button {
            target
            title
            url
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
          }
        }
        ... on Page_Modules_Modules_ClassroomSelectAndContent {
          leftColumn {
            heading
            subheading
            button {
              url
              title
              target
            }
            image {
              sourceUrl
            }
          }
          rightColumn {
            heading
            subheading
          }
        }
      }
    }
  }
}
`;

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_MODULES, {
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
