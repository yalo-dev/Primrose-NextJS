import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import { ResourceFilter } from '../../app/components/filters/ResourceFilter';
import Link from 'next/link';
import Heading from '../../app/components/atoms/Heading/Heading';
import Button from '../../app/components/atoms/Button/Button';
import ResourceCard from '../../app/components/organisms/ResourceCard/ResourceCard';
import {useRouter} from "next/router";
import Pagination from "../../app/components/molecules/Pagination/Pagination";

export async function getServerSideProps() {
    try {
        const RESOURCES_QUERY = gql`
        query GetResources {
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
                resourceTypes(first: 1500) {
                  nodes {
                    uri
                    slug
                    name
                  }
                }
                resourceTags(first: 1500) {
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
          }`;

        const FILTER_TERMS_QUERY = gql`
        query GetFilterTerms {
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
        }`;

        const [resourceData, filterTermsData] = await Promise.all([
            client.query({ query: RESOURCES_QUERY }),
            client.query({ query: FILTER_TERMS_QUERY })
        ]);

        return {
            props: {
                resources: resourceData.data.resources.nodes,
                featuredResources: resourceData.data.resourcesSettings.resourceSettings.featuredResources,
                filterTerms: filterTermsData.data
            },
        };

    } catch (error) {
        console.error("Error fetching data", error);
        return {
            props: { resources: [], featuredResources: [], filterTerms: [] },
        };
    }
}

export default function ResourcesList({ resources, featuredResources, filterTerms }) {
    const router = useRouter()
    const featuredResourceIds = featuredResources?.map(fr => fr.id);
    const displayedFeaturedResources = featuredResources?.slice(0, 5);

    const filterResourcesByTypeAndExcludeFeatured = (typeSlug) => {
        return resources.filter(resource =>
            resource.resourceTypes.nodes.some(type => type.slug === typeSlug) &&
            !featuredResourceIds?.includes(resource.id)
        );
    };
    
    const sortByDateDescending = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

    const familiesResources = filterResourcesByTypeAndExcludeFeatured("for-families")
        .sort(sortByDateDescending)
        .slice(0, 3);
    const educatorsResources = filterResourcesByTypeAndExcludeFeatured("for-educators")
        .sort(sortByDateDescending)
        .slice(0, 3);
    const newsroomResources = filterResourcesByTypeAndExcludeFeatured("news")
        .sort(sortByDateDescending)
        .slice(0, 3);
        
    
    const {
        filteredResources,
        SearchAndFilterUI,
    } = ResourceFilter(resources, filterTerms);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredResources]);

    const renderTitle = (
        title: string,
        linkTo: string = ""
    ): React.ReactNode => {

        let adjustedTitle = title;
        if (title.includes("Families")) adjustedTitle = title.replace("Families", "All Family Resources");
        if (title.includes("Educators")) adjustedTitle = title.replace("Educators", "All Educator Resources");
        if (title.includes("Newsroom")) adjustedTitle = title.replace("Newsroom", "All News");


        return (
            <div className='title-container'>
                <Heading level='h2' className='title'>{title}</Heading>
                {linkTo && (
                    <Link className='link' href={linkTo}>
                        {adjustedTitle.replace("For ", "")}
                    </Link>
                )}
            </div>
        );
    };

    const renderResourceItems = (
        resourceList: any[],
        showFeaturedImage: boolean = true,
        classNames: string[] = [],
        showExcerptIfNoImage: boolean = false
    ): React.ReactNode => {
        if (!resourceList || resourceList.length === 0) {
            return null;
        }

        return (
            <div className='gap d-flex flex-wrap'>
                {resourceList.map((resource, index) => {
    
                    if (!resource) {
                        return null;
                    }
    
                    const isNewsroom = resource?.resourceTypes?.nodes?.some(type => type.slug === 'newsroom');
                    const isFeatured = resource?.resourceTags?.nodes?.some(tag => tag.slug === 'featured');
                    const shouldAddNewsroomClass = isNewsroom && !isFeatured;
                    const className = classNames[index] || classNames[classNames.length - 1];

                    const categoryFirstNode = resource?.resourceTypes?.nodes[0]
                    const category = categoryFirstNode?.slug
                    const link = resource?.newsFields?.link != "" ? resource?.newsFields?.link : (router.asPath + "/" + category + "/" + resource.slug); 
                    return (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            showFeaturedImage={showFeaturedImage}
                            className={`${className} ${shouldAddNewsroomClass ? 'small' : ''}`}
                            showExcerptIfNoImage={showExcerptIfNoImage}
                            featuredResourceIds={featuredResourceIds}
                            customLink={link}
                        />
                    );
                })}
            </div>
        );
    };

    const [currentPage, setCurrentPage] = useState(1);
    const resourcesPerPage = 9;
    const indexOfLastResource = currentPage * resourcesPerPage;
    const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
    const allResourcesRef = useRef<HTMLDivElement>(null);
    

    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource)
    .map(resource => ({
        ...resource,
        isFeatured: featuredResourceIds?.includes(resource.id)
    }));


    // useEffect(() => {
    //     const adjustCardHeights = () => {
    //         if (window.innerWidth < 1200) {
    //             document.querySelectorAll('#all .card').forEach((card: any) => {
    //                 card.style.height = 'auto';
    //             });
    //             return;
    //         }
    //         const cards = document.querySelectorAll('#all .card');
    //         let maxHeight = 0;

    //         cards.forEach((card: any) => {
    //             if (card.offsetHeight > maxHeight) {
    //                 maxHeight = card.offsetHeight;
    //             }
    //         });
    //         cards.forEach((card: any) => {
    //             card.style.height = `${maxHeight}px`;
    //         });
    //     };

    //     adjustCardHeights();
    //     window.addEventListener('resize', adjustCardHeights);
    //     return () => {
    //         window.removeEventListener('resize', adjustCardHeights);
    //     };
    // }, []);


    return (
        <>
            <div className='container'>
                <div className='resources-container'>
                    {renderResourceItems(displayedFeaturedResources, true, ['featured large', 'featured medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("For Families", "/stories-resources/for-families")}
                    {renderResourceItems(familiesResources, true, ['families medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("For Educators", "/stories-resources/for-educators")}
                    {renderResourceItems(educatorsResources, true, ['educators medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("Newsroom", "/stories-resources/news")}
                    {renderResourceItems(newsroomResources, false, ['newsroom'])}
                </div>

                <div id='all' className='resources-container' ref={allResourcesRef}>
                    <div className='title-and-search-container'>
                        {renderTitle("All Stories & Resources")}
                        {SearchAndFilterUI}
                    </div>
                    {renderResourceItems(currentResources, true, ['medium'], true)}
                    <Pagination controller={{page: currentPage, setPage: setCurrentPage}}
                                itemCount={filteredResources?.length}
                                perPage={resourcesPerPage}
                                scrollToRef={allResourcesRef}
                    />
                </div>
            </div>
        </>
    );
}
