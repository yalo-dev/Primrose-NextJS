import { useQuery, gql } from '@apollo/client';
import Tag from '../../atoms/Tag/Tag';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterFormBanner from '../ResourceNewsletter/ResourceNewsletter';
import CTABanner from '../CTABanner/CTABanner';


const GET_RESOURCE_BY_URI = gql`
query GetResourceByURI($id: ID!) {
  resource(id: $id, idType: URI) {
    author {
      node {
        name
      }
    }
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

  const { author, featuredImage, title, date, resourceTypes, resourceTags, resources } = resource;
  const { displayAuthor, content, relatedArticles, ctaHeading, ctaButton, newsletterHeading, newsletterSubheading } = resources || {};

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
                {date && <div className='date mb-0'><p className='b1 mb-0'>{formattedDate}</p></div>}
              </div>
              <div className='title pt-2 pb-2'>{title && <h1>{title}</h1>}</div>
              <div className='utils-wrapper pt-2 pb-4 d-flex align-items-center justify-content-between'>
              
                {displayAuthor && author?.node?.name && <div className='author'>{author.node.name}</div>}
     
                {readingTime && <div className='read-time'><p className='b1 mb-0'>{readingTime}</p></div>}
              </div>
            </div>
          </div>
        </div>
        <div className='social d-flex justify-center flex-xl-column mt-4 mb-4'>
        <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(singleSlug)}`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#373A36" strokeDasharray="2 2" />
              <path d="M17.1941 20.4058H18.5135V25.8334C18.5135 25.9405 18.6004 26.0273 18.7076 26.0273H20.9446C21.0519 26.0273 21.1388 25.9405 21.1388 25.8334V20.4313H22.6555C22.7541 20.4313 22.8371 20.3574 22.8483 20.2595L23.0787 18.2613C23.085 18.2064 23.0676 18.1513 23.0308 18.1101C22.9939 18.0688 22.9412 18.0451 22.8859 18.0451H21.1388V16.7926C21.1388 16.415 21.3423 16.2235 21.7436 16.2235C21.8008 16.2235 22.8859 16.2235 22.8859 16.2235C22.9931 16.2235 23.08 16.1367 23.08 16.0296V14.1954C23.08 14.0883 22.9931 14.0014 22.8859 14.0014H21.3117C21.3006 14.0009 21.2759 14 21.2396 14C20.9664 14 20.017 14.0536 19.267 14.743C18.4361 15.507 18.5516 16.4218 18.5792 16.5804V18.0451H17.1941C17.0869 18.0451 17 18.1319 17 18.2391V20.2117C17 20.3189 17.0869 20.4058 17.1941 20.4058Z" fill="#373A36" />
            </svg>
          </Link>
          <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(singleSlug)}&text=${encodeURIComponent(resource.title)}`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#373A36" strokeDasharray="2 2" />
              <path d="M15.0258 15L19.1137 20.466L15 24.91H15.9258L19.5274 21.0192L22.4374 24.91H25.5881L21.2701 19.1366L25.0992 15H24.1733L20.8565 18.5834L18.1765 15H15.0258ZM16.3873 15.682H17.8348L24.2263 24.2279H22.7789L16.3873 15.682Z" fill="#373A36" />
            </svg>
          </Link>
          <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(singleSlug)}&title=${encodeURIComponent(resource.title)}&summary=${encodeURIComponent(resource.resources.content.substring(0, 150))}&source=YourWebsiteName`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#373A36" strokeDasharray="2 2" />
              <path fillRule="evenodd" clipRule="evenodd" d="M25.4 24.3561H22.8804V20.7155C22.8804 19.7626 22.4863 19.112 21.6197 19.112C20.9568 19.112 20.5881 19.551 20.4165 19.9741C20.3522 20.126 20.3622 20.3375 20.3622 20.549V24.3561H17.8661C17.8661 24.3561 17.8983 17.9071 17.8661 17.3209H20.3622V18.4251C20.5097 17.9423 21.3073 17.2533 22.5802 17.2533C24.1593 17.2533 25.4 18.2652 25.4 20.4443V24.3561ZM15.3419 16.441H15.3258C14.5215 16.441 14 15.9032 14 15.2215C14 14.5265 14.5369 14 15.3573 14C16.177 14 16.6811 14.5252 16.6972 15.2195C16.6972 15.9012 16.177 16.441 15.3419 16.441ZM14.2875 17.3209H16.5095V24.3561H14.2875V17.3209Z" fill="#373A36" />
            </svg>
          </Link>
        </div>

        <div className='content p-4 mx-auto'>
          {wrappedContent && <div dangerouslySetInnerHTML={{ __html: wrappedContent }} />}
        </div>

        {resourceTags.nodes.length > 0 && (
          <div className='tags'>
            <div className='container ps-4 pe-4 ps-lg-0 pe-lg-0 mx-auto d-flex'>
              {resourceTags.nodes.map((tag, index) => (
                <Link href="/resources/#all"><Tag key={index} label={tag.name} /></Link>
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
    </>
  );
}
