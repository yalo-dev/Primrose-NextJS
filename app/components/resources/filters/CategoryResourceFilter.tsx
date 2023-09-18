import React from 'react';
import ResourceCard from '../../organisms/ResourceCard/ResourceCard';

const CategoryResourceFilter = ({ resources, filterTerms, searchTerm, setSearchTerm, selectedAge, setSelectedAge, selectedTopic, setSelectedTopic, slug }) => {

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

  const classNameGenerator = (resource) => {
    return resource.resourceTypes.nodes.some(type => type.slug === 'newsroom') ? 'small' : 'medium';
  };

  const shouldShowFeaturedImage = (resource, isNewsroom) => {
    return isNewsroom ? false : !resource.resourceTypes.nodes.some(type => type.slug === 'newsroom');
  };

  const filteredAndSearchedResources = applyFilters();

  
  return (
    <>
      <div className="search-and-filter">
        <div className='search'>
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className='filters'>
          <select className='custom-select' value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
            <option value="">All Ages</option>
            {filterTerms.map((term) => {
              if (term.name === 'Ages') {
                return term.children.nodes.map((child) => (
                  <option key={child.slug} value={child.slug}>
                    {child.name}
                  </option>
                ));
              }
            })}
          </select>
          <select className='custom-select' value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="">All Topics</option>
            {filterTerms.map((term) => {
              if (term.name === 'Topics') {
                return term.children.nodes.map((child) => (
                  <option key={child.slug} value={child.slug}>
                    {child.name}
                  </option>
                ));
              }
            })}
          </select>
        </div>
      </div>
      <div className='d-flex flex-wrap all'>
        {filteredAndSearchedResources.map((resource, index) => (
          <ResourceCard 
          key={`${resource.title}-${index}`} 
          resource={resource} 
          showFeaturedImage={shouldShowFeaturedImage(resource, slug === 'newsroom')}
          className={classNameGenerator(resource)}  
          />
        ))}
      </div>
    </>
  );
};

export default CategoryResourceFilter;
