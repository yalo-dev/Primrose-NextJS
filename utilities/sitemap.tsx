import {gql} from "@apollo/client";

export function generateSitemap(nodes, domain) {
    const urls = nodes.map((node) => {
        const imageTag = node.featuredImage?.node?.sourceUrl
            ? `
                <image:image>
                    <image:loc>${node.featuredImage?.node?.sourceUrl}</image:loc>
                </image:image>
            ` : ""
        return `
          <url>
            <loc>${domain}${node.uri}</loc>
            <lastmod>${node.modifiedGmt}</lastmod>
            ${imageTag}
          </url>
        `
    }).join('')

    return `
        <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
            ${urls}
        </urlset>
    `
}

export const GET_PAGES_SITEMAP = gql`
    query GetPagesSitemap {
      pages(first: 100000) {
        nodes {
          uri
          modifiedGmt
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
`

export const GET_SCHOOLS_SITEMAP = gql`
    query GetSchoolsSitemap {
      schools(first: 100000) {
        nodes {
          featuredImage {
            node {
              sourceUrl
            }
          }
          modifiedGmt
          uri
          schoolAdminSettings {
            classroomsOffered
            staffMembers {
              name
            }
          }
        }
      }
    }
`

export const GET_RESOURCES_SITEMAP = gql`
    query GetResourcesSitemap {
      resources(first: 100000) {
        nodes {
          uri
          modifiedGmt
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }   
`

export const GET_MARKETS_SITEMAP = gql`
    query GetMarketsSitemap {
      schools(first: 1000, where: {orderby: {field: TITLE, order: ASC}}) {
        nodes {
          markets {
            nodes {
              uri
            }
          }
          modifiedGmt
        }
      }
    }
`