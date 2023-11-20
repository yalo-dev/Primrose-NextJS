import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Heading from '../../../app/components/atoms/Heading/Heading';
import Subheading from '../../../app/components/atoms/Subheading/Subheading';
import Button from '../../../app/components/atoms/Button/Button';
import { MultiSelectDropdown } from '../../../app/components/molecules/MultiSelectDropdown/MultiSelectDropdown';

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
          schoolSettings {
            details {
              general {
                scheduleATour {
                  heading
                  subheading
                  button {
                    target
                    title
                    url
                  }
                  images {
                    altText
                    image {
                      sourceUrl
                    }
                  }
                }
              }
            }
            staff {
              staffMembers {
                altText
                image {
                  sourceUrl
                }
                name
                title
                bio
                group
              }
              franchiseOwners {
                leftColumn {
                  name
                  bio
                  oneOrMultiple
                }
                rightColumn {
                  altText
                  image {
                    sourceUrl
                  }
                }
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
  const ScheduleATour = response?.data?.school?.schoolSettings?.details?.general?.scheduleATour;

  return {
    props: {
      staff,
      schoolSlug,
      ScheduleATour
    },
  };
}

export default function StaffPage({ staff, schoolSlug, ScheduleATour }) {

  const hasScheduleATour = !!ScheduleATour?.heading || !!ScheduleATour?.subheading || !!ScheduleATour?.button || (ScheduleATour?.images && ScheduleATour?.images.length > 0);

  const leftScrollerRef = useRef<HTMLDivElement>(null);
  const rightScrollerRef = useRef<HTMLDivElement>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [activeBio, setActiveBio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bioHeights, setBioHeights] = useState({});
  const initialStaffCount = 20;
  const [visibleStaffCount, setVisibleStaffCount] = useState(initialStaffCount);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState<StaffMember[]>(staff.staffMembers);

  const loadMoreStaff = () => {
    setVisibleStaffCount((prevCount) => prevCount + 4); 
  };

  const canLoadMore = staff.staffMembers.length > visibleStaffCount;

  const handleToggleBio = (index) => {
    if (activeBio !== index) {
      measureBioHeight(index);
    }
    setActiveBio(activeBio === index ? null : index);
  };

  const scrollContent = () => {
    const leftScroller = leftScrollerRef.current;
    const rightScroller = rightScrollerRef.current;

    if (leftScroller) {
      leftScroller.scrollTop += 1;
      if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
        leftScroller.scrollTop = 0;
      }
    }

    if (rightScroller) {
      rightScroller.scrollTop -= 1;
      if (rightScroller.scrollTop <= 0) {
        rightScroller.scrollTop = rightScroller.scrollHeight / 2;
      }
    }
  };

  useEffect(() => {
    const checkIfImagesLoaded = () => {
      const images = document.querySelectorAll('.find-a-school .image-scroller img');
      return Array.from(images).every((img) => (img as HTMLImageElement).complete);
    };
    if (checkIfImagesLoaded()) {
      setAllImagesLoaded(true);
      setInterval(scrollContent, 20);
    } else {
      const images = document.querySelectorAll('.find-a-school .image-scroller img');
      images.forEach((img) => {
        img.addEventListener('load', () => {
          if (checkIfImagesLoaded()) {
            setAllImagesLoaded(true);
            setInterval(scrollContent, 20);
          }
        });
      });
    }
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };

  const Modal = ({ show, onClose, imageSrc, bio }) => {
    return (
      <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
          <div className='close' onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="29" viewBox="0 0 32 29" fill="none">
              <circle cx="10.5" cy="10.5" r="9.75" transform="matrix(0.733776 0.679391 -0.733776 0.679391 15.8516 0.036377)" stroke="#858783" strokeWidth="1.5" />
              <rect width="1.28571" height="9" transform="matrix(0.733776 0.679391 -0.733776 0.679391 18.6797 10.8098)" fill="#5E6738" />
              <rect width="1.28571" height="9" transform="matrix(0.733776 -0.679391 0.733776 0.679391 12.082 11.6824)" fill="#5E6738" />
            </svg>
          </div>
          <div className='two-columns-image-and-text-alternative'>
            <div className='left-column col-12 col-lg-5'>
              <img src={imageSrc} alt='Franchise Owner' />
            </div>
            <div className='right-column col-12 col-lg-5 offset-lg-1'>
              <h5 className='b4'>{staff.franchiseOwners.leftColumn?.name}</h5>
              <div className='b3 pb-3'>{staff.franchiseOwners.leftColumn?.oneOrMultiple === 'One' ? 'Franchise Owner' : 'Franchise Owners'}</div>
              <p className='b2' dangerouslySetInnerHTML={{ __html: bio }} />
            </div>
          </div>
        </div>
      </div>
    );
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
  ];

  const handleSelectedGroups = (selectedValues) => {
    setSelectedGroups(selectedValues);
  };
  // useEffect(() => {
  //   if (selectedGroups.includes('All') || selectedGroups.length === 0) {
  //     setFilteredStaffMembers(staff.staffMembers);
  //   } else {
  //     const filtered = staff.staffMembers.filter(member =>
  //       selectedGroups.length === 0 || selectedGroups.includes(member.group)
  //   );
  //   setFilteredStaffMembers(filtered);
  //   }
  // }, [selectedGroups, staff.staffMembers]);
  useEffect(() => {
    const filtered = selectedGroups.length === 0 || selectedGroups.includes('All') 
        ? staff.staffMembers 
        : staff.staffMembers.filter(member => selectedGroups.includes(member.group));

    setFilteredStaffMembers(filtered);
}, [selectedGroups, staff.staffMembers]);


  return (
    <div className='staff'>
      {/* Staff Members Section */}
      <div className='row'>
        <div className='staff-members-section'>
          <div className='heading'>
            <h1>Teachers & Staff</h1>
            <div className='filter'>
               <MultiSelectDropdown
                options={groupOptions}
                onSelect={handleSelectedGroups}
                placeholder="All Teachers & Staff"
                selected={selectedGroups}
              />
            </div>
          </div>
          <div className='staff-members'>

            {filteredStaffMembers.slice(0, visibleStaffCount).map((member, index) => (
              <div className={`staff-member ${activeBio === index ? 'expanded' : ''}`} key={index}>
                <div className='row align-items-center'>
                  <div className='col-5'>
                    {member.image && <img src={member.image.sourceUrl} alt={member.name} className='img-fluid' />}
                  </div>
                  <div className='col-7 '>
                    <div className='text-wrap pe-5'>
                      <h5 className='mb-0'>{member.name}</h5>
                      <div className='b3'>{member.title}</div>
                      <span className='staff-group'>{member.group}</span>
                    </div>
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
                  <div id="button" onClick={() => handleToggleBio(index)} className={activeBio === index ? 'expanded' : ''}>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {canLoadMore && (
            <div className="load-more d-flex align-items-center justify-content-center">
              <Button onClick={loadMoreStaff}>Load More</Button>
            </div>
          )}
        </div>
      </div>
      <div className='container'>
        {/* Franchise Owners Section */}
        <div className='row'>
          <div className='franchise-owners'>
            {staff.franchiseOwners && (
              <div className='two-columns-image-and-text-alternative reverse-column'>
                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                  {staff.franchiseOwners.rightColumn?.image && (
                    <img
                      src={staff.franchiseOwners.rightColumn.image.sourceUrl}
                      alt={staff.franchiseOwners.rightColumn.altText || 'feature image'}
                      className='img-fluid'
                      width="500"
                      height="500"
                    />
                  )}
                </div>
                <div className='right-column col-12 col-lg-5'>
                  <h2>{staff.franchiseOwners.leftColumn?.oneOrMultiple === 'One' ? 'Franchise Owner' : 'Franchise Owners'}</h2>
                  <h5>{staff.franchiseOwners.leftColumn?.name}</h5>
                  <p className='b3'>{truncateText(staff.franchiseOwners.leftColumn?.bio, 280)}</p>
                  <Button onClick={handleOpenModal}>Read More</Button>
                  <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    imageSrc={staff.franchiseOwners.rightColumn.image.sourceUrl}
                    bio={staff.franchiseOwners.leftColumn.bio}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {hasScheduleATour && (
        <div className='container'>
          <div className='find-a-school'>
            <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
              {ScheduleATour?.heading && <Heading level='h2'>{ScheduleATour.heading}</Heading>}
              {ScheduleATour?.subheading && <Subheading level='div' className='b3'>{ScheduleATour.subheading}</Subheading>}
              {ScheduleATour?.button?.url && ScheduleATour?.button.title && (
                <Button variant='secondary' href={ScheduleATour.button.url} target={ScheduleATour.button.target || '_self'}>
                  {ScheduleATour.button.title}
                </Button>
              )}
            </div>
            <div className='right-column col-4 col-lg-5 col-xxl-6'>
              {ScheduleATour.images && ScheduleATour.images.length > 0 && (
                <>
                  <div className="image-scroller first" ref={leftScrollerRef}>
                    {ScheduleATour.images.map((imgObj, idx) => (
                      imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                    ))}
                    {ScheduleATour.images.map((imgObj, idx) => (
                      imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                    ))}
                  </div>
                  <div className="image-scroller second" ref={rightScrollerRef}>
                    {ScheduleATour.images.map((imgObj, idx) => (
                      imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                    ))}
                    {ScheduleATour.images.map((imgObj, idx) => (
                      imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl} alt={imgObj.altText || 'slider image'} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
