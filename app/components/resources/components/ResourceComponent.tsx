import { useQuery, gql } from '@apollo/client';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import ResourceMenu from '../../organisms/ResourcesMenu/ResourcesMenu';
import Newsletter from '../../modules/Newsletter/Newsletter';
import Image from 'next/image';
import Link from 'next/link';
import Tag from '../../atoms/Tag/Tag';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Button from '../../atoms/Button/Button';

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

    return (
        <>
            <ResourceMenu />
            <div className='resource'>
                <div className='hero'>
                    <div className='inner'>
                        <div className='image-wrapper pb-4 pb-lg-0'>
                            {featuredImage?.node?.sourceUrl && <img src={featuredImage.node.sourceUrl} alt="Featured" />}
                        </div>
                        <div className='content-wrapper ps-4 pe-4'>
                            <div className='details-wrapper'>{resourceTypes.nodes.length > 0 && (
                                <div className='type'>
                                    {resourceTypes.nodes.map((type, index) => (
                                        <div key={index}>{type.name}</div>
                                    ))}
                                </div>
                            )}
                                {date && <div className='date'>{formattedDate}</div>}
                            </div>
                            <div className='title pt-2 pb-2'>{title && <h1>{title}</h1>}</div>
                            <div className='utils-wrapper pt-2 pb-4'>
                                {displayAuthor && author?.name && <div className='author'>Author: {author.name}</div>}
                                {readingTime && <div className='read-time'>{readingTime}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='social'>
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

                <div className='content p-4'>
                    {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
                </div>

                {resourceTags.nodes.length > 0 && (
                    <div className='tags'>
                        <div className='container ps-4 pe-4 m-auto'>
                            {resourceTags.nodes.map((tag, index) => (
                                <Tag key={index} label={tag.name} />
                            ))}
                        </div>
                    </div>
                )}

                {relatedArticles?.length > 0 && (
                    <div className='related'>
                        <div className='container ps-4 pe-4 mt-4 mb-4'>
                            <h2>Related Articles</h2>
                            <div className='d-lg-flex justify-content-between'>
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
            {newsletterHeading && newsletterSubheading && (
                <div className='newsletter-form-wrapper'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 col-lg-6 top'>
                                <Image
                                    src="/assets/parent-signup-graphic.png"
                                    alt="family of mom dad and child"
                                    width={200}
                                    height={200}
                                />
                            </div>
                            <div className='col-12 col-lg-6 bottom'>
                                <h2>{newsletterHeading}</h2>
                                <p>{newsletterSubheading}</p>
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {ctaHeading && ctaButton?.url && (
                <div className='cta-banner ps-4 pe-4 ps-lg-5 pe-lg-5'>
                    <div className='accents container'></div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 top'>
                                <Image
                                    src="/assets/cta-banner-bg.png"
                                    alt="teacher teaching a child"
                                    width={200}
                                    height={200}
                                />
                            </div>

                            <div className='col-12 bottom'>
                                <h2>{ctaHeading}</h2>
                                <Button
                                    variant="white"
                                    label={ctaButton.title}
                                    href={ctaButton.url}
                                    target={ctaButton.target}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Newsletter />
        </>
    );
}
