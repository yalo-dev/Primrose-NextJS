import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import CategoryComponent from '../../app/components/modules/ResourceCategoryComponent/ResourceCategoryComponent';
import TagComponent from '../../app/components/modules/ResourceTagComponent/ResourceTagComponent';
import ResourceComponent from '../../app/components/modules/SingleResourceComponent/SingleResourceComponent';

const ResourceTypesAndTagsQuery = gql`
  query GetResourceTypesAndTags {
    resourceTypes(first: 100) {
      nodes {
        slug
      }
    }
    resourceTags {
      nodes {
        slug
      }
    }
  }
`;

export default function SlugComponent() {
  const router = useRouter();
  const { loading, error, data } = useQuery(ResourceTypesAndTagsQuery);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (data) {
      const fetchedCategoryNames = data.resourceTypes.nodes.map((node: { slug: string }) => node.slug);
      setCategoryNames(fetchedCategoryNames);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const categoryTags = data.resourceTags.nodes.map((node: { slug: string }) => node.slug);
      setCategoryTags(categoryTags);
    }
  }, [data]);

  const { slug } = router.query; 
  const singleSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug; 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (categoryNames.includes(singleSlug as string)) {

    return <CategoryComponent />;
  
  } else if (categoryTags.includes(singleSlug as string)) {

      return <TagComponent />;

  } else if (singleSlug) {

    return <ResourceComponent singleSlug={singleSlug} />;

  } else {

    return <p>Not found</p>;
  }
}