import { useQuery, gql } from '@apollo/client';
import Tag from '../../atoms/Tag/Tag';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Newsletter from '../Newsletter/Newsletter';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterFormBanner from '../ResourceNewsletter/ResourceNewsletter';
import CTABanner from '../CTABanner/CTABanner';


const GET_RESOURCE_BY_URI = gql`
query GetResourceByURI($id: ID!) {
        resource(id: $id, idType: URI) {
          featuredImage {
            node {
              sourceUrl
            }
          }
          title
          date
          resourceTypes {
            nodes {
              name
              slug
            }
          }
          resourceTags {
            nodes {
              name
              slug
            }
          }
          resources {
            displayAuthor
            author {
              name
            }
            content
            relatedArticles {
              ... on Resource {
                id
                date
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                title
                slug
                uri
                resourceTags {
                  nodes {
                    name
                    slug
                  }
                }
                resourceTypes {
                  nodes {
                    name
                    slug
                  }
                }
              }
            }
            
            ctaHeading
            ctaButton {
              url
              title
              target
            }
            newsletterHeading
            newsletterSubheading
          }
        }
      
}
`;

// Function to calculate reading time
const calculateReadingTime = (text) => {
    const words = text.split(/\s+/g).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
};


export default function ResourceComponent({ singleSlug }) {
    const { loading, error, data } = useQuery(GET_RESOURCE_BY_URI, {
        variables: { id: singleSlug }
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const resource = data?.resource;

    if (!resource) return <div>No Resource Found</div>;

    const { featuredImage, title, date, resourceTypes, resourceTags, resources } = resource;
    const { displayAuthor, author, content, relatedArticles, ctaHeading, ctaButton, newsletterHeading, newsletterSubheading } = resources || {};

    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));

    const readingTime = content ? calculateReadingTime(content.replace(/(<([^>]+)>)/ig, '')) : ''; // Remove HTML tags for accurate word count
    
    const wrapIframesInResponsiveDiv = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const iframes = doc.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            const wrapper = doc.createElement('div');
            wrapper.className = 'responsive-video';
            iframe.parentNode?.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
        });

        return doc.body.innerHTML;
    }

    let wrappedContent = content ? wrapIframesInResponsiveDiv(content) : '';


    return (
        <>
            <div className='resource'>
                <div className='hero container p-0'>
                    <div className='inner d-lg-flex align-items-lg-center justify-content-lg-center'>
                        <div className='image-wrapper position-relative overflow-hidden pb-4 pb-lg-0'>
                            {featuredImage?.node?.sourceUrl && <img src={featuredImage.node.sourceUrl} alt="Featured" />}
                        </div>
                        <div className='content-wrapper ps-4 pe-4 position-relative'>
                            <div className='details d-flex justify-start align-items-center'>
                              {resourceTypes.nodes.length > 0 && (
                                <div className='caption position-relative me-3'>
                                    {resourceTypes.nodes.map((type, index) => (
                                        <div key={index}>{type.name}</div>
                                    ))}
                                </div>
                            )}
                                {date && <div className='date mb-0'>{formattedDate}</div>}
                            </div>
                            <div className='title pt-2 pb-2'>{title && <h1>{title}</h1>}</div>
                            <div className='utils-wrapper pt-2 pb-4'>
                                {displayAuthor && author?.name && <div className='author'>Author: {author.name}</div>}
                                {readingTime && <div className='read-time'>{readingTime}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='social d-flex justify-center flex-xl-column mt-4 mb-4'>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/assets/fb.png"
                            alt="Facebook"
                            width={40}
                            height={40}
                        />
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/assets/x.png"
                            alt="Twitter"
                            width={40}
                            height={40}
                        />
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/assets/li.png"
                            alt="LinkedIn"
                            width={40}
                            height={40}
                        />
                    </Link>
                </div>

                <div className='content p-4 mx-auto'>
                {wrappedContent && <div dangerouslySetInnerHTML={{ __html: wrappedContent }} />}
                </div>

                {resourceTags.nodes.length > 0 && (
                    <div className='tags'>
                        <div className='container ps-4 pe-4 ps-lg-0 pe-lg-0 mx-auto d-flex'>
                            {resourceTags.nodes.map((tag, index) => (
                                <Tag key={index} label={tag.name} />
                            ))}
                        </div>
                    </div>
                )}

                {relatedArticles?.length > 0 && (
                    <div className='related'>
                        <div className='container ps-4 pe-4 pt-4 mt-4 mb-4'>
                            <h2>Related Articles</h2>
                            <div className='d-flex flex-column flex-xl-row justify-content-between gap-4'>
                                {relatedArticles.map((relatedArticle, index) => (
                                    <ResourceCard
                                        key={index}
                                        resource={relatedArticle}
                                        showFeaturedImage={true}
                                        className="medium"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {newsletterHeading && (
            <NewsletterFormBanner
                newsletterHeading={newsletterHeading}
                newsletterSubheading={newsletterSubheading}
            />
            )}
            {ctaHeading && (
            <CTABanner
                ctaHeading={ctaHeading}
                ctaButton={ctaButton}
            />
            )}
            <Newsletter />
        </>
    );
}
