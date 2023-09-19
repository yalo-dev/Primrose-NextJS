import React, { useState, useEffect } from 'react';
import ResourceCard from '../organisms/ResourceCard/ResourceCard';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
  selectedAge: string;
  setSelectedAge: React.Dispatch<React.SetStateAction<string>>;
  selectedTopic: string;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
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
      const matchesAge = selectedAge ? resource.resourceTags.nodes.some(tag => tag.slug === selectedAge) : true;
      const matchesTopic = selectedTopic ? resource.resourceTags.nodes.some(tag => tag.slug === selectedTopic) : true;
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

  return (
    <>
      <div className="search-and-filter">
        <div className='search'>
          <input type="text" name='search' id='search' placeholder="Type Your Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  />
        </div>
        <div className='filters'>
          <select className='custom-select' name='age' id='age' value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
            <option value="">All Ages</option>
            {filterTerms.map(term => term.name === 'Ages' ? term.children.nodes.map(child => (
              <option key={child.slug} value={child.slug}>{child.name}</option>
            )) : null)}
          </select>
          <select className='custom-select' name='topic' id='topic' value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="">All Topics</option>
            {filterTerms.map(term => term.name === 'Topics' ? term.children.nodes.map(child => (
              <option key={child.slug} value={child.slug}>{child.name}</option>
            )) : null)}
          </select>
        </div>
      </div>
      <TransitionGroup className='d-flex flex-wrap wrapper all'>
        {filteredAndSearchedResources.map((resource, index) => (
          <CSSTransition
            key={`${resource.title}-${index}`}
            timeout={500} 
            classNames="fade"
          >
            <ResourceCard 
              resource={resource} 
              showFeaturedImage={shouldShowFeaturedImage(resource, slug === 'newsroom')}
              className={classNameGenerator(resource)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  );
};

export default CategoryResourceFilter;
