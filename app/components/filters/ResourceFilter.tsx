import { useState, useEffect } from 'react';
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
    id: any;
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

interface FilterTerms {
    resourceTags: {
        nodes: {
            name: string;
            slug: string;
            children: {
                nodes: {
                    name: string;
                    slug: string;
                }[];
            };
        }[];
    };
}

export function ResourceFilter(initialResources: Resource[], filterTerms?: FilterTerms) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>(initialResources);

    useEffect(() => {
        let newResources = [...initialResources];

        if (selectedTopic.length > 0) {
            newResources = newResources.filter(resource =>
                resource.resourceTags.nodes.some(tag => selectedTopic.includes(tag.slug.toLowerCase()))
            );
        }

        if (selectedAge.length > 0) {
            newResources = newResources.filter(resource =>
                resource.resourceTags.nodes.some(tag => selectedAge.includes(tag.slug.toLowerCase()))
            );
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            newResources = newResources.filter(resource => {
                const titleMatch = resource.title.toLowerCase().includes(searchLower);
                const tagMatch = resource.resourceTags.nodes.some(tag => tag.name.toLowerCase().includes(searchLower));
                const typeMatch = resource.resourceTypes.nodes.some(type => type.name.toLowerCase().includes(searchLower));
                return titleMatch || tagMatch || typeMatch;
            });
        }

        setFilteredResources(newResources);
    }, [searchTerm, selectedAge, selectedTopic, initialResources]);

    const handleAgesSelect = (selectedAges: string[]) => {
        setSelectedAge(selectedAges);
    };
    
    const handleTopicsSelect = (selectedTopics: string[]) => {
        setSelectedTopic(selectedTopics);
    };

    const SearchAndFilterUI = (
        <div className="search-and-filter">
            <div className='search'>
                <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className='filters'>
                <MultiSelectDropdown
                    options={filterTerms?.resourceTags?.nodes?.find(tag => tag.slug === 'ages')?.children?.nodes?.map(child => ({ label: child.name, value: child.slug })) || []}
                    onSelect={handleAgesSelect}
                    placeholder="All Ages"
                    selected={selectedAge}
                />

                <MultiSelectDropdown
                    options={filterTerms?.resourceTags?.nodes?.find(tag => tag.slug === 'topics')?.children?.nodes?.map(child => ({ label: child.name, value: child.slug })) || []}
                    onSelect={handleTopicsSelect}
                    placeholder="All Topics"
                    selected={selectedTopic}
                />
            </div>
        </div>
    );

    return {
        filteredResources,
        SearchAndFilterUI
    };
}
