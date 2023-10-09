import { useRouter } from 'next/router';
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
      }
    }
  }
}
`;

const DynamicPage = () => {
    const router = useRouter();
    const { pageId } = router.query;
  
    const { loading, error, data } = useQuery(GET_MODULES, {
      variables: { id: String(pageId) },
      client,
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const modules = data?.page?.modules?.modules || [];
  
    return <CommonPageComponent modules={modules} />;
  };
  
  export default DynamicPage;