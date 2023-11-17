import Image from "next/legacy/image";
import Link from 'next/link';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';

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
                {heading && <Heading level='h3'>{heading}</Heading>}
                {subheading && <Heading level='h2'>{subheading}</Heading>}
            </div>
            <div className='row text-center'>
                {blogs && blogs.map((blog, index) => {
                    const imageUrl = blog.featuredImage ? blog.featuredImage.node.sourceUrl : fallbackImageURL;
                    return (
                        <div key={index} className='col-12 col-lg-4'>
                            {imageUrl && <Image src={imageUrl} alt={`Featured image for ${blog.title}`} width={300} height={200} />}
                            {blog.title && <Heading level='h4'>{blog.title}</Heading>}
                            {blog.excerpt && <p dangerouslySetInnerHTML={{ __html: blog.excerpt }} />}
                            {blog.uri && <Button label='Read More' variant='primary' type='button' href={`/blogs${blog.uri}`} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedBlogs;
