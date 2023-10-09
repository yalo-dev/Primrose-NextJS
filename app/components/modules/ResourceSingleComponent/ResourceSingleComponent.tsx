import { useQuery, gql } from '@apollo/client';
import Tag from '../../atoms/Tag/Tag';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Link from 'next/link';
import PoinersForParents from '../PointersForParents/PointersForParents';
import SeasonalBanner from '../SeasonalBanner/SeasonalBanner';
import Heading from '../../atoms/Heading/Heading';


interface ResourceType {
  slug: string;
  name: string;
}

interface ResourceTagType {
  slug: string;
  name: string;
}

interface Resource {
  resourceTags: {
    nodes: ResourceTagType[];
  };
}

const GET_SINGLE_RESOURCE = gql`
query GetSingleResource($id: ID!) {
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
    resourceFields {
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
      pfpHeading
      pfpSubheading
      seasonalHeading
      seasonalSubheading
      seasonalButton {
        target
        title
        url
      }
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
  const { loading, error, data, refetch } = useQuery(GET_SINGLE_RESOURCE, {
    variables: { id: singleSlug }
 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data);
  const resource = data?.resource;

  if (!resource) return <div>No Resource Found</div>;

  const { author, featuredImage, title, date, resourceTypes, resourceTags, resourceFields } = resource;
  const { displayAuthor, content, relatedArticles, seasonalHeading, seasonalSubheading, seasonalButton, pfpHeading, pfpSubheading } = resourceFields || {};

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

  const sortedTags = [...resource.resourceTags.nodes].sort((a: ResourceTagType, b: ResourceTagType) =>
    a.slug === 'featured' ? -1 : b.slug === 'featured' ? 1 : 0
  );

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
              {title && <div className='title pt-2 pb-2'><Heading level='h1'>{title}</Heading></div>}
              
              {displayAuthor || readingTime ? (
                <div className='utils-wrapper pt-2 pb-4 d-flex align-items-center justify-content-between'>
                  {displayAuthor && author?.node?.name && <div className='author'>By: {author.node.name}</div>}
                  {readingTime && <div className='read-time'><p className='b1 mb-0'>{readingTime}</p></div>}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className='social d-flex justify-content-center flex-xl-column mt-4 mb-4'>
          <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(singleSlug)}`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#5E6738" strokeDasharray="2 2" />
              <path d="M27 20.0429C27 16.1531 23.8661 13 20.0009 13C16.1339 13.0009 13 16.1531 13 20.0437C13 23.5582 15.5599 26.4716 18.9055 27V22.0787H17.1295V20.0437H18.9073V18.4908C18.9073 16.7262 19.9528 15.7515 21.5512 15.7515C22.3176 15.7515 23.1181 15.8889 23.1181 15.8889V17.6212H22.2353C21.3666 17.6212 21.0954 18.1645 21.0954 18.7218V20.0429H23.0359L22.7262 22.0779H21.0945V26.9991C24.4401 26.4707 27 23.5573 27 20.0429Z" fill="black" />
            </svg>

          </Link>
          <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(singleSlug)}&text=${encodeURIComponent(resource.title)}`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.8716 16.5793L21.9894 23.4207H23.1482L18.0305 16.5793H16.8716Z" fill="black" />
              <path d="M20 13C16.134 13 13 16.134 13 20C13 23.866 16.134 27 20 27C23.866 27 27 23.866 27 20C27 16.134 23.866 13 20 13ZM21.7161 23.9673L19.3862 20.852L16.5025 23.9673H15.7613L19.055 20.4091L15.782 16.0327H18.3046L20.4503 18.9018L23.106 16.0327H23.8472L20.7815 19.3448L24.2387 23.9673H21.7161Z" fill="black" />
              <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#5E6738" strokeDasharray="2 2" />
            </svg>

          </Link>
          <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(singleSlug)}&title=${encodeURIComponent(resource.title)}&summary=${encodeURIComponent(resource.resourceFields.content.substring(0, 150))}&source=PrimroseSchools`} target="_blank" rel="noopener noreferrer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_59_5814)">
                <circle opacity="0.2" cx="20" cy="20" r="19.5" stroke="#5E6738" strokeDasharray="2 2" />
                <g clipPath="url(#clip1_59_5814)">
                  <path d="M28.1456 26.1122C28.1821 26.1125 28.2182 26.1056 28.2518 26.0919C28.2854 26.0782 28.3157 26.0579 28.3408 26.0324C28.366 26.0068 28.3855 25.9766 28.398 25.9435C28.4106 25.9104 28.416 25.8751 28.4139 25.8399C28.4139 25.6468 28.2935 25.5545 28.0465 25.5545H27.6475V26.5655H27.7976V26.1248H27.982L27.9862 26.1302L28.2725 26.5655H28.433L28.125 26.115L28.1456 26.1122ZM27.972 26.0109H27.798V25.6691H28.0186C28.1326 25.6691 28.2625 25.6871 28.2625 25.8315C28.2625 25.9976 28.131 26.0109 27.9712 26.0109M24.2302 24.8451H22.1018V21.6193C22.1018 20.8501 22.0876 19.8598 20.9948 19.8598C19.8863 19.8598 19.7167 20.698 19.7167 21.5633V24.8449H17.5882V18.2113H19.6315V19.1179H19.6601C19.8646 18.7795 20.1601 18.5011 20.5151 18.3124C20.8701 18.1237 21.2714 18.0318 21.6761 18.0463C23.8334 18.0463 24.2311 19.4196 24.2311 21.206L24.2302 24.8451ZM15.1867 17.3045C14.9424 17.3046 14.7036 17.2345 14.5004 17.1032C14.2973 16.9719 14.1389 16.7852 14.0454 16.5668C13.9519 16.3484 13.9274 16.1081 13.975 15.8762C14.0226 15.6443 14.1402 15.4313 14.3129 15.2641C14.4856 15.0969 14.7057 14.983 14.9453 14.9368C15.1849 14.8907 15.4332 14.9143 15.6589 15.0047C15.8846 15.0952 16.0776 15.2483 16.2133 15.4449C16.3491 15.6415 16.4216 15.8726 16.4216 16.109C16.4216 16.2659 16.3897 16.4214 16.3277 16.5664C16.2656 16.7115 16.1747 16.8433 16.06 16.9543C15.9453 17.0653 15.8092 17.1534 15.6593 17.2135C15.5095 17.2736 15.3489 17.3045 15.1867 17.3045ZM16.2509 24.8451H14.1202V18.2113H16.2509V24.8451ZM25.2913 13.0009H13.0507C12.7729 12.9979 12.5052 13.1017 12.3064 13.2896C12.1077 13.4775 11.9941 13.7341 11.9907 14.003V25.8985C11.994 26.1675 12.1075 26.4242 12.3062 26.6123C12.505 26.8004 12.7728 26.9044 13.0507 26.9016H25.2913C25.5699 26.9049 25.8384 26.8012 26.0379 26.6131C26.2375 26.425 26.3517 26.168 26.3556 25.8985V14.0021C26.3516 13.7327 26.2373 13.4759 26.0377 13.288C25.8382 13.1001 25.5697 12.9965 25.2913 13.0001" fill="black" />
                  <path d="M27.9901 25.1041C27.7312 25.1065 27.4837 25.2081 27.3019 25.3866C27.1201 25.5651 27.0188 25.806 27.02 26.0566C27.0213 26.3072 27.125 26.5472 27.3086 26.724C27.4921 26.9008 27.7406 27 27.9995 27C28.2585 27 28.5069 26.9008 28.6905 26.724C28.874 26.5472 28.9778 26.3072 28.979 26.0566C28.9803 25.806 28.8789 25.5651 28.6971 25.3866C28.5153 25.2081 28.2679 25.1065 28.009 25.1041H27.9901ZM27.9901 26.8915C27.8203 26.8942 27.6534 26.8481 27.5106 26.7591C27.3678 26.67 27.2555 26.542 27.1879 26.3912C27.1203 26.2404 27.1004 26.0735 27.1307 25.9118C27.1611 25.75 27.2404 25.6006 27.3585 25.4825C27.4766 25.3643 27.6282 25.2827 27.7943 25.2479C27.9603 25.2132 28.1332 25.2268 28.2912 25.2872C28.4493 25.3476 28.5852 25.4519 28.6819 25.5871C28.7786 25.7223 28.8318 25.8821 28.8346 26.0465V26.0605C28.8394 26.2761 28.7554 26.4847 28.6013 26.6405C28.4471 26.7963 28.2353 26.8864 28.0125 26.8911H27.9903" fill="black" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_59_5814">
                  <rect width="40" height="40" fill="white" />
                </clipPath>
                <clipPath id="clip1_59_5814">
                  <rect width="16.9697" height="14" fill="white" transform="translate(12 13)" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>

        {wrappedContent && <div className='content p-3 p-lg-0 mx-auto' dangerouslySetInnerHTML={{ __html: wrappedContent }} />}

        {resourceTags.nodes.length > 0 && (
          <div className='tags'>
            <div className='container ps-lg-0 pe-lg-0 mx-auto d-flex flex-wrap'>
              {sortedTags.map((tag, index) => (
                <Tag
                  key={index}
                  label={tag.name}
                  tagSlug={tag.slug}
                  isFeatured={tag.slug === 'featured'}
                />
              ))}
            </div>
          </div>
        )}
        
      </div>

      { (pfpHeading || pfpSubheading) && (
        <PoinersForParents
          pfpHeading={pfpHeading}
          pfpSubheading={pfpSubheading}
        />
      )}

      {relatedArticles?.length > 0 && (
        <div className='related'>
          <div className='container ps-3 pe-3 pt-4 mt-4 mb-4'>
            <h2 className='green pb-2 pb-xl-5 pt-xl-5'>Related Articles</h2>
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

      { (seasonalHeading || seasonalSubheading || seasonalButton) && (
          <SeasonalBanner
            seasonalHeading={seasonalHeading}
            seasonalSubheading={seasonalSubheading}
            seasonalButton={seasonalButton}
          />
      )}

    </>
  );
}
