import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import Newsletter from '../../app/components/modules/Newsletter/Newsletter';
import ResourceCard from '../../app/components/organisms/ResourceCard/ResourceCard';
import { ResourceFilter } from '../../app/components/filters/ResourceFilter';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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


    const renderResourceList = (title, resourceList, linkTo = "", showFeaturedImage = true, className = '', specialClassType = '') => (
        <>  
            <div className='title-container'>
                <h2 className='title'>{title}</h2>
                {linkTo && (
                    <Link
                        className='all-resources'
                        href={linkTo}>
                        All {title.replace("For ", "")} Resources
                    </Link>
                )}
            </div>
            <TransitionGroup className='d-flex flex-wrap'>
                {resourceList.map((resource, index) => {
                    const isNewsroom = resource?.resourceTypes?.nodes?.some(type => type.slug === 'newsroom');
                    const isFeatured = resource?.resourceTags?.nodes?.some(tag => tag.slug === 'featured');
                    const shouldAddNewsroomClass = isNewsroom && !isFeatured;
    
                    return (
                        <CSSTransition
                            key={`${resource.title}-${index}`}
                            timeout={500}
                            classNames="fade"
                        >
                            <ResourceCard
                                resource={resource}
                                showFeaturedImage={showFeaturedImage}
                                className={`${className} ${shouldAddNewsroomClass ? 'newsroom' : ''}`} 
                            />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </>
    );

    return (
        <>
            <div className='container'>
            <div className='featured mt-4'>
                {renderResourceList("", firstFiveFeaturedResources, "", true, 'featured medium')}
            </div>
                {renderResourceList("For Families", familiesResources, "/resources/families", true, 'families medium')}
                {renderResourceList("For Educators", educatorsResources, "/resources/educators", true, 'educators medium')}
                {renderResourceList("Newsroom", newsroomResources, "/resources/newsroom", false, 'newsroom medium')}

                <div className='wrapper all'>
                    {SearchAndFilterUI}
                    {renderResourceList("All Stories & Resources", filteredResources, "", true, 'medium', 'newsroom')}
                </div>
            </div>
            <Newsletter />
        </>
    );
}





