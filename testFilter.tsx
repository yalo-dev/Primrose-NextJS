// testFilter.ts

interface ResourceTagNode {
    slug: string;
    name: string;
}

interface ResourceTags {
    nodes: ResourceTagNode[];
}

interface Resource {
    title: string;
    resourceTags: ResourceTags;
}

const mockResources: Resource[] = [
  {
    title: "Resource 1",
    resourceTags: { nodes: [{ slug: "age-1", name: "Age 1" }, { slug: "topic-1", name: "Topic 1" }] },
  },
  {
    title: "Resource 2",
    resourceTags: { nodes: [{ slug: "age-2", name: "Age 2" }, { slug: "topic-2", name: "Topic 2" }] },
  },
];

const applyFilters = (resources: Resource[], searchTerm: string, selectedAge: string[], selectedTopic: string[]) => {
    return resources.filter(resource => {
        const matchesSearch = searchTerm
            ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              resource.resourceTags.nodes.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
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


const testApplyFilters = () => {
  const searchTerm = "Resource 1";
  const selectedAge = ["age-1"];
  const selectedTopic = [];

  const filtered = applyFilters(mockResources, searchTerm, selectedAge, selectedTopic);
  console.log(filtered);
}

testApplyFilters();
