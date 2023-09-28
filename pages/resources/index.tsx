import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import ResourceCard from '../../app/components/organisms/ResourceCard/ResourceCard';
import { ResourceFilter } from '../../app/components/filters/ResourceFilter';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

export async function getServerSideProps() {
    try {
        const resourceQuery = gql`
        query GetResources {
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
        }`;

        const filterTermsQuery = gql`
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
            client.query({ query: resourceQuery }),
            client.query({ query: filterTermsQuery })
        ]);

        return {
            props: {
                resources: resourceData.data.resources.nodes,
                filterTerms: filterTermsData.data
            },
        };

    } catch (error) {
        console.error("Error fetching data", error);
        return {
            props: { resources: [], filterTerms: [] },
        };
    }
}

export default function ResourcesList({ resources, filterTerms }) {
    
    // featured section sorted by publication date
    const featuredResources = resources.filter(resource => {
        return resource?.resourceTags?.nodes?.some(tag => tag.slug === "featured");
    }).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // limit featured sections to display 5
    const firstFiveFeaturedResources = featuredResources.slice(0, 5);

    // filter resources by resource-type and exclude all featured resources from the resource-type sections
    const filterResourcesByTypeAndExcludeFeatured = (typeSlug) => {
        return resources.filter(resource => {
            return (
                resource.resourceTypes.nodes.some(type => type.slug === typeSlug) &&
                !resource.resourceTags.nodes.some(tag => tag.slug === "featured")
            );
        });
    };

    // limit resource-type sections to display 3
    const familiesResources = filterResourcesByTypeAndExcludeFeatured("families").slice(0, 3);
    const educatorsResources = filterResourcesByTypeAndExcludeFeatured("educators").slice(0, 3);
    const newsroomResources = filterResourcesByTypeAndExcludeFeatured("newsroom").slice(0, 3);

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
        return (
            <div className='title-container'>
                <h2 className='title'>{title}</h2>
                {linkTo && (
                    <Link className='b3 link' href={linkTo}>
                        All {title.replace("For ", "")} Resources
                    </Link>
                )}
            </div>
        );
    };

    const renderResourceItems = (
        resourceList: any[], 
        showFeaturedImage: boolean = true, 
        classNames: string[] = [] 
        ): React.ReactNode => {
            if (!resourceList || resourceList.length === 0) {
                return null;    
            }
            return (
                <div className='gap d-flex flex-wrap'>
                    {resourceList.map((resource, index) => {
                        const isNewsroom = resource?.resourceTypes?.nodes?.some(type => type.slug === 'newsroom');
                        const isFeatured = resource?.resourceTags?.nodes?.some(tag => tag.slug === 'featured');
                        const shouldAddNewsroomClass = isNewsroom && !isFeatured;
                        const className = classNames[index] || classNames[classNames.length - 1];

                        return (
                            <ResourceCard
                                key={`${resource.title}-${index}`}
                                resource={resource}
                                showFeaturedImage={showFeaturedImage}
                                className={`${className} ${shouldAddNewsroomClass ? 'small' : ''}`} 
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
    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
    
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    const allResourcesRef = useRef<HTMLDivElement>(null);

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
                <button className='prev' disabled={currentPage <= 1} onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    scrollToAllResources();
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68"/>
                    </svg>
                   
                </button>
                {[...Array(totalPages).keys()].map(num => (
                    <button
                        key={num}
                        className={num + 1 === currentPage ? 'active' : 'non'}
                        onClick={() => handlePageClick(num + 1)}>
                        0{num + 1}
                    </button>
                ))}
                <button className='next' disabled={currentPage >= totalPages} onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    scrollToAllResources();
                }}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68"/>
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <>
            <div className='container'>
                <div className='resources-container'>
                    {renderResourceItems(firstFiveFeaturedResources, true, ['featured large', 'featured medium'])}
                </div>
                <div className='resources-container'> 
                    {renderTitle("For Families", "/resources/families" )} 
                {renderResourceItems(familiesResources, true, ['families medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("For Educators", "/resources/educators")}
                    {renderResourceItems(educatorsResources, true, ['educators medium'])}
                </div>
                <div className='resources-container'>
                    {renderTitle("Newsroom", "/resources/newsroom")}
                    {renderResourceItems(newsroomResources, false, ['newsroom'])}
                </div>
                <div id='all' className='resources-container' ref={allResourcesRef}>
                    <div className='title-and-search-container mb-5'>
                        {renderTitle("All Stories & Resources")}
                        {SearchAndFilterUI}
                    </div>
                    {renderResourceItems(currentResources, true, ['medium'])}
                    <Pagination />
                </div>
            </div>
        </>
    );
}
