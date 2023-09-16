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
          ... on Page_Modules_Modules_Hero {
            backgroundColor
            backgroundImage {
              sourceUrl
            }
            heading
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
          ... on Page_Modules_Modules_Cta {
            backgroundColor
            backgroundImage {
              sourceUrl
            }
            heading
            subheading
            blurb
            button {
              target
              title
              url
            }
          }
          ... on Page_Modules_Modules_ContactFormWithImage {
            backgroundColor
            backgroundImage {
              sourceUrl
            }
            leftColumn {
              heading
              subheading
              blurb
              formId
            }
            rightColumn {
              image {
                sourceUrl
              }
            }
          }
          ... on Page_Modules_Modules_FeaturedBlogs {
            backgroundColor
            backgroundImage {
              sourceUrl
            }
            heading
            subheading
            blurb
            blogs {
              ... on Post {
                id
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                title
                excerpt
                uri
              }
            }
          }
          ... on Page_Modules_Modules_StandardAccordionList {
            heading
            faqs {
              question
              answer
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