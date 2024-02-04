import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import { ResourceFilter } from '../../app/components/filters/ResourceFilter';
import Link from 'next/link';
import Heading from '../../app/components/atoms/Heading/Heading';
import Button from '../../app/components/atoms/Button/Button';
import ResourceCard from '../../app/components/organisms/ResourceCard/ResourceCard';

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
                resourceTypes(first: 500) {
                  nodes {
                    uri
                    slug
                    name
                  }
                }
                resourceTags(first: 500) {
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
    const featuredResourceIds = featuredResources.map(fr => fr.id);
    const displayedFeaturedResources = featuredResources.slice(0, 5);

    const filterResourcesByTypeAndExcludeFeatured = (typeSlug) => {
        return resources.filter(resource =>
            resource.resourceTypes.nodes.some(type => type.slug === typeSlug) &&
            !featuredResourceIds.includes(resource.id)
        );
    };
    
    const sortByDateDescending = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

    const familiesResources = filterResourcesByTypeAndExcludeFeatured("families")
        .sort(sortByDateDescending)
        .slice(0, 3);
    const educatorsResources = filterResourcesByTypeAndExcludeFeatured("educators")
        .sort(sortByDateDescending)
        .slice(0, 3);
    const newsroomResources = filterResourcesByTypeAndExcludeFeatured("newsroom")
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
    
                    return (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            showFeaturedImage={showFeaturedImage}
                            className={`${className} ${shouldAddNewsroomClass ? 'small' : ''}`}
                            showExcerptIfNoImage={showExcerptIfNoImage}
                            featuredResourceIds={featuredResourceIds}
                            
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
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    const allResourcesRef = useRef<HTMLDivElement>(null);
    

    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource)
    .map(resource => ({
        ...resource,
        isFeatured: featuredResourceIds.includes(resource.id)
    }));


    const scrollToAllResources = () => {
        allResourcesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        if (allResourcesRef.current) {
            allResourcesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
                    }} label={''}                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
                    </svg>
                </Button>
                {[...Array(totalPages).keys()].map(num => (
                    <Button
                        key={num}
                        className={num + 1 === currentPage ? 'active' : 'non'}
                        onClick={() => handlePageClick(num + 1)}
                        label={`${num + 1}`}
                    />
                ))}
                <Button
                    className='next'
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                        setCurrentPage(prev => prev + 1);
                        scrollToAllResources();
                    }} label={''}                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
                    </svg>
                </Button>
            </div>
        );
    };

    useEffect(() => {
        const adjustCardHeights = () => {
            if (window.innerWidth < 1200) {
                document.querySelectorAll('#all .card').forEach((card: any) => {
                    card.style.height = 'auto';
                });
                return;
            }

            const cards = document.querySelectorAll('#all .card');
            let maxHeight = 0;

            cards.forEach((card: any) => {
                if (card.offsetHeight > maxHeight) {
                    maxHeight = card.offsetHeight;
                }
            });

            cards.forEach((card: any) => {
                card.style.height = `${maxHeight}px`;
            });
        };

        adjustCardHeights();

        window.addEventListener('resize', adjustCardHeights);

        return () => {
            window.removeEventListener('resize', adjustCardHeights);
        };
    }, []);


    return (
        <>
            <div className='container'>
                <div className='resources-container'>
                    {renderResourceItems(displayedFeaturedResources, true, ['featured large', 'featured medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("For Families", "/stories-resources/families")}
                    {renderResourceItems(familiesResources, true, ['families medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("For Educators", "/stories-resources/educators")}
                    {renderResourceItems(educatorsResources, true, ['educators medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("Newsroom", "/stories-resources/newsroom")}
                    {renderResourceItems(newsroomResources, false, ['newsroom'])}
                </div>

                <div id='all' className='resources-container' ref={allResourcesRef}>
                    <div className='title-and-search-container'>
                        {renderTitle("All Stories & Resources")}
                        {SearchAndFilterUI}
                    </div>
                    {renderResourceItems(currentResources, true, ['medium'], true)}
                    <Pagination />
                </div>
            </div>
        </>
    );
}
