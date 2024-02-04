import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import ResourceBanner from '../../organisms/ResourceBanner/ResourceBanner';
import { ResourceFilter } from '../../filters/ResourceFilter';
import Heading from '../../atoms/Heading/Heading';
import Button from '../../atoms/Button/Button';

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
  const router = useRouter();
  const { slug: slugArray } = router.query;
  const slug = Array.isArray(slugArray) ? slugArray[0] : slugArray;

  const { loading, error, data } = useQuery(RESOURCES_AND_FILTER_TERMS_QUERY);

  const [categoryResources, setCategoryResources] = useState([]);

 const [featuredResources, setFeaturedResources] = useState<FeaturedResource[]>([]);

  const featuredResourceIds = featuredResources.length > 0 ? featuredResources.map(fr => fr.id) : [];
  
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

  useEffect(() => {
    if (data && slug) {
      const categorySpecificResources = data.resources.nodes.filter(resource =>
        resource.resourceTypes.nodes.some(type => type.slug === slug)
      );
  
      const featuredInCategory = data.resourcesSettings.resourceSettings.featuredResources
        .filter(featured => 
          featured.resourceTypes.nodes.some(type => type.slug === slug)
        )
        .slice(0, 2); 
  
      setCategoryResources(categorySpecificResources);
      setFeaturedResources(featuredInCategory);
    }
  }, [data, slug]);
  
  
  const { filteredResources, SearchAndFilterUI } = ResourceFilter(categoryResources, data);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResources]);

  const resourcesPerPage = 9;
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

  const scrollToAllResources = () => {
    setTimeout(() => {
      const element = document.getElementById('all');
      element?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    scrollToAllResources();
  };

  const Pagination = () => {
    return (
      <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">

        <Button
          className='prev'
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(prev => prev - 1);
            scrollToAllResources();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
          </svg>
        </Button>


        {[...Array(totalPages).keys()].map(num => (
          <Button
            key={num}
            className={num + 1 === currentPage ? 'active' : 'non'}
            onClick={() => handlePageClick(num + 1)}
          >
            {num + 1}
          </Button>
        ))}


        <Button
          className='next'
          disabled={currentPage >= totalPages}
          onClick={() => {
            setCurrentPage(prev => prev + 1);
            scrollToAllResources();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
          </svg>
        </Button>
      </div>
    );
  };

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
        />
      ))}
    </div>
);

  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <div className='container category'>
      <div className='resources-container'>
          {featuredResources.length > 0 
              ? renderResourceList(featuredResources, true, 'featured', true) 
              : <p>No Featured Resources</p>}
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
      {Pagination()}
    </div>
  );
}
