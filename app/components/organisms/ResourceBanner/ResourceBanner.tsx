import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Button from '../../atoms/Button/Button';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Image from 'next/image';

const GET_RESOURCE_BANNER_DATA = gql`
query GetResourcesSettings {
    resourcesSettings {
      resourcesSettings {
        blurbF
        blurbN
        buttonN {
          target
          title
          url
        }
        formIdF
        iconF {
          sourceUrl
        }
        iconN {
          sourceUrl
        }
      }
    }
  }
`;

const ResourceBanner = ({ slug }) => {
  const { loading, error, data } = useQuery(GET_RESOURCE_BANNER_DATA);

  if (loading) return <p>Loading banner...</p>;
  if (error) return <p>Error in banner: {error.message}</p>;

  const settings = data.resourcesSettings.resourcesSettings;
  const bannerData = {
    icon: slug === 'families' ? settings.iconF.sourceUrl : settings.iconN.sourceUrl,
    blurb: slug === 'families' ? settings.blurbF : settings.blurbN,
    formId: slug === 'families' ? settings.formIdF : null,
    button: slug === 'newsroom' ? settings.buttonN : null,
  };

  return (
    <div className="resource-banner mt-5 mb-5 pt-4 pb-4 pt-lg-4 pb-lg-4">
      {slug === 'families' && bannerData.formId ? (
        <div className='families d-flex flex-column flex-lg-row justify-center justify-content-lg-between align-items-center text-center'>
          <div className='d-flex flex-column flex-lg-row align-items-lg-center'>

            <div className='icon-wrapper pe-lg-3 mb-3 mb-lg-0'>
              <Image src={bannerData.icon} alt="Banner Icon" width={100} height={100} className='icon mx-auto' />
            </div>

            <div className='ps-4 pe-4 pb-3 ps-lg-0 pe-lg-0 pb-lg-0 text-lg-start' dangerouslySetInnerHTML={{ __html: bannerData.blurb }} />
          </div>

          <div>
            <NewsletterForm />
          </div>
        </div>
      ) : null}
      {slug === 'newsroom' && bannerData.button ? (
        <div className='newsroom d-flex flex-column flex-lg-row justify-center justify-content-lg-between align-items-center text-center'>
          <div className='d-flex flex-column flex-lg-row align-items-lg-center'>

            <div className='icon-wrapper pe-lg-3 mb-3 mb-lg-0'>
              <Image src={bannerData.icon} alt="Banner Icon" width={100} height={100} className='icon mx-auto' />
            </div>

            <div className='ps-4 pe-4 pb-3 ps-lg-0 pe-lg-0 pb-lg-0 text-lg-start' dangerouslySetInnerHTML={{ __html: bannerData.blurb }} />
          </div>

          <div className='me-lg-5 border-left'>
            <Button
              variant="primary"
              label={bannerData.button.title}
              href={bannerData.button.url}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResourceBanner;