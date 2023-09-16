import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import PostCard from '../../app/components/organisms/PostCard/PostCard';

export async function getServerSideProps() {
    const GET_POSTS = gql`
    query AllPostsQuery {
      posts {
        nodes {
          title
          content
          date
          uri
        }
      }
    }
  `;

    const response = await client.query({
        query: GET_POSTS
    });

    const posts = response?.data?.posts?.nodes;
    return {
        props: {
            posts
        }
    }
}

export default function Home({ posts }) {
    return (
        <section className='module pt-4 pb-4'>
            <div className='container'>
                <div className='row'>
                    <h1 className='title'>
                        Blogs
                    </h1>
                    <div className=''>
                        {
                            posts.map((post) => {
                                return (
                                    <PostCard key={post.uri} post={post}></PostCard>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
