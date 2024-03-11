import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Button from '../../../app/components/atoms/Button/Button';
import SelectDropdown, {OptionType} from '../../../app/components/molecules/SelectDropdown/SelectDropdown';
import defaultThumb from '../../../public/assets/staff-default-thumbnail.jpg';
import FranchiseOwnerBio from "../../../app/components/modules/FranchiseOwnerModal/FranchiseOwnerBio";
import ScheduleATourSlider from "../../../components/schools/ScheduleATourSlider";
import Head from "next/head";

interface StaffMember {
  altText?: string;
  image: {
    sourceUrl: string;
  };
  name: string;
  title: string;
  bio: string;
  group: string;
}

export async function getServerSideProps(context) {
  const { schoolSlug } = context.params;

  const GET_SCHOOL_STAFF = gql`
    query SchoolData($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          title
          schoolCorporateSettings {
            usesCalendly
            staffMeta {
              description
              fieldGroupName
              title
            }
          }
          schoolAdminSettings {
            staffMembers {
              bio
              classroomAssignment
              group
              image {
                mediaItemUrl
                sourceUrl
              }
              altText
              name
              title
            }
            meetStaffImage {
              altText
              mediaItemUrl
              sourceUrl
            }
            franchiseOwner {
              bio
              multipleOwners
              name
              image {
                altText
                sourceUrl
                mediaItemUrl
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

  const school = response?.data?.school
  const staff = response?.data?.school?.schoolAdminSettings?.staffMembers;
  const schoolAdminSettings = response?.data?.school?.schoolAdminSettings;
  const franchiseOwner = response?.data?.school?.schoolAdminSettings?.franchiseOwner;
  console.log(staff);
  return {
    props: {
      school,
      staff,
      schoolSlug,
      schoolAdminSettings,
      franchiseOwner
    },
  };
}

export default function StaffPage({ school, staff, schoolSlug, schoolAdminSettings, franchiseOwner }) {

  const [activeBio, setActiveBio] = useState(null);
  const [bioHeights, setBioHeights] = useState({});
  const initialStaffCount = 20;
  const [visibleStaffCount, setVisibleStaffCount] = useState(initialStaffCount);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState<StaffMember[]>(staff);
  const [selectedGroup, setSelectedGroup] = useState<OptionType>(null);
  const metaTitle = school.schoolCorporateSettings?.staffMeta?.title ?? `Franchise Owner(s) and Staff | Primrose School of ${school?.title}`
  const metaDesc = school.schoolCorporateSettings?.staffMeta?.description
  const loadMoreStaff = () => {
    setVisibleStaffCount((prevCount) => prevCount + 4); 
  };

  const canLoadMore = filteredStaffMembers?.length > visibleStaffCount;

  const handleToggleBio = (index) => {
    if (activeBio !== index) {
      measureBioHeight(index);
    }
    setActiveBio(activeBio === index ? null : index);
  };

  const measureBioHeight = (index) => {
    requestAnimationFrame(() => {
      const bioElement = document.querySelector(`#bio-${index}`);
      if (bioElement) { // null check
        const height = bioElement.scrollHeight;
        setBioHeights({ ...bioHeights, [index]: height });
      }
    });
  };

  const groupOptions = [
    { label: 'All Teachers & Staff', value: 'All' },
    { label: 'Leadership', value: 'Leadership' },
    { label: 'Teachers', value: 'Teacher' },
    { label: 'Staff', value: 'Staff' }
  ]

  useEffect(() => {
    const filtered = !selectedGroup || selectedGroup.value === 'All'
        ? staff
        : staff?.filter(member => member.group === selectedGroup.value);

    setFilteredStaffMembers(filtered);
  }, [selectedGroup, staff]);
  const handleSelectedGroup = (selectedOption) => {
    setSelectedGroup(selectedOption);
  };
  const defaultImages =[
      {url: '/schoolsHomeDefault/scrollies-1.jpg', altText: "A child and teacher's hand on a book",},
      {url: '/schoolsHomeDefault/scrollies-2.jpg', altText: 'A young boy playing with toys',},
      {url: '/schoolsHomeDefault/scrollies-3.jpg', altText: 'A young boy playing to the floor looking up at camera',},
      {url: '/schoolsHomeDefault/scrollies-4.jpg', altText: 'A young boy smiling at camera',},
      {url: '/schoolsHomeDefault/scrollies-5.jpg', altText: 'A young boy looking at camera',}
  ]

  return (
    <div className='school staff'>
      <Head>
        <title>{metaTitle}</title>
        {metaDesc && <meta name={"description"} content={metaDesc}/>}
      </Head>
      <div className='row'>
        <div className='staff-members-section'>
          <div className='heading'>
            <h1>Teachers & Staff</h1>
            <div className='filter'>
            <SelectDropdown
                selectedOption={selectedGroup}
                options={groupOptions}
                placeholder="Select A Category"
                onSelect={handleSelectedGroup}
                type={"filter"}
            />
            </div>
          </div>
          <div className='staff-members'>

            {filteredStaffMembers?.slice(0, visibleStaffCount).map((member, index) => (
              <div className={`staff-member ${activeBio === index ? 'expanded' : ''}`} key={index}>
                <div className='row align-items-center'>
                  <div className='col-4'>
                    {member.image ? <img src={member.image.sourceUrl} alt={member.name} className="img-fluid" /> : <img src={defaultThumb.src} alt="Primrose Staff Member Photo" className="img-fluid" />}
                  </div>
                  <div className='col-7 '>
                    <div className='text-wrap pe-5'>
                      <h5 className='mb-0'>{member.name}</h5>
                      <div className='b3'>{member.title}</div>
                    </div>
                    {member.bio && (
                    <div id="button" onClick={() => handleToggleBio(index)} className={activeBio === index ? 'expanded' : ''}>
                      <span></span>
                      <span></span>
                    </div>
                    )}
                  </div>
                  <div className='col-12'>
                    <div
                      className={`bio ${activeBio === index ? 'expanded' : ''}`}
                      id={`bio-${index}`}
                      style={{ maxHeight: activeBio === index ? `${bioHeights[index]}px` : '0' }}
                    >
                      <div className='b3 p-3' dangerouslySetInnerHTML={{ __html: member.bio }} />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
            <div className="load-more d-flex align-items-center justify-content-center">
              {canLoadMore &&<Button onClick={loadMoreStaff}>Load More</Button>}
            </div>
        </div>
      </div>
      <div className='container'>
        {/* Franchise Owners Section */}
        {franchiseOwner && <FranchiseOwnerBio franchiseOwner={franchiseOwner}/>}
      </div>
      <ScheduleATourSlider schoolSlug={schoolSlug} images={defaultImages} usesCalendly={school?.schoolCorporateSettings?.usesCalendly}/>
    </div>
  );
}
