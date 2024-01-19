import ResourceCard from "../app/components/organisms/ResourceCard/ResourceCard";

const ResourceCardWrapper = ({ resource }) => {
    // Fallbacks for missing fields
    const resourceTags = resource.resourceTags ? resource.resourceTags.nodes : [];
    const resourceTypes = resource.resourceTypes ? resource.resourceTypes.nodes : [];
    const featuredImage = resource.featuredImage ? {
        node: {
            sourceUrl: resource.featuredImage.sourceUrl,
            altText: resource.featuredImage.altText
        }
    } : null;

    // Convert REST API data to the expected GraphQL format
    const transformedResource = {
        ...resource,
        resourceTags: { nodes: resourceTags },
        resourceTypes: { nodes: resourceTypes },
        featuredImage: featuredImage
    };

    return <ResourceCard resource={transformedResource} showFeaturedImage={true} showExcerptIfNoImage={true} />;
};

export default ResourceCardWrapper;
