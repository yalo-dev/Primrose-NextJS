import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';

export async function getServerSideProps(context) {
    const { schoolSlug } = context.params;

    const GET_SCHOOL_STAFF = gql`
      query GetSchoolStaff($id: ID!) {
        school(id: $id, idType: URI) {
          schoolSettings {
            staff {
              name
              title
              bio
              image {
                sourceUrl
              }
            }
          }
        }
      }
    `;

    const response = await client.query({
        query: GET_SCHOOL_STAFF,
        variables: { id: schoolSlug }
    });

    const staff = response?.data?.school?.schoolSettings?.staff;

    return {
        props: {
            staff,
            schoolSlug
        },
    };
}

export default function StaffPage({ staff, schoolSlug }) {
    return (
        <section className='module pt-4 pb-4'>
            <div className='container'>
                <div className='row'>
                    <a href={`/schools/${schoolSlug}`}>
                        ← Back to School
                    </a>
                </div>
                {staff.map((member, index) => (
                    <div className='row' key={index}>
                        <div className='col-12 col-md-4' key={index}>
                            {member.image && <img src={member.image.sourceUrl} alt={member.name} className='img-fluid' />}
                        </div>
                        <div className='col-12 col-md-7 offset-md-1'>
                            <h2>{member.name}</h2>
                            <p>{member.title}</p>
                            <p dangerouslySetInnerHTML={{ __html: member.bio }} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
