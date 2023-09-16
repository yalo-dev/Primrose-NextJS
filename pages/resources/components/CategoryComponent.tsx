import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import ResourceMenu from '../../../app/components/organisms/ResourcesMenu/ResourcesMenu';
import Newsletter from '../../../app/components/modules/Newsletter/Newsletter';
import React, { useEffect, useState } from 'react';
import CategoryResourceFilter from '../filters/CategoryResourceFilter';
import ResourceCard from '../../../app/components/organisms/ResourceCard/ResourceCard';
import useFilter from '../filters/useFilter';
import ResourceBanner from '../../../app/components/organisms/ResourceBanner/ResourceBanner'; 

const GET_RESOURCES_AND_FILTER_TERMS = gql`
  query GetResourcesAndFilterTerms {
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
    resourceTags(first: 500) {
      nodes {
        name
        slug
        children {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

const toProperCase = (str) => {
  return str.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function CategoryComponent() {
  const { searchTerm, setSearchTerm, selectedAge, setSelectedAge, selectedTopic, setSelectedTopic } = useFilter();
  const router = useRouter();
  const { slug: slugArray } = router.query;
  const slug = Array.isArray(slugArray) ? slugArray[0] : slugArray;

  const [filteredResources, setFilteredResources] = useState([]);
  const [firstTwoFeaturedResources, setFirstTwoFeaturedResources] = useState([]);

  const { loading, error, data } = useQuery(GET_RESOURCES_AND_FILTER_TERMS);

  useEffect(() => {
    if (data && slug) {
      const allResources = data.resources.nodes;
      const newFilteredResources = allResources.filter(resource => {
        return resource.resourceTypes.nodes.some(type => type.slug === slug);
      });

      const newFeaturedResources = newFilteredResources.filter(resource => {
        return resource.resourceTags.nodes.some(tag => tag.slug === 'featured');
      }).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setFilteredResources(newFilteredResources);
      setFirstTwoFeaturedResources(newFeaturedResources.slice(0, 2));
    }
  }, [data, slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filterTerms = data?.resourceTags.nodes || [];

  const renderResourceList = (resourceList, showFeaturedImage = true, additionalClassName = '') => (
    <div className='d-flex flex-wrap'>
      {resourceList.map((resource, index) => (
        <ResourceCard
          key={`${resource.title}-${index}`}
          resource={resource}
          showFeaturedImage={slug === 'newsroom' ? showFeaturedImage : true}
          className={`${resource.resourceTypes.nodes.some(type => type.slug === 'newsroom') ? 'small' : 'medium'} ${additionalClassName}`}
        />
      ))}
    </div>
  );

  return (
    <div className='container-fluid category'>
      <ResourceMenu />
      <div className='container'>
        {firstTwoFeaturedResources.length > 0 ? renderResourceList(firstTwoFeaturedResources, true, 'featured') : <p>No Featured Resources</p>}
        {(slug === 'families' || slug === 'newsroom') && <ResourceBanner slug={slug} />}
        <div className='wrapper'>
          <h2 className='resource-list-title'>Browse All {slug ? toProperCase(slug) : 'Stories & Resources'} Resources</h2>
          {filteredResources.length > 0 ? (
            <CategoryResourceFilter
              resources={filteredResources}
              filterTerms={filterTerms}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedAge={selectedAge}
              setSelectedAge={setSelectedAge}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              slug={slug}
            />

          ) : <p>No Resources Found</p>}
        </div>
      </div>
      <Newsletter />
    </div>
  );
}