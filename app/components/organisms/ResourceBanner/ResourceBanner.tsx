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
    <div className="resource-banner d-flex flex-column flex-lg-row justify-center justify-content-lg-start align-items-center text-center mt-4 mb-4 pt-4 pb-4">
      <div className='icon-wrapper pe-lg-3'>
        <Image src={bannerData.icon} alt="Banner Icon" width={75} height={75} className='m-auto mb-2 icon' />
      </div>
      <div className='blurb pb-2 pb-lg-0 text-lg-start' dangerouslySetInnerHTML={{ __html: bannerData.blurb }} />
      {slug === 'families' && bannerData.formId ? (
        <NewsletterForm />  
      ) : null}

      {slug === 'newsroom' && bannerData.button ? (
        <Button 
          variant="primary" 
          label={bannerData.button.title} 
          href={bannerData.button.url}
        />
      ) : null}
    </div>
  );
};

export default ResourceBanner;