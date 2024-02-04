import { gql } from '@apollo/client';
import { client } from '../../../app/lib/apollo';
import { useRouter } from 'next/router';
export async function getServerSideProps(context) {
    const { schoolSlug } = context.params;

    const GET_THANKS_FIELDS = gql`
        query SchoolData($id: ID!) {
            school(id: $id, idType: URI) {
          id
          slug
          uri
          schoolSettings {
            details {
              general {
                instagram {
                  url
                }
                facebook {
                  url
                }
                schoolHours
              }
              corporate {
                emailAddress
                phoneNumber
                schoolName
                address {
                  streetAddress
                  streetAddress2
                  city
                  state
                  zipcode
                }
              }
            }
          }
        }
      }
    `;
    const response = await client.query({
        query: GET_THANKS_FIELDS,
        variables: { id: schoolSlug } 
    });

    const schoolData = response?.data?.school;
    const schoolSettings = schoolData?.schoolSettings?.details;

    return {
        props: {
            schoolSlugValue: schoolData?.slug,
            corporate: schoolSettings?.corporate,
            socialLinks: {
                facebook: schoolSettings?.general?.facebook?.url,
                instagram: schoolSettings?.general?.instagram?.url
            },
            schoolHours: schoolSettings?.general?.schoolHours
        },
    };
}
//const router = useRouter();
export default function SchoolDataSlug({schoolSlugValue}) {
    console.log('schoolSlugValue: ', schoolSlugValue);
    return schoolSlugValue;
    }
// export default function SchoolDataSlug({schoolSlugValue}) {
// const SchoolData = (a) => {
//     console.log('schoolSlugValue: ', schoolSlugValue, a, a.schoolSlugValue);
//     return <SchoolData schoolSlugValue={schoolSlugValue} />;
//     }
// }
// export interface GFSchoolData {
//     id: number;
//     slug: string;
//   }


  //export default GFSchoolData;
// export default function SchoolData({schoolSlugValue}) {
//     const gfSchoolData = [
//         {
//           id: 1,
//           slug: schoolSlugValue,
//         }
//     ];
//         console.log('gfSchoolData: ', gfSchoolData);
//     //console.log('schoolSlugValue: ', schoolSlugInput);
//     const schoolSlug  = schoolSlugValue;
//     console.log('Ms.Henderson: ', schoolSlug, {schoolSlug}, {schoolSlugValue});
//     return (
//         <div>
//             <h1>Thank you for your submission!</h1>
//             <p>We will be in touch with you shortly.</p>
//         </div>
//     );
// }
