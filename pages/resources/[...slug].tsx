import { client } from '../../app/lib/apollo'; 
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
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

export default function SlugComponent({ categoryNames, categoryTags, slug: serverSideSlug }: { categoryNames: string[], categoryTags: string[], slug: string | string[] }) {
	const router = useRouter();
	const { slug = serverSideSlug } = router.query;
	const singleSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

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

export async function getServerSideProps(context: any) {
    try {
        const { data } = await client.query({ query: RESOURCE_TYPES_AND_TAGS_QUERY });

        const categoryNames = data.resourceTypes.nodes.map((node: { slug: string }) => node.slug);
        const categoryTags = data.resourceTags.nodes.map((node: { slug: string }) => node.slug);

        return {
            props: {
                categoryNames,
                categoryTags,
                slug: context.params.slug
            }
        };
    } catch (error) {
        console.error("Error fetching data", error);
        return {
            props: { categoryNames: [], categoryTags: [] }
        };
    }
}
