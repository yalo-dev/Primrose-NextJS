import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Newsletter from '../Newsletter/Newsletter';
import CategoryResourceFilter from '../../filters/CategoryResourceFilter';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import useFilter from '../../filters/useFilter';
import ResourceBanner from '../../organisms/ResourceBanner/ResourceBanner';

const ResourcesAndFilterTermsQuery = gql`
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

export default function CategoryComponent() {
    const { searchTerm, setSearchTerm, selectedAge, setSelectedAge, selectedTopic, setSelectedTopic } = useFilter();
    const router = useRouter();
    const { slug: slugArray } = router.query;
    const slug = Array.isArray(slugArray) ? slugArray[0] : slugArray;
    const [filteredResources, setFilteredResources] = useState([]);
    const [firstTwoFeaturedResources, setFirstTwoFeaturedResources] = useState([]);
    const { loading, error, data } = useQuery(ResourcesAndFilterTermsQuery);

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
        <div className='gap d-flex flex-wrap'>
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
            <div className='container'>
                <div className='resources-container'>
                    {firstTwoFeaturedResources.length > 0 ? renderResourceList(firstTwoFeaturedResources, true, 'featured') : <p>No Featured Resources</p>}
                </div>

                {(slug === 'families' || slug === 'newsroom') && <ResourceBanner slug={slug} />}
                <div id='all' className='resources-container'>

                    {filteredResources.length > 0 ? (
                        slug ? (
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
                        ) : (
                            <p>The resource slug is not available</p>
                        )
                    ) : <p>No Resources Found</p>}
                </div>
            </div>
            <Newsletter />
        </div>
    );
}