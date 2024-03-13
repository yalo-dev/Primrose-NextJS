import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ResourceCard from "../../../app/components/organisms/ResourceCard/ResourceCard";
import ResourceBanner from "../../../app/components/organisms/ResourceBanner/ResourceBanner";
import {ResourceFilter} from "../../../app/components/filters/ResourceFilter";
import Heading from "../../../app/components/atoms/Heading/Heading";
import Button from '../../../app/components/atoms/Button/Button';
import Pagination from "../../../app/components/molecules/Pagination/Pagination";
import { bool } from 'sharp';

const RESOURCES_AND_FILTER_TERMS_QUERY = gql`
  query GetResourcesAndFilterTerms {
    resources(first: 500) {
      nodes {
        id
        title
        excerpt
        slug
        uri
        date
        newsFields{
          link
        }
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
            altText
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
    resourcesSettings {
      resourceSettings {
        featuredResources {
        ... on Resource {
          id
          title
          uri
          slug
          featuredImage {
          node {
            altText
            sourceUrl
          }
          }
          excerpt
          date
          resourceFields {
          content
          displayAuthor
          fieldGroupName
          backgroundColor
          }
          resourceTags {
          nodes {
            slug
            link
            uri
            name
          }
          }
          resourceTypes {
          nodes {
            slug
            uri
            name
            link
          }
          }
        }
        }
      }
      }
  }
`;
interface FeaturedResource {
  id: string;
  title: string;
}

export default function CategoryComponent() {
  // TODO: move filtering and pagination to server - SHOULD USE URL SEARCH PARAMS AS STATE
  // TODO: The filtering and pagination is done client-side. This is affecting performance, but filtering resource by resourceType is not currently available and will need to be added on the backend manually
  const router = useRouter();
  const { category } = router.query

  const slug: string | undefined = typeof category === 'string' ? category : category?.length[0] // make sure slug is (string | undefined)

  const { loading, error, data } = useQuery(RESOURCES_AND_FILTER_TERMS_QUERY);

  const [categoryResources, setCategoryResources] = useState([]);

  const [tagResources, setTagResources] = useState([]);

  const [featuredResources, setFeaturedResources] = useState<FeaturedResource[]>([]);

  const featuredResourceIds = featuredResources?.length > 0 ? featuredResources?.map(fr => fr.id) : [];

  const [currentPage, setCurrentPage] = useState<number>(1);

  const toProperCase = (str) => {
    return str.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const slugToTitleMap = {
    'families': 'Family Resources',
    'educators': 'Educator Resources',
    'newsroom': 'News'
  };

  const getTitleFromSlug = (slug: string) => {
    return slugToTitleMap[slug] || toProperCase(slug);
  };

  let isTagPage = false;

  useEffect(() => {
    if (data && slug) {
      //if the resource tag is the same as the page slug, then it is a tag page
      const resourceTag = data.resourceTags.nodes.find(tag => tag.slug === slug);
      let tagCheck = resourceTag?.slug === slug;
      if (tagCheck) isTagPage = tagCheck;

      if(isTagPage) {
        const categorySpecificResources = data.resources.nodes.filter(resource =>
          resource.resourceTags.nodes.some(type => type.slug === slug)
        );
        setCategoryResources(categorySpecificResources);
        isTagPage = true;
      } else {
        const categorySpecificResources = data.resources.nodes.filter(resource =>
          resource.resourceTypes.nodes.some(type => type.slug === slug)
        );
        setCategoryResources(categorySpecificResources);
      }

      const featuredInCategory = data.resourcesSettings.resourceSettings.featuredResources?.filter(featured =>
          featured.resourceTypes.nodes.some(type => type.slug === slug)
        ).slice(0, 2);

      setFeaturedResources(featuredInCategory);
    }
  }, [data, slug]);
  
  const { filteredResources, SearchAndFilterUI } = ResourceFilter(categoryResources, data, slug);
  

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResources]);

  const resourcesPerPage = 9;
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);


  const currentResourcesMapped = currentResources.map(resource => ({
    ...resource,
    isFeatured: featuredResourceIds.includes(resource.id)
}));
  
  const renderResourceList = (resourceList, showFeaturedImage = true, additionalClassName = '', isFeatured = false) => (
    
  <div className='gap d-flex flex-wrap'>
      {resourceList.map((resource, index) => (
        <ResourceCard
          key={`${resource.title}-${index}`}
          resource={resource}
          showFeaturedImage={showFeaturedImage}
          className={`${additionalClassName}`}
          featuredResourceIds={featuredResourceIds}
          isFeatured={isFeatured}
          customLink={resource?.newsFields?.link ? resource?.newsFields?.link : `${router.asPath}/${resource.slug}`}
        />
      ))}
    </div>
);

  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='container category'>
      <div className='resources-container'>
          {featuredResources?.length > 0
              ? renderResourceList(featuredResources, true, 'featured', true)
              : ''}
      </div>
      <ResourceBanner slug={slug} />
      <div id='all' className='resources-container'>
        <div className='title-and-search-container'>
          <div className='title-container'>
            <Heading level='h2' className='title'>Browse All {slug ? getTitleFromSlug(slug) : 'Stories & Resources'}</Heading>
          </div>
          {SearchAndFilterUI}
        </div>
        {currentResourcesMapped && currentResourcesMapped.length > 0
        ? renderResourceList(currentResourcesMapped, true, 'medium')
        : <p>No Resources Found</p>}
      </div>
      <Pagination controller={{page: currentPage, setPage: setCurrentPage}} itemCount={filteredResources?.length} perPage={resourcesPerPage} />
    </div>
  );
}
