import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';

export async function getServerSideProps(context) {

    const { schoolSlug } = context.params;

    const GET_SCHOOLS = gql`
    query GetSchoolDetails($id: ID!) {
      school(id: $id, idType: URI) {
      id
        featuredImage {
          node {
          sourceUrl
          }
        }
        schoolSettings {
          schoolName
          address
          emailAddress
          phoneNumber
        }
      }
    }
    `;

    const response = await client.query({
        query: GET_SCHOOLS,
        variables: { id: schoolSlug }
    });

    const school = response?.data?.school;

    return {
        props: {
            school,
            schoolSlug 
        },
    };
}

export default function SchoolMainPage({ school, schoolSlug }) {
    const { schoolSettings, featuredImage } = school;

    return (
        <section className='module pt-4 pb-4'>
            <div className='container'>
                <Link href={`/schools/`}>
                    ← Back to Schools
                </Link>
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
                        <Link href={`/schools/${schoolSlug}/staff`}>View Staff</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
