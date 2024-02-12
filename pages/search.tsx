import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import FourPanels from '../app/components/modules/FourPanels/FourPanels';
import { gql, useQuery } from '@apollo/client';
import { CustomMultiSelectDropdown } from '../app/components/molecules/CustomMultiSelectDropdown/CustomMultiSelectDropdown';
import React from 'react';
import Button from '../app/components/atoms/Button/Button';
import MapSearch from '../app/components/modules/MapSearch/MapSearch';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import schoolData from '../app/data/schoolsData';
import $ from 'jquery';


let geocoder:any;
let place:any;
const GET_TITLE_FOR_PANELS = gql`
  query GetTitleForPanels {
    siteSettings {
      siteSettings {
        titleFor4Panels
      }
    }
  }
`;
const GOOGLE_MAP_LIBRARIES: ("places")[] = ['places'];

interface SearchResult {
    id: number;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    url: string;
    date?: any;
    featuredImage?: {
        sourceUrl: string;
        altText?: string;
    };
    resourceTypes?: number[];
    resourceTags?: number[];
    resourceTypeNames?: string[];
    resourceTagNames?: string[];
    featured_media?: number;
    resource_type?: number[];
    resource_tag?: number[];
}

interface Option {
    className: any;
    label: string;
    value: string;
}

interface ApiResponse {
    name?: string;
}
interface Place{
    address_components: any[];
    formatted_address: string;
    geometry: any;
    place_id: string;
    types: string[]; 
}
const SearchPage: React.FC = () => {
    const router = useRouter();
    const { query } = router.query;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeFilter, setActiveFilter] = useState('Top Results');
    const isResource = (post) => post.url?.includes('/stories-resources/');
    const isLocation = (post) => post.url?.includes('/schools/');
    const { data: titleData, loading: titleLoading, error: titleError } = useQuery(GET_TITLE_FOR_PANELS);
    const [resourceTagsOptions, setResourceTagsOptions] = useState<Option[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [hasVisibleResources, setHasVisibleResources] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const schools = schoolData;
    
    //console.log(router);
    const tagClassName = (tagName) => {
        return `tag-${tagName.replace(/&amp;/g, 'and').replace(/\s+/g, '-').toLowerCase()}`;
    };
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
        libraries: ['places'],
      });   
      useEffect(() =>
        {
            if(activeFilter == 'Locations'){
                document.body.classList.add('search-locations');
            }else{
                document.body.classList.remove('search-locations');
            }
        },[activeFilter]);
    useEffect(() => {
        
       
            
            if (typeof query === 'string') {
                let place_geocode = geocodeSearchTerm(query);
                
               
                setSearchTerm(query);
                fetchSearchResults(query);
                setSearchPerformed(true);
            }else if( router.query.query === 'string') {
                
                let gst = geocodeSearchTerm(router.query.query);
                setSearchTerm(router.query.query);
                fetchSearchResults(router.query.query);
                setSearchPerformed(true);
            }
            console.log("loading");
            console.log(loading);
                
                
            
    }, [isLoaded]);
    /* useEffect(() => {
        if (router.query.query) {
            
          const searchQuery = Array.isArray(router.query.query) ? router.query.query[0] : router.query.query;
          
          if (searchQuery) {

            setSearchTerm(searchQuery);
            let gst = geocodeSearchTerm(searchQuery);

            fetchSearchResults(searchQuery);
            setSearchPerformed(true);
        }
        }
    }, [router, isLoaded]); */
    if(isLoaded && !geocoder){
        geocoder = new window.google.maps.Geocoder();
    }
    const geocodeSearchTerm = async(searchTerm:string) => {
        
        if(geocoder){
            geocoder.geocode({ 'address': searchTerm }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    place = results[0];
                    console.log('is a place');
                    setActiveFilter('Locations');
                    
                    return results[0];
                } else {
                    setActiveFilter('Top Results');
                    return false;
                }
            });
        }
    }
    useEffect(() => {
        const fetchResourceTags = async () => {
            
            
            try {
                const response = await fetch('${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/resource_tag?per_page=100');
                const tags = await response.json();
                const options = tags.map(tag => {
                    const tagName = decodeHtml(tag.name).replace(/&/g, 'and');
                    return {
                        label: tagName,
                        value: tag.id.toString(),
                        className: `tag-${tagName.replace(/\s+/g, '-').toLowerCase()}` 
                    };
                });
                setResourceTagsOptions(options);
            } catch (error) {
                console.error('Error fetching resource tags:', error);
            }
        };

        fetchResourceTags();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]); 

    
      
    const getTotalFilteredResults = (): number => {
        switch (activeFilter) {
            case 'Stories & Resources':
                return searchResults.filter(isResource).length;
            case 'Locations':
                return searchResults.filter(isLocation).length;
            default:
                return searchResults.length;
        }
    };

    useEffect(() => {
        if (activeFilter === 'Stories & Resources') {
          setItemsPerPage(12); 
        } else {
          setItemsPerPage(6); 
        }
        setCurrentPage(1); 
    }, [activeFilter]);
    
    const getTotalPages = () => {
        return Math.ceil(getTotalFilteredResults() / itemsPerPage);
    };
    
    const getPaginatedResults = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchResults.slice(startIndex, endIndex);
    };

    const renderPaginationControls = () => {
        const totalPages = getTotalPages(); 

        const handlePageClick = pageNumber => {
            setCurrentPage(pageNumber);
    };

        return (
            <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
                <Button
                    className='prev'
                    disabled={currentPage <= 1}
                    onClick={() => {
                        setCurrentPage(prev => prev - 1);
                    }} 
                    label={''}>
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
                    }} 
                    label={''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
                    </svg>
                </Button>
            </div>
        );
    };
    
    const fetchBatch = async (url: string, accumulatedResults: SearchResult[] = []): Promise<SearchResult[]> => {
        const response = await fetch(url);
        const newResults: SearchResult[] = await response.json();
        const allResults = accumulatedResults.concat(newResults);
    
        // Check if there are more results to fetch
        if (newResults.length === 100) {
            const nextUrl = new URL(url);
            const currentPageNumber = nextUrl.searchParams.get('page');
            if (currentPageNumber !== null) {
                const nextPageNumber = parseInt(currentPageNumber) + 1;
                nextUrl.searchParams.set('page', nextPageNumber.toString());
                return fetchBatch(nextUrl.href, allResults);
            }
        }
    
        return allResults;
    };

   const fetchNames = async (ids: number[], endpoint: string): Promise<string[]> => {
    const names: string[] = [];
    for (const id of ids) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/${endpoint}/${id}?per_page=10&page=1`);
            const data: ApiResponse = await response.json();

            if (data.name) {
                names.push(data.name);
            } else {
                console.warn(`Name property not found in response for id ${id}`);
            }
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}/${id}:`, error);
        }
    }
    return names;
    };

    const fetchSearchResults = async (searchTerm: string) => {
        setLoading(true);
        setError('');
        let i=0;
        let timer = setInterval(function(){
            console.log('timer');
            console.log(i);
            i++;
        }, 1000);
        try {
            const baseUrls = [
                `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/search/?subtype[]=page&subtype[]=resources&search=${encodeURIComponent(searchTerm)}&orderby=relevance&per_page=100&page=1`,
            ];
            
            const batchResults = await Promise.all(baseUrls.map(url => fetchBatch(url)));
            const flatResults = batchResults.flat();
            console.log(flatResults);
            const resultsWithAdditionalData = await Promise.all(flatResults.map(async (resource) => {
                const enhancedResource: SearchResult = { ...resource };
    
                if (resource.featured_media) {
                    const mediaResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/media/${resource.featured_media}`);
                    const mediaData = await mediaResponse.json();
                    enhancedResource.featuredImage = {
                        sourceUrl: mediaData.source_url,
                        altText: mediaData.alt_text
                    };
                }
    
                if (resource.resource_type) {
                    enhancedResource.resourceTypeNames = await fetchNames(resource.resource_type, 'resource_type');
                }
    
                if (resource.resource_tag) {
                    enhancedResource.resourceTagNames = await fetchNames(resource.resource_tag, 'resource_tag');
                }
    
                return enhancedResource;
            }));
    
            setSearchResults(resultsWithAdditionalData);
        } catch (error) {
            console.error(error);
            setError('Failed to load search results: ' + error.message);
        } finally {
            clearInterval(timer);
            setLoading(false);
        }
            
        
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        if (searchTerm) {
            geocodeSearchTerm(searchTerm);
            fetchSearchResults(searchTerm);
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchPerformed(true);
            setSearchTerm(searchTerm);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const getFilteredResults = (): SearchResult[] => {
        let results: SearchResult[] = [];
        switch (activeFilter) {
            case 'Stories & Resources':
                results = searchResults.filter(isResource);
                //console.log('stories and resources');
                //console.log(results);
                break;
            case 'Locations':
                results = searchResults;
                break;
            default:
                results = searchResults;
                break;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return results.slice(startIndex, endIndex);
    }; 

    const handleFilterChange = (newFilter) => {
        setActiveFilter(newFilter);
    };

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value; 
    }

    const clearInput = () => {
        setSearchTerm('');
        setSearchPerformed(false);
    };

    const handleTagSelection = (selectedValues: string[]) => {
        const selectedClasses = selectedValues.map(value => {
            const option = resourceTagsOptions.find(opt => opt.value === value);
            return option ? option.className : '';
        });
        const resourceCards = document.querySelectorAll('.resource-cards .card');

        let visibleResourceCount = 0;
        resourceCards.forEach(card => {
            const htmlCard = card as HTMLElement;
            const matchesFilter = selectedClasses.some(className =>
                className && htmlCard.classList.contains(className)
            );
            if (matchesFilter || selectedClasses.length === 0) {
                htmlCard.style.display = '';
                visibleResourceCount++;
            } else {
                htmlCard.style.display = 'none';
            }
        });

        setHasVisibleResources(visibleResourceCount > 0);
        setCurrentPage(1);
    };
    
    const renderResults = () => {

        
        const renderTitleAndFourPanels = () => (
            <div className='container col-lg-10 offset-lg-1'>
                {!titleLoading && !titleError && (
                    <div className='b4 pt-4'>{titleData.siteSettings.siteSettings.titleFor4Panels}</div>
                )}
                <FourPanels />
            </div>
        );

        if (!searchPerformed) {
            return renderTitleAndFourPanels();
        }

        if (searchPerformed) {
            if (getFilteredResults().length === 0) {
                return (
                    <>
                    <div className='container col-lg-10 offset-lg-1'>
                        <h3 className='pt-5'>Sorry, no matches were found.</h3>
                    </div>
                    {renderTitleAndFourPanels()}
                    </>
                );
            }

            switch (activeFilter) {
                case 'Locations':
                    
                    let fas_props = {
                        place: place,
                        schools: schools
                    }
                    return (
                        <>
                         <MapSearch {...fas_props} /> 
                        </>
                      );
                default:
                    const paginatedTopResults = getPaginatedResults();
                        console.log(paginatedTopResults);
                    return (
                        <>
                            <div className='container col-lg-10 offset-lg-1'>
                                {paginatedTopResults.map(post => (
                                    <div className='result' key={post.id}>
                                         <a href={post?.url}><h5 className='title' dangerouslySetInnerHTML={{ __html: post.title }} /></a>
                                        <a className='b2 link' href={post?.url}>{post?.url}</a>
                                    </div>
                                ))}
                            </div>
                            {renderPaginationControls()}
                        </>
                    );
            }
        }
    };

    if (loading) return <p></p>;
    if (error) return <div className='container pt-5 pb-5'>Error: {error}</div>;

    return (
        
        <div className='search-container'>
            <div className='search-bar-container'>
                <div className='container'>
                    <div className='search col-lg-10 offset-lg-1'>
                        <form action={'.'} onSubmit={handleSearchSubmit}>
                            <label htmlFor='search' className='hidden'>Search</label>
                            <input
                                ref={inputRef}
                                className='form-control'
                                type='search'
                                name='search'
                                id='search'
                                placeholder='Search...'
                                aria-label='Search'
                                required
                                value={searchTerm}
                                onChange={handleInputChange}
                            />
                            <button type="submit" hidden>Search</button>
                            <div className={`clear-icon ${searchTerm ? 'active' : ''}`} onClick={clearInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                                    <circle cx="10.5" cy="11.35" r="9.75" stroke="#5E6738" strokeWidth="1.5" />
                                    <rect x="13.2266" y="7.71297" width="1.28571" height="9" transform="rotate(45 13.2266 7.71297)" fill="#5E6738" />
                                    <rect x="6.86719" y="8.62239" width="1.28571" height="9" transform="rotate(-45 6.86719 8.62239)" fill="#5E6738" />
                                </svg>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <div className='container border-bottom'>
                        <div className='search-filters d-flex'>
                            <div
                                className={`filter b2 pt-4 pb-4 ms-2 me-2 ms-lg-4 me-lg-4 ${activeFilter === 'Top Results' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Top Results')}>
                                Top Results
                            </div>
                            <div
                                className={`filter b2 pt-4 pb-4 ms-2 me-2 ms-lg-4 me-lg-4 ${activeFilter === 'Locations' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Locations')}>
                                Locations
                            </div>
                            {/* <div
                                className={`filter b2 pt-4 pb-4 ms-2 me-2 ms-lg-4 me-lg-4 ${activeFilter === 'Stories & Resources' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Stories & Resources')}>
                                Stories & Resources
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='results'>
                {renderResults()}
            </div>
            <div className='container col-lg-10 offset-lg-1'>{searchPerformed && activeFilter === 'Top Results' && getFilteredResults().length > 0 && <FourPanels />}</div>
        </div>
    );
};


export default SearchPage;

