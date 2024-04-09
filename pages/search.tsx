import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import FourPanels from '../app/components/modules/FourPanels/FourPanels';
import {gql, useQuery} from '@apollo/client';
import React from 'react';
import MapSearch from '../app/components/modules/MapSearch/MapSearch';
import {useJsApiLoader} from '@react-google-maps/api';
import {getSchools} from '../app/lib/schoolsData';
import Pagination from "../app/components/molecules/Pagination/Pagination";

let geocoder: any;
let place: any = null;
const GET_TITLE_FOR_PANELS = gql`
  query GetTitleForPanels {
    siteSettings {
      siteSettings {
        titleFor4Panels
      }
    }
  }
`;


interface SearchResult {
    id: number;
    title: string;
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

interface Place {
    address_components: any[];
    formatted_address: string;
    geometry: any;
    place_id: string;
    types: string[];
}

const SearchPage: React.FC = () => {
    // TODO: this page needs HEAVY refactoring

    const router = useRouter();
    const {query} = router.query;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeFilter, setActiveFilter] = useState('Top Results');
    const isResource = (post) => post.url?.includes('/stories-resources/');
    const isLocation = (post) => post.url?.includes('/schools/');
    const {data: titleData, loading: titleLoading, error: titleError} = useQuery(GET_TITLE_FOR_PANELS);
    const [resourceTagsOptions, setResourceTagsOptions] = useState<Option[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [hasVisibleResources, setHasVisibleResources] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [schools, setSchools] = useState([]);
    

    //console.log(router);
    // const tagClassName = (tagName) => {
    //     return `tag-${tagName.replace(/&amp;/g, 'and').replace(/\s+/g, '-').toLowerCase()}`;
    // };
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBPyZHOxbr95iPjgQGCnecqc6qcTHEg9Yw",
        libraries: ['places'],
    });
    useEffect(() => {
        if (activeFilter == 'Locations') {
            document.body.classList.add('search-locations');
        } else {
            document.body.classList.remove('search-locations');
        }
    }, [activeFilter]);

    useEffect(() => {
        if (typeof query === 'string') {
            let place_geocode = geocodeSearchTerm(query);
            setSearchTerm(query);
            fetchSearchResults(query);
            setSearchPerformed(true);
        } else if (router.query.query === 'string') {
            let gst = geocodeSearchTerm(router.query.query);
            setSearchTerm(router.query.query);
            fetchSearchResults(router.query.query);
            setSearchPerformed(true);
        }
        
    }, [isLoaded]);

    if (isLoaded && !geocoder) {
        geocoder = new window.google.maps.Geocoder();
    }
    const geocodeSearchTerm = async (searchTerm: string) => {
        if (geocoder) {
            geocoder.geocode({'address': searchTerm}, (results, status) => {
                if (status === 'OK' && results && results[0] && !results[0].partial_match) {
                    place = results[0];
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/resource_tag?per_page=100`);
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
            setItemsPerPage(10);
        }
        setCurrentPage(1);
    }, [activeFilter]);

    const getPaginatedResults = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchResults.slice(startIndex, endIndex);
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
        //console.log('fetching search results');
        setLoading(true);
        let i = 0;
        let timer = setInterval(function () {
            //console.log('timer');
            //console.log(i);
            i++;
        }, 1000);
        try {
            const baseUrls = [
                `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/search/?subtype[]=page&subtype[]=schools&subtype[]=resources&search=${encodeURIComponent(searchTerm.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''))}&orderby=relevance&per_page=50&page=1`,
            ];

            const batchResults = await Promise.all(baseUrls.map(url => fetchBatch(url)));
            const flatResults = batchResults.flat();
            
            const resultsWithAdditionalData = await Promise.all(flatResults.filter((post :SearchResult) => !post.url.includes('-st')).map(async (resource) => {
                const enhancedResource: SearchResult = {...resource};

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
                if(resource.url.includes('/schools/')){
                    enhancedResource.title = "Primrose School: " + resource.title;
                }
                return enhancedResource;
            }));
            const newsExcludedResults = resultsWithAdditionalData.filter((post: SearchResult) => !post.url.includes('/news/'));
            setSearchResults(newsExcludedResults);
        } catch (error) {
            console.error(error);
            setError('Failed to load search results: ' + error.message);
        } finally {
            clearInterval(timer);
            //console.log('fully loaded');
            setLoading(false);
            
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const value = e.target.value;

        setSearchTerm(value);
        
        if (searchTerm) {
            geocodeSearchTerm(searchTerm);
            fetchSearchResults(searchTerm);
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchPerformed(true);
            setSearchTerm(searchTerm);
        }
        setCurrentPage(1)
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
                <FourPanels/>
            </div>
        );

        if (!searchPerformed) {
            return renderTitleAndFourPanels();
        }

        if (searchPerformed) {
            

            switch (activeFilter) {
                case 'Locations':
                    //console.log(place);
                    let fas_props = {
                        place: place,
                        //schools: schools
                    }
                    //console.log(schools)
                    
                    return (
                        <>
                            <MapSearch {...fas_props} />
                        </>
                    );
                default:
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
                    const paginatedTopResults = getPaginatedResults();
                    //console.log(paginatedTopResults);

                    return (
                        <>
                            <div className='container col-lg-10 offset-lg-1'>
                                {paginatedTopResults.map(post => (
                                    <div className='result' key={post.id}>
                                        <a href={post?.url}><h5 className='title'
                                                                dangerouslySetInnerHTML={{__html: post.title}}/></a>
                                        <a className='b2 link' href={post?.url}>{post?.url}</a>
                                    </div>
                                ))}
                            </div>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22"
                                     fill="none">
                                    <circle cx="10.5" cy="11.35" r="9.75" stroke="#5E6738" strokeWidth="1.5"/>
                                    <rect x="13.2266" y="7.71297" width="1.28571" height="9"
                                          transform="rotate(45 13.2266 7.71297)" fill="#5E6738"/>
                                    <rect x="6.86719" y="8.62239" width="1.28571" height="9"
                                          transform="rotate(-45 6.86719 8.62239)" fill="#5E6738"/>
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
                {
                renderResults()
                }
                <Pagination controller={{page: currentPage, setPage: setCurrentPage}}
                            itemCount={getTotalFilteredResults()} perPage={itemsPerPage}/>
            </div>
            <div
                className='container col-lg-10 offset-lg-1'>{searchPerformed && activeFilter === 'Top Results' && getFilteredResults().length > 0 &&
              <FourPanels/>}</div>
        </div>
    );
};


export default SearchPage;

