import Link from 'next/link';
import Tag from '../../atoms/Tag/Tag';

interface ResourceCardProps {
	resource: any;
	showFeaturedImage: boolean;
	className?: string;
	onTagClick?: (tagSlug: string) => void; 

}

// sort by "Featured" tag for the list of tags displayed in resource card
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

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, showFeaturedImage, className, onTagClick }) => {
	return (
		<div className={`card ${className ? className : ''}`}>
			<Link
				href={`${resource.uri}`}
				onClick={(e) => {
					if (e.defaultPrevented) {
					e.preventDefault();
					}
				}}
				>
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
							<div className='details d-flex justify-start align-items-center'>
								<div className='caption position-relative me-3'>{resource.resourceTypes.nodes.map(type => type.name).join(', ')}</div>
								<div className='date mb-0'>{formatDate(resource.date)}</div>
							</div>
							<h3 className='title pt-2 pb-4'>{resource.title}</h3>
							<div className='excerpt' dangerouslySetInnerHTML={{ __html: resource.excerpt }} />
						</div>
						<div className='tags-wrapper'>
							<div className='tags d-flex flex-wrap'>
							{sortTags(resource.resourceTags.nodes).map((tag, index) => (
								<div key={index} onClick={(e) => {
									e.stopPropagation();
									e.preventDefault(); 
									onTagClick && onTagClick(tag.slug);
								  }}>
									<Tag
									  label={tag.name}
									  isFeatured={tag.slug === 'featured'}
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