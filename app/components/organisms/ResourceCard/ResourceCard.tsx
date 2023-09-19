import Link from 'next/link';
import Tag from '../../atoms/Tag/Tag';

interface ResourceCardProps {
	resource: any;
	showFeaturedImage: boolean;
	className?: string;
}

// sort by "Featured" tag
const sortTags = (tags) => {
	const tagsCopy = [...tags];
	return tagsCopy.sort((a, b) => {
		if (a.slug === 'featured') return -1;
		if (b.slug === 'featured') return 1;
		return 0;
	});
};

// format date 
const formatDate = (dateString) => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', options);
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, showFeaturedImage, className }) => {
	return (
		<div className={`card ${className ? className : ''}`}>
			<Link href={`${resource.uri}`}>
				<div className='inner'>
					{showFeaturedImage && resource.featuredImage && resource.featuredImage.node && (
						<div className='image-wrapper'>
							<div
								className='image'
								style={{
									backgroundImage: `url(${resource.featuredImage.node.sourceUrl})`,
								}}
								aria-label={resource.title}
							>
							</div>
						</div>
					)}
					<div className='content-wrapper'>
						<div className='details-wrapper'>
							<div className='details'>
								<div className='type me-3'>{resource.resourceTypes.nodes.map(type => type.name).join(', ')}</div>
								<div className='date'>{formatDate(resource.date)}</div>
							</div>
							<h3 className='title'>{resource.title}</h3>
							<div className='excerpt' dangerouslySetInnerHTML={{ __html: resource.excerpt }} />
						</div>
						<div className='tags-wrapper'>
							<div className='tags m-1'>
								{sortTags(resource.resourceTags.nodes).map((tag, index) => (
									<Tag
										key={index}
										label={tag.name}
										isFeatured={tag.slug === 'featured'}
									/>
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