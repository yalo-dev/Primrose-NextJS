import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';
import Heading from '../../atoms/Heading/Heading';

const RESOURCES_BY_TAG_QUERY = gql`
query GetResourcesByTag {
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
        }
      }
    }
  }
}
`;

function scrollToTop() {
    setTimeout(() => {
        const element = document.getElementById('all');
        if (element) {  
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function ResourceTagComponent() {
	const { loading, error, data } = useQuery(RESOURCES_BY_TAG_QUERY);
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const desiredSlug = router.isReady && router.query.slug && Array.isArray(router.query.slug) ? router.query.slug[0] : null;
	
	const resourcesPerPage = 9;

	useEffect(() => {
		setCurrentPage(1);
	}, [desiredSlug]);

	  
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!desiredSlug) return null;

	const filteredResources = data.resources.nodes.filter(resource =>
		resource.resourceTags.nodes.some(tag => tag.slug === desiredSlug)
	);

	const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
	const indexOfLastResource = currentPage * resourcesPerPage;
	const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
	const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

	function getTagNameBySlug(slug) {
		const tag = data.resources.nodes.find(resource =>
		  resource.resourceTags.nodes.some(tag => tag.slug === slug)
		);
	  
		if (tag) {
		  const matchedTag = tag.resourceTags.nodes.find(t => t.slug === slug);
		  return matchedTag ? matchedTag.name : null;
		}
	  
		return null;
	  }

	return (
		<div className='container'>
			<div id='all' className='resources-container'>
			<Heading level='h1'>{getTagNameBySlug(desiredSlug)} Category</Heading>
				<div className='gap d-flex flex-wrap mb-5 mt-5'>
					{currentResources.map(resource => (
						<ResourceCard
							key={resource.id}
							resource={resource}
							showFeaturedImage={true}
						/>
					))}
				</div>
				<div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
					<button className='prev' disabled={currentPage === 1} onClick={() => {setCurrentPage(currentPage - 1); scrollToTop();}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
							<path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
						</svg>
					</button>
					{[...Array(totalPages).keys()].map(num => (
                        <button
                            key={num}
                            className={num + 1 === currentPage ? 'active' : 'non'}
                            onClick={() => {setCurrentPage(num + 1); scrollToTop();}}
                        >
                            {num + 1}
                        </button>
                    ))}
                    <button className='next' disabled={currentPage === totalPages} onClick={() => {setCurrentPage(currentPage + 1); scrollToTop();}}>
						<svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
							<path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ResourceTagComponent;
