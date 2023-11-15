import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';

export async function getServerSideProps(context) {

    const { schoolSlug } = context.params;

    const GET_SCHOOLS = gql`
    query GetSchoolDetails($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          featuredImage {
            node {
              sourceUrl
            }
          }
          schoolSettings {
            details {
                corporate {
                    schoolName
                    address {
                      streetAddress
                      streetAddress2
                      city
                      state
                      zipcode
                    }
                    emailAddress
                    phoneNumber
                    latitude
                    longitude
                    schoolOpening
                  }
            }
          }
        }
      }
    `;
    try {
        const response = await client.query({
            query: GET_SCHOOLS,
            variables: { id: `/schools/${schoolSlug}/` }, // Make sure the ID matches the expected format for the URI in WP
        });

        console.log("GraphQL Response:", response); // Log the entire response

        if (response.errors) {
            console.error('GraphQL Errors:', response.errors);
            throw new Error(`Error fetching GraphQL data: ${response.errors}`);
        }

        const school = response?.data?.school;

        console.log("School Data:", school); // Log the school data

        if (!school) {
            return { notFound: true }; // If there's no school data, return a notFound response
        }

        return {
            props: {
                school,
                schoolSlug,
            },
        };
    } catch (error) {
        console.error('getServerSideProps Error:', error);
        // Return an error page or some error handling here
        return { props: { hasError: true } }; // Example error handling
    }
}

export default function SchoolMainPage({ school, schoolSlug }) {
    const { schoolSettings, featuredImage } = school;

    return (
        <section className='module pt-4 pb-4'>
            <div className='container'>
                <a href={`/schools/`}>
                    ← Back to Schools
                </a>
                <div className='row'>
                    <h1 className="title">{schoolSettings.schoolName}</h1>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                    {featuredImage && featuredImage.node && (
                        <img src={featuredImage.node.sourceUrl} alt={schoolSettings.schoolName} className='img-fluid' />
                    )}
                    </div>
                    <div className='col-12 col-md-7 offset-md-1'>
                        <p dangerouslySetInnerHTML={{ __html: schoolSettings.address }} />
                        <p><a href={`mailto:${schoolSettings.emailAddress}`}>{schoolSettings.emailAddress}</a></p>
                        <p><a href={`tel:${schoolSettings.phoneNumber}`}>{schoolSettings.phoneNumber}</a></p>
                        <a href={`/schools/${schoolSlug}/staff`}>View Staff</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
