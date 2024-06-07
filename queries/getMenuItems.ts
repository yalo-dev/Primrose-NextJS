import { gql, useQuery } from "@apollo/client";

const getMenuItems = async () => {
  const { data: layoutData } = await useQuery(LAYOUT_QUERY);
  return layoutData;
};

export const LAYOUT_QUERY = gql`
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

export default getMenuItems;
