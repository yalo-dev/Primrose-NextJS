import Image from 'next/image';
import Link from 'next/link';
import Button from '../../atoms/Button/Button';

interface Blog {
    id: string;
    title: string;
    uri: string;
    excerpt: string;
    featuredImage: {
        node: {
            sourceUrl: string;
        };
    };
}

interface FeaturedBlogsProps {
    heading: string;
    subheading: string;
    blogs: Blog[];
}
const fallbackImageURL = 'assets/logo.svg';

const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({ heading, subheading, blogs }) => {
    return (
        <div className='container'>
            <div className='row text-center'>
                <h2>{heading}</h2>
                <h3>{subheading}</h3>
            </div>
            <div className='row text-center'>
                {blogs.map((blog, index) => {
                const imageUrl = blog.featuredImage ? blog.featuredImage.node.sourceUrl : fallbackImageURL;
                return (
                    <div key={index} className='col-12 col-lg-4'>
                        <Image src={imageUrl} alt={`Featured image for ${blog.title}`} width={300} height={200} />
                        <h4>{blog.title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: blog.excerpt }} />
                        <Button label='Read More' variant='primary' type='button' href={`/blogs${blog.uri}`} />
                    </div>
                );
                })}
            </div>
        </div>
    );
};

export default FeaturedBlogs;
