import React, { useState, useEffect } from 'react';
import ResourceCard from '../organisms/ResourceCard/ResourceCard';
import { MultiSelectDropdown } from '../molecules/MultiSelectDropdown/MultiSelectDropdown';

interface ResourceTagNode {
    slug: string;
    name: string;
}

interface ResourceTags {
    nodes: ResourceTagNode[];
}

interface ResourceTypeNode {
    slug: string;
    name: string;
}

interface ResourceTypes {
    nodes: ResourceTypeNode[];
}

interface Resource {
    title: string;
    excerpt: string;
    slug: string;
    uri: string;
    date: string;
    resourceTypes: ResourceTypes;
    resourceTags: ResourceTags;
    featuredImage: {
        node: {
            sourceUrl: string;
        };
    };
}

interface FilterTermsNode {
    name: string;
    slug: string;
    children: {
        nodes: {
            name: string;
            slug: string;
        }[];
    };
}

interface CategoryResourceFilterProps {
    resources: Resource[];
    filterTerms: FilterTermsNode[];
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    selectedAge: string[];  // Changed to an array
    setSelectedAge: React.Dispatch<React.SetStateAction<string[]>>;  // Changed to accept an array
    selectedTopic: string[];  // Changed to an array
    setSelectedTopic: React.Dispatch<React.SetStateAction<string[]>>;  // Changed to accept an array
    slug: string;
}

export const CategoryResourceFilter: React.FC<CategoryResourceFilterProps> = ({
    resources, filterTerms, searchTerm, setSearchTerm,
    selectedAge, setSelectedAge, selectedTopic, setSelectedTopic, slug }) => {

        const applyFilters = () => {
            return resources.filter(resource => {
                const matchesSearch = searchTerm
                    ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    resource.resourceTags.nodes.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    resource.resourceTypes.nodes.some(type => type.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true;
        
                const matchesAge = selectedAge.length > 0 
                    ? resource.resourceTags.nodes.some(tag => selectedAge.includes(tag.slug))
                    : true;
        
                const matchesTopic = selectedTopic.length > 0 
                    ? resource.resourceTags.nodes.some(tag => selectedTopic.includes(tag.slug))
                    : true;
        
                return matchesSearch && matchesAge && matchesTopic;
            });
        };
        

    const classNameGenerator = (resource: Resource) => {
        const baseClass = resource.resourceTypes.nodes.some(type => type.slug === 'newsroom') ? 'small' : 'medium';
        return `${baseClass} fade-in`;
    };

    const shouldShowFeaturedImage = (resource: Resource, isNewsroom: boolean) => {
        return isNewsroom ? false : !resource.resourceTypes.nodes.some(type => type.slug === 'newsroom');
    };

    const filteredAndSearchedResources = applyFilters();

    const toProperCase = (str) => {
        return str.replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const totalItems = filteredAndSearchedResources.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResources = filteredAndSearchedResources.slice(indexOfFirstItem, indexOfLastItem);

    const scrollToTop = () => {
        const element = document.getElementById("all");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const nextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
        scrollToTop();
    };

    const prevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
        scrollToTop();
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedAge, selectedTopic]);

    const Pagination: React.FC = () => (
        <div className="pagination mt-4 mb-4 d-flex align-items-center justify-content-center">
            <button className='prev' onClick={prevPage} disabled={currentPage === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.67652 0.206047C6.05792 0.520326 6.10946 1.08083 5.79162 1.45796L1.79788 6.19685L5.7662 10.5132C6.10016 10.8764 6.07309 11.4386 5.70573 11.7688C5.33837 12.0991 4.76984 12.0723 4.43587 11.709L0.467559 7.39271C-0.135971 6.73625 -0.157669 5.74029 0.416712 5.05875L4.41045 0.319858C4.72828 -0.0572766 5.29513 -0.108231 5.67652 0.206047Z" fill="#555F68" />
                </svg>
            </button>
            {[...Array(totalPages).keys()].map(num => (
                <button
                    key={num}
                    onClick={() => {
                        setCurrentPage(num + 1);
                        scrollToTop();
                    }}
                    className={currentPage === num + 1 ? 'active' : 'non'}
                >
                    {num + 1}
                </button>
            ))}
            <button className='next' onClick={nextPage} disabled={currentPage === totalPages}>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 0.206047C-0.0579243 0.520326 -0.109455 1.08083 0.208378 1.45796L4.20212 6.19685L0.233801 10.5132C-0.100161 10.8764 -0.0730881 11.4386 0.294271 11.7688C0.66163 12.0991 1.23016 12.0723 1.56413 11.709L5.53244 7.39271C6.13597 6.73625 6.15767 5.74029 5.58329 5.05875L1.58955 0.319858C1.27172 -0.0572766 0.704875 -0.108231 0.323475 0.206047Z" fill="#555F68" />
                </svg>
            </button>
        </div>
    );
    
    const slugToTitleMap = {
        'families': 'Family Resources',
        'educators': 'Educator Resources',
        'newsroom': 'News'
      };

      const getTitleFromSlug = (slug: string) => {
        return slugToTitleMap[slug] || toProperCase(slug);
      };

      const handleAgesSelect = (selectedAges: string[]) => {
        setSelectedAge(selectedAges);
      };
      
      const handleTopicsSelect = (selectedTopics: string[]) => {
        setSelectedTopic(selectedTopics);
      };
    
    const SearchAndFilterUI: React.FC = () => (
        <div className='title-and-search-container'>
            <div className='title-container'>
                <h2 className='title'>Browse All {slug ? getTitleFromSlug(slug) : 'Stories & Resources'}</h2>
            </div>
            <div className="search-and-filter">
                <div className='search'>
                    <input type="text" name='search' id='search' placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className='filters'>
                <MultiSelectDropdown
                options={filterTerms
                    .find(term => term.name === 'Ages')?.children.nodes.map(child => ({ label: child.name, value: child.slug })) || []}
                onSelect={handleAgesSelect}
                placeholder="All Ages"
                />

                <MultiSelectDropdown
                options={filterTerms
                    .find(term => term.name === 'Topics')?.children.nodes.map(child => ({ label: child.name, value: child.slug })) || []}
                onSelect={handleTopicsSelect}
                placeholder="All Topics"
                />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <SearchAndFilterUI />
            <div className='gap d-flex flex-wrap'>
                {currentResources.map((resource, index) => (
                    <ResourceCard
                        key={resource.slug || index}
                        resource={resource}
                        showFeaturedImage={shouldShowFeaturedImage(resource, slug === 'newsroom')}
                        className={classNameGenerator(resource)}
                    />
                ))}
            </div>
            <Pagination />
        </>

    );
};

export default CategoryResourceFilter;
