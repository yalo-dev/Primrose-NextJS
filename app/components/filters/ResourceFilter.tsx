import { useState, useEffect } from 'react';



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
    const [selectedAge, setSelectedAge] = useState<string | null>('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>('');
    const [filteredResources, setFilteredResources] = useState<Resource[]>(initialResources);

    useEffect(() => {
        let newResources = [...initialResources];

        if (selectedTopic) {
            newResources = newResources.filter(resource =>
                resource.resourceTags.nodes.some(tag => tag.slug.toLowerCase() === selectedTopic.toLowerCase())
            );
        }

        if (selectedAge) {
            newResources = newResources.filter(resource =>
                resource.resourceTags.nodes.some(tag => tag.slug.toLowerCase() === selectedAge.toLowerCase())
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

    const SearchAndFilterUI = (
        <div className="search-and-filter">
            <div className='search'>
                <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className='filters'>
                <select className='custom-select' onChange={(e) => setSelectedAge(e.target.value)}>
                    <option value="">All Ages</option>
                    {filterTerms?.resourceTags?.nodes?.find(tag => tag.slug === 'ages')?.children?.nodes?.map((child, index) => (
                        <option value={child.slug} key={index}>{child.name}</option>
                    ))}
                </select>
                <select className='custom-select' onChange={(e) => setSelectedTopic(e.target.value)}>
                    <option value="">All Topics</option>
                    {filterTerms?.resourceTags?.nodes?.find(tag => tag.slug === 'topics')?.children?.nodes?.map((child, index) => (
                        <option value={child.slug} key={index}>{child.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );


    return {
        filteredResources,
        SearchAndFilterUI
    };
}
