import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Heading from '../../atoms/Heading/Heading';

const GET_RESOURCES_BY_TAG = gql`
query GetResourcesByTag {
  resources(first: 500) {
    nodes {
      title
      excerpt
      slug
      uri
      date
      resourceTypes {
        nodes {
          uri
          slug
          name
        }
      }
      resourceTags {
        nodes {
          uri
          slug
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
`;

function ResourceListComponent() {
  const { loading, error, data } = useQuery(GET_RESOURCES_BY_TAG);
  const router = useRouter();
  
  const desiredSlug = router.isReady && router.query.slug && Array.isArray(router.query.slug) ? router.query.slug[0] : null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!desiredSlug) return null;

  const filteredResources = data.resources.nodes.filter(resource =>
    resource.resourceTags.nodes.some(tag => tag.slug === desiredSlug)
  );

  const tagName = filteredResources.length > 0 
  ? filteredResources[0].resourceTags.nodes.find(tag => tag.slug === desiredSlug)?.name 
  : desiredSlug;

  return (
    <div className='container'>
      <div className='resources-container'>
      <Heading level='h1'>{tagName} Category</Heading>
        <div className='gap d-flex flex-wrap mb-5 mt-5'>
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              showFeaturedImage={true} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResourceListComponent;