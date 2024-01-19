import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import FourPanels from '../app/components/modules/FourPanels/FourPanels';
import debounce from 'lodash.debounce';
import ResourceCard from '../app/components/organisms/ResourceCard/ResourceCard';
import { gql, useQuery } from '@apollo/client';

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
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    link: string;
    date?: any; // Assuming date is a string (e.g., "2023-09-14T02:39:30")
    featuredImage?: {
        sourceUrl: string;
        altText?: string;
    };
    resourceTypes?: number[]; // Assuming these are arrays of IDs
    resourceTags?: number[];
    // Add additional properties to store the fetched names
    resourceTypeNames?: string[];
    resourceTagNames?: string[];
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
    const [filter, setFilter] = useState('all');
    const isResource = (post) => post.link.includes('/resources/');
    const isLocation = (post) => post.link.includes('/schools/');

    const { data: titleData, loading: titleLoading, error: titleError } = useQuery(GET_TITLE_FOR_PANELS);

    useEffect(() => {
        if (typeof query === 'string') {
            setSearchTerm(query);
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (searchTerm: string) => {
        setLoading(true);
        setError('');
        try {
            const perPage = 100;
            // URLs for different content types
            const pageUrl = `https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/pages?search=${encodeURIComponent(searchTerm)}&per_page=${perPage}`;
            const schoolUrl = `https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/schools?search=${encodeURIComponent(searchTerm)}&per_page=${perPage}`;
            const resourceUrl = `https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/resources?search=${encodeURIComponent(searchTerm)}&per_page=${perPage}`;
    
            const responses = await Promise.all([
                fetch(pageUrl),
                fetch(schoolUrl),
                fetch(resourceUrl)
            ]);
    
            let results = await Promise.all(responses.map(response => response.json()));
            results = results.flat(); // Flatten the array of arrays
    
            // Function to fetch names for tags and types
            const fetchNames = async (ids: number[], endpoint: string) => {
                return Promise.all(ids.map(async id => {
                    const response = await fetch(`https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/${endpoint}/${id}`);
                    const data = await response.json();
                    return data.name;
                }));
            };
    
            // Fetch additional data for each resource
            const resultsWithAdditionalData = await Promise.all(results.map(async (resource) => {
                if (resource.type === 'resources') {
                    // Fetch featured image if available
                    if (resource.featured_media) {
                        const mediaResponse = await fetch(`https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/media/${resource.featured_media}`);
                        const mediaData = await mediaResponse.json();
                        resource.featuredImage = {
                            sourceUrl: mediaData.source_url,
                            altText: mediaData.alt_text
                        };
                    }
    
                    // Fetch names for resource tags and types
                    resource.resourceTypeNames = resource.resource_type ? await fetchNames(resource.resource_type, 'resource_type') : [];
                    resource.resourceTagNames = resource.resource_tag ? await fetchNames(resource.resource_tag, 'resource_tag') : [];
                }
                return resource;
            }));
    
            setSearchResults(resultsWithAdditionalData);
        } catch (error) {
            console.error(error);
            setError('Failed to load search results: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const updateUrlAfterTyping = useCallback(debounce((value) => {
        router.push(`/search?query=${encodeURIComponent(value)}`, undefined, { shallow: true });
    }, 500), [router]);

    const debouncedSearch = useCallback(debounce((search) => {
        fetchSearchResults(search);
        inputRef.current?.focus();
    }, 500), []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            debouncedSearch(value);
            updateUrlAfterTyping(value);
        } else {
            setSearchResults([]);
            updateUrlAfterTyping('');
        }
    };

    const clearInput = () => {
        setSearchTerm('');
        setSearchResults([]);
        updateUrlAfterTyping('');
    };

    const filteredResults = () => {
        switch (activeFilter) {
            case 'Stories & Resources':
                return searchResults.filter(result => result.link.includes('/resources/'));
            case 'Locations':
                return searchResults.filter(result => result.link.includes('/schools/'));
            default:
                return searchResults;
        }
    };

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const renderResults = () => {
        switch (activeFilter) {
            case 'Stories & Resources':
            return (
                <div className="resource-cards">
                    {searchResults.filter(isResource).map((resource) => {
                        // Format the date
                        const date = new Date(resource.date);
                        const formattedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

                        return (
                            <div key={resource.id} className="card medium">
                                {/* Resource card content */}
                                <a href={resource.link}>
                                    <div className="inner">
                                        {resource.featuredImage && (
                                            <div className="image-wrapper">
                                                <div
                                                    className="image"
                                                    style={{ backgroundImage: `url(${resource.featuredImage.sourceUrl})` }}
                                                    aria-label={resource.title.rendered}
                                                ></div>
                                            </div>
                                        )}
                                        <div className="content-wrapper">
                                            <div className="details-wrapper">
                                                <div className="details d-flex justify-start align-items-center">
                                                    <div className="caption position-relative me-3">
                                                        {resource.resourceTypeNames?.join(", ")}
                                                    </div>
                                                    <div className="date mb-0">{formattedDate}</div>
                                                </div>
                                                <h3 className="title pt-2 pb-4">{resource.title.rendered}</h3>
                                                <div className="excerpt" dangerouslySetInnerHTML={{ __html: resource.excerpt.rendered }} />
                                            </div>
                                            <div className="tags-wrapper">
                                                <div className="tags d-flex flex-wrap">
                                                    {resource.resourceTagNames?.map((tag, index) => (
                                                        <div key={index} className="tag category mt-0">
                                                            {decodeHtml(tag)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            );
            case 'Locations':
                return searchResults
                    .filter(isLocation)
                    .map((school) => (
                        <div className='school-result' key={school.id}>
                            <h5 className='title' dangerouslySetInnerHTML={{ __html: school.title.rendered }} />
                            <p dangerouslySetInnerHTML={{ __html: school.excerpt.rendered }} />
                            <a className='b2 link' href={school.link}>Learn more</a>
                        </div>
                    ));
            default:
                // 'Top Results' or default case
                return searchResults.map(post => (
                    <div className='result' key={post.id}>
                        <h5 className='title' dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <div className='excerpt' dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                        <a className='b2 link' href={post.link}>{post.link}</a>
                    </div>
                ));
        }
    };
    
    const handleFilterChange = (newFilter) => {
        setActiveFilter(newFilter);
    };


    if (loading) return <p></p>;
    if (error) return <div className='container pt-5 pb-5'>Error: {error}</div>;

    return (
        <div className='search-container'>
            <div className='search-bar-container'>
                <div className='container border-bottom'>
                    <div className='search col-lg-10 offset-lg-1'>
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
                            <div
                                className={`filter b2 pt-4 pb-4 ms-2 me-2 ms-lg-4 me-lg-4 ${activeFilter === 'Stories & Resources' ? 'active' : ''}`}
                                onClick={() => handleFilterChange('Stories & Resources')}>
                                Stories & Resources
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='results col-lg-10 offset-lg-1'>
                    {filteredResults().length > 0 ? renderResults() : (
                        searchTerm && (
                            <>
                                <h3 className='pt-5'>Sorry, no matches were found.</h3>
                                {titleLoading ? (
                                    <p></p>
                                ) : titleError ? (
                                    <p>Error: {titleError.message}</p>
                                ) : (
                                    <div className='b4 pt-4'>{titleData.siteSettings.siteSettings.titleFor4Panels}</div>
                                )}
                                <FourPanels />
                            </>
                        )
                    )}
                </div>
            </div>
            {activeFilter === 'Top Results' && filteredResults().length > 0 && <FourPanels />}
        </div>
    );
};

export default SearchPage;
