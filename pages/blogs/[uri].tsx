import { client } from '../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';

export async function getServerSideProps({ params }) {
    const GET_POST_BY_URI = gql`
    query GetPostByURI($id: ID!) {
        post(id: $id, idType: URI) {
          title
          content
          date
          uri
          author {
            node {
              lastName
              firstName
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }`;

    const response = await client.query({
        query: GET_POST_BY_URI,
        variables: {
            id: params.uri
        }
    });

    const post = response?.data?.post;
    return {
        props: {
            post
        }
    };
}

export default function SlugPage({ post }) {
    return (
        <section className='module pt-4 pb-4'>
            <div className='container'>
                <div className='row'>
                    <Link href={`/blogs/`}>
                        ← Back to Blogs
                    </Link>
                    <div className='col-12 col-md-4'>
                    {post.featuredImage && post.featuredImage.node && (
                        <img src={post.featuredImage.node.sourceUrl} alt={post.title} className='img-fluid' />
                    )}
                    </div>
                    <div className='col-12 col-md-4'>
                        <h1 className="title">
                            {post.title}
                        </h1>
                        <p>✍️  &nbsp;&nbsp;{`${post.author.node.firstName} ${post.author.node.lastName}`} | 🗓️ &nbsp;&nbsp;{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                    <div className='row'>
                        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
                    </div>
                </div>
            </div>
        </section>
    )
}
