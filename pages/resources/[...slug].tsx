import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import CategoryComponent from '../../app/components/modules/ResourceCategoryComponent/ResourceCategoryComponent';
import TagComponent from '../../app/components/modules/ResourceTagComponent/ResourceTagComponent';
import ResourceComponent from '../../app/components/modules/ResourceSingleComponent/ResourceSingleComponent';

const RESOURCE_TYPES_AND_TAGS_QUERY = gql`
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
export default function SlugComponent({ categoryNames: initialCategoryNames, categoryTags: initialCategoryTags, slug: serverSideSlug }: { categoryNames: string[], categoryTags: string[], slug: string | string[] }) {
	const router = useRouter();
	const { slug = serverSideSlug } = router.query;
	const singleSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

	const { loading, error, data } = useQuery(RESOURCE_TYPES_AND_TAGS_QUERY);

	const categoryNames = loading || error ? initialCategoryNames : data.resourceTypes.nodes.map((node: { slug: string }) => node.slug);
	const categoryTags = loading || error ? initialCategoryTags : data.resourceTags.nodes.map((node: { slug: string }) => node.slug);

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
