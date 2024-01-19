import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import FourPanels from '../app/components/modules/FourPanels/FourPanels';
import debounce from 'lodash.debounce';
import ResourceCard from '../app/components/organisms/ResourceCard/ResourceCard';
import ResourceCardWrapper from './ResourceCardWrapper';

interface SearchResult {
    id: number;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    link: string;
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

    useEffect(() => {
        if (typeof query === 'string') {
            setSearchTerm(query);
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (searchTerm) => {
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
    
            // Fetch additional data for each resource
            const resultsWithAdditionalData = await Promise.all(results.map(async (resource) => {
                if (resource.type === 'resources') {
                    // Fetch featured image
                    const mediaResponse = await fetch(`https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/media/${resource.featured_media}`);
                    const mediaData = await mediaResponse.json();
                    resource.featuredImage = {
                        sourceUrl: mediaData.source_url,
                        altText: mediaData.alt_text
                    };
    
                    // Fetch resource tags and types
                    const tagsResponse = await fetch(`https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/tags?post=${resource.id}`);
                    const typesResponse = await fetch(`https://primroseschstg.wpenginepowered.com/wp-json/wp/v2/types?post=${resource.id}`);
                    const [tagsData, typesData] = await Promise.all([tagsResponse.json(), typesResponse.json()]);
    
                    resource.resourceTags = tagsData;
                    resource.resourceTypes = typesData;
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

    const renderResults = () => {
        switch (activeFilter) {
            // Inside the renderResults function in SearchPage component
        case 'Stories & Resources':
        return searchResults.filter(isResource).map((resource) => (
            <div className='result' key={resource.id}>
                <h5 className='title' dangerouslySetInnerHTML={{ __html: resource.title.rendered }} />
                <div className='excerpt' dangerouslySetInnerHTML={{ __html: resource.excerpt.rendered }} />
                <a className='b2 link' href={resource.link}>{resource.link}</a>
            </div>
            ));

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
                                <div className='b4 pt-4'>Quick links: </div>
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
