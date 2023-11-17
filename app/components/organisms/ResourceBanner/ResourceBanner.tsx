import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Button from '../../atoms/Button/Button';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';

const GET_RESOURCE_BANNER_FIELDS = gql`
query GetResourceBannerFields($id: ID = "") {
  resourceType(id: $id, idType: SLUG) {
    ResourceBanner {
      icon {
        sourceUrl
		altText
      }
      blurb
      button {
        target
        title
        url
      }
      showNewsletterForm
    }
  }
}
`;
const ResourceBanner = ({ slug }) => {
	const { loading, error, data } = useQuery(GET_RESOURCE_BANNER_FIELDS, { variables: { id: slug } });

	if (loading) return <p>Loading banner...</p>;
	if (error) return <p>Error in banner: {error.message}</p>;

	const bannerData = data?.resourceType?.ResourceBanner;

	const hasContent = bannerData && (
		bannerData.icon?.sourceUrl ||
		bannerData.icon?.altText ||
		bannerData.blurb ||
		bannerData.button?.title ||
		bannerData.button?.url ||
		bannerData.showNewsletterForm
	);

	if (!hasContent) return null;

	return (
		<div className="resource-banner mt-5 mb-4 pt-4 pb-4 pt-lg-4 pb-lg-4 d-lg-flex justify-content-lg-between align-items-lg-center">

			{(bannerData.icon?.sourceUrl || bannerData.blurb) && (
				<div className='d-flex flex-column flex-lg-row justify-center justify-content-lg-start align-items-center text-center w-100'>

					{bannerData.icon?.sourceUrl && (
						<div className='icon-wrapper pe-lg-3 mb-3 mb-lg-0'>
							<img src={bannerData.icon.sourceUrl} alt={bannerData.icon.altText} width={100} height={100} className='icon mx-auto' />
						</div>
					)}

					{bannerData.blurb && (
						<div className='ps-4 pe-4 pb-3 ps-lg-0 pe-lg-0 pb-lg-0 text-lg-start' dangerouslySetInnerHTML={{ __html: bannerData.blurb }} />
					)}
				</div>
			)}

			<div className='right'>

				{bannerData.showNewsletterForm && (
					<NewsletterForm />
				)}

				{bannerData.button?.title && bannerData.button?.url && (
					<div className='newsroom d-flex flex-column flex-lg-row justify-center justify-content-lg-between align-items-center text-center'>
						<div className='me-lg-5 ms-lg-auto border-left'>
							<Button
								variant="primary"
								label={bannerData.button.title}
								href={bannerData.button.url}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ResourceBanner;
