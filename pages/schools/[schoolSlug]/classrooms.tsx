import { useQuery, gql } from "@apollo/client";
import Image from 'next/image';
import { useRouter } from 'next/router'; 
import Heading from "../../../app/components/atoms/Heading/Heading";
import Subheading from "../../../app/components/atoms/Subheading/Subheading";
import Paragraph from "../../../app/components/atoms/Paragraph/Paragraph";
import Button from "../../../app/components/atoms/Button/Button";
import { useEffect, useState } from "react";

const GET_SCHOOL_DETAILS = gql`
  query SchoolData($id: ID!) {
    school(id: $id, idType: URI) {
      id
      schoolId
      slug
      uri
      schoolSettings {
        classrooms {
          heroWithImage {
            leftColumn {
              image {
                sourceUrl
              }
            }
            rightColumn {
                icon {
                    sourceUrl
                  }
              blurb
              button {
                target
                title
                url
              }
              eyebrow
              heading
              subheading
            }
          }
        }
      }
    }
  }
`;

export default function ClassroomPage() {
    const router = useRouter();  
    const [currentSlug, setCurrentSlug] = useState<string | null>(null);

    useEffect(() => {
      if (router.isReady) {
        // Extract slug from router query and ensure it is either a string or null
        const slugFromArray = Array.isArray(router.query.schoolSlug)
          ? router.query.schoolSlug[0]
          : router.query.schoolSlug;
        const slugValue = slugFromArray !== undefined ? slugFromArray : null;
        
        setCurrentSlug(slugValue);
      }
    }, [router.isReady, router.query.schoolSlug]);
    
      
      
      

  const { data, loading, error } = useQuery(GET_SCHOOL_DETAILS, {
    variables: { id: currentSlug || '' },
    skip: !currentSlug,
  });

  if (loading) return <div></div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.school) return <div>No school data found.</div>;

  const { heroWithImage } = data.school.schoolSettings.classrooms;

  return (
    <>
      <div className="container">
        <div className='hero-with-image reverse-column'>
          {heroWithImage?.leftColumn?.image?.sourceUrl && (
            <div className='left-column col-12 col-lg-6'>
              <Image 
                src={heroWithImage.leftColumn.image.sourceUrl} 
                alt="Hero Image" 
                layout="fill" 
                objectFit="cover" 
              />
            </div>
          )}
          {heroWithImage?.rightColumn && (
            <div className='right-column col-12 col-lg-6'>
                {heroWithImage?.rightColumn?.icon?.sourceUrl && (
                <div className='icon'>
                    <Image 
                    src={heroWithImage.rightColumn.icon.sourceUrl} 
                    alt="Hero Image" 
                    layout="fill" 
                    objectFit="cover" 
                />
                </div>
                )}
              {heroWithImage.rightColumn.eyebrow && <Heading level='h5'>{heroWithImage.rightColumn.eyebrow}</Heading>}
              {heroWithImage.rightColumn.heading && <Heading level='h2'>{heroWithImage.rightColumn.heading}</Heading>}
              {heroWithImage.rightColumn.subheading && <Subheading level='h5'>{heroWithImage.rightColumn.subheading}</Subheading>}
              {heroWithImage.rightColumn.blurb && <Paragraph className='b2'>{heroWithImage.rightColumn.blurb}</Paragraph>}
              {heroWithImage.rightColumn.button?.url && heroWithImage.rightColumn.button.title && (
                <Button 
                  variant='primary' 
                  href={heroWithImage.rightColumn.button.url} 
                  target={heroWithImage.rightColumn.button.target || '_self'}
                >
                  {heroWithImage.rightColumn.button.title}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
