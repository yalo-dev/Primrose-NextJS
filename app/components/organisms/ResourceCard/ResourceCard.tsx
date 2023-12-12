import Link from 'next/link';
import Tag from '../../atoms/Tag/Tag';
import Heading from '../../atoms/Heading/Heading';

interface ResourceCardProps {
    resource: any;
    showFeaturedImage: boolean;
    showExcerptIfNoImage?: boolean;
    className?: string;
    featuredResourceIds?: string[];
    isFeatured?: boolean; 
}

const sortTags = (tags) => {
    const tagsCopy = [...tags];
    return tagsCopy.sort((a, b) => {
        if (a.slug === 'featured') return -1;
        if (b.slug === 'featured') return 1;
        return 0;
    });
};

const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, showFeaturedImage, showExcerptIfNoImage, className = 'medium', featuredResourceIds = [] }) => {
    const isResourceFeatured = featuredResourceIds.includes(resource.id);

    let tags = [...resource.resourceTags.nodes];
    if (isResourceFeatured && !tags.some(tag => tag.slug === 'featured')) {
        tags = [{ name: 'Featured', slug: 'featured' }, ...tags];
    }


    return (
        <div className={`card ${className ? className : ''}`}>
            <Link href={`${resource.uri}`}>
                <div className='inner' onClick={(e) => {
                    if (e.defaultPrevented) {
                        e.stopPropagation();
                    }
                }}>
                    {showFeaturedImage && resource.featuredImage && resource.featuredImage.node && (
                        <div className='image-wrapper'>
                            <div
                                className='image'
                                style={{
                                    backgroundImage: `url(${resource.featuredImage.node.sourceUrl})`,
                                }}
                                aria-label={resource.title}
                            ></div>
                        </div>
                    )}
                    <div className='content-wrapper'>
                        <div className='details-wrapper'>
                            <div className='details d-flex justify-start align-items-center'>
                                <div className='caption position-relative me-3'>{resource.resourceTypes.nodes.map(type => type.name).join(', ')}</div>
                                <div className='date mb-0'>{formatDate(resource.date)}</div>
                            </div>
                            <Heading level='h3' className='title pt-2 pb-4'>{resource.title}</Heading>
                            {!(showFeaturedImage && resource.featuredImage && resource.featuredImage.node) && (
                                <div className='b3 pt-3 pb-3' dangerouslySetInnerHTML={{ __html: resource.excerpt.replace(/<\/?p>/g, '') }} ></div>
                            )}
                            <div className='excerpt' dangerouslySetInnerHTML={{ __html: resource.excerpt }} />
                        </div>
                        <div className='tags-wrapper'>
                            <div className='tags d-flex flex-wrap'>
                                {sortTags(tags).map((tag, index) => (
                                    <div key={index}>
                                        <Tag
                                            label={tag.name}
                                            isFeatured={tag.slug === 'featured'}
                                            tagSlug={tag.slug}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </Link>
        </div>
    );
}

export default ResourceCard;