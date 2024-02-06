import { client } from '../../../app/lib/apollo';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Heading from '../../../app/components/atoms/Heading/Heading';
import Subheading from '../../../app/components/atoms/Subheading/Subheading';
import Button from '../../../app/components/atoms/Button/Button';
import ResourceBanner from '../../../app/components/organisms/ResourceBanner/ResourceBanner';
import NewsletterForm from '../../../app/components/molecules/NewsletterForm/NewsletterForm';

export async function getServerSideProps(context) {
    const { schoolSlug } = context.params;

    const GET_THANKS_FIELDS = gql`
    query SchoolData($id: ID!) {
        school(id: $id, idType: URI) {
          id
          slug
          uri
          schoolAdminSettings {
            instagramLink
            yelpLink
            googleLink
            facebookLink
            hoursOfOperation {
              openingTime
              closingTime
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
                    mediaItemUrl
                    sourceUrl
                }
            }
          }
          schoolCorporateSettings {
            schoolName
            careerplugSchoolId
            address {
              city
              state
              zipcode
              streetAddress
              streetAddress2
            }
            phoneNumber
          }
        }
      }
    `;
    const response = await client.query({
        query: GET_THANKS_FIELDS,
        variables: { id: schoolSlug }
    });

    // Extract the data
    const staff = response?.data?.school?.schoolAdminSettings.meetStaffImage;
    const school = response?.data?.school;
    return {
        props: {
            school,
            staff,
            schoolSlug,
            socialLinks: {
                facebook: school.schoolAdminSettings.facebookLink,
                instagram: school.schoolAdminSettings.instagramLink
            }
        },
    };

}

export default function ThankYouPage({ school, staff, schoolSlug, socialLinks }) {

    const [showModal, setShowModal] = useState(false);
    const meetOurStaff = staff;
    const franchiseOwner = school.schoolAdminSettings.franchiseOwner;
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
                        <div className='left-column'>
                            <img src={imageSrc} alt='Franchise Owner' />
                        </div>
                        <div className='right-column'>
                            <h5 className='b4'>{franchiseOwner.name}</h5>
                            <div className='b3 pb-3'>{!franchiseOwner.multipleOwners  ? 'Franchise Owner' : 'Franchise Owners'}</div>
                            <div className='modal-bio' dangerouslySetInnerHTML={{ __html: bio }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='school thank-you'>
            <div className='container staff'>
                 {/* Thank You Section */}
                
                    <div className='franchise-owners'>
                        {franchiseOwner && (
                            <div className='thank two-columns-image-and-text-alternative reverse-column'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                        <img
                                            src='/assets/baby.png'
                                            alt='feature image'
                                            className='img-fluid'
                                            width="500"
                                            height="500"
                                        />
                                </div>
                                <div className='right-column col-12 col-lg-5'>
                                    <h2 className='green'>Thank You</h2>
                                    <p className='b3'>We look forward to meeting you!</p>
                                    <h5 className='green'>Connect With Us</h5>
                                    <div className='social d-flex'>
                                        {socialLinks.facebook && (
                                        <a href={socialLinks.facebook} className='fb' target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
                                            <path d="M45 30.9418C45 22.6066 38.2846 15.85 30.0019 15.85C21.7154 15.8519 15 22.6066 15 30.9437C15 38.4746 20.4856 44.7176 27.6547 45.85V35.3044H23.8489V30.9437H27.6584V27.616C27.6584 23.8346 29.8988 21.7461 33.324 21.7461C34.9663 21.7461 36.6817 22.0405 36.6817 22.0405V25.7525H34.79C32.9284 25.7525 32.3472 26.9167 32.3472 28.1109V30.9418H36.5054L35.8418 35.3025H32.3453V45.8481C39.5144 44.7157 45 38.4728 45 30.9418Z" fill="black"/>
                                        </svg>
                                        </a>
                                        )}
                                        {socialLinks.instagram && (
                                        <a href={socialLinks.instagram} className='ig' target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M36.7368 15.85H23.2848C18.7166 15.85 15 19.564 15 24.1289V37.5711C15 42.1361 18.7166 45.85 23.2848 45.85H36.7368C41.3054 45.85 45.0219 42.136 45.0219 37.5711V24.1289C45.0221 19.564 41.3054 15.85 36.7368 15.85ZM42.3584 37.5711C42.3584 40.6684 39.8366 43.1882 36.737 43.1882H23.2848C20.1853 43.1884 17.6637 40.6684 17.6637 37.5711V24.1289C17.6637 21.0317 20.1853 18.5117 23.2848 18.5117H36.7368C39.8364 18.5117 42.3583 21.0317 42.3583 24.1289V37.5711H42.3584ZM30.0141 23.1203C25.7484 23.1203 22.2782 26.588 22.2782 30.8505C22.2782 35.1129 25.7484 38.5804 30.0141 38.5804C34.2797 38.5804 37.75 35.1129 37.75 30.8505C37.75 26.588 34.2797 23.1203 30.0141 23.1203ZM30.0141 35.9185C27.2174 35.9185 24.9419 33.645 24.9419 30.8504C24.9419 28.0555 27.2172 25.7819 30.0141 25.7819C32.811 25.7819 35.0863 28.0555 35.0863 30.8504C35.0863 33.645 32.8108 35.9185 30.0141 35.9185ZM36.6956 21.4353C37.058 21.0715 37.5622 20.8639 38.0754 20.8639C38.5904 20.8639 39.0947 21.0715 39.4569 21.4353C39.821 21.7973 40.0288 22.3013 40.0288 22.8159C40.0288 23.3287 39.821 23.8327 39.4569 24.1964C39.0929 24.5584 38.5904 24.7678 38.0754 24.7678C37.5622 24.7678 37.0578 24.5584 36.6956 24.1964C36.3315 23.8327 36.122 23.3289 36.122 22.8159C36.122 22.3013 36.3314 21.7973 36.6956 21.4353Z" fill="black"/>
                                        </svg>
                                        </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
              

                <div className="resource-banner mt-3 mb-5 pt-4 pb-4 pt-lg-4 pb-lg-4 d-lg-flex justify-content-lg-between align-items-lg-center">
                    <div className='d-flex flex-column flex-lg-row justify-center justify-content-lg-start align-items-center text-center w-100'>
                        <div className='icon-wrapper pe-lg-3 mb-3 mb-lg-0'>
                            <svg className='icon mx-auto' width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50.5" cy="50" r="50" fill="#814C9E" />
                                <g clipPath="url(#clip0_7076_75117)">
                                    <path d="M66.4028 82.6928C72.5613 82.2621 77.218 76.8953 77.218 70.7252V67.1279C77.218 64.6249 75.6115 62.4013 73.2365 61.6097L63.2479 58.2801V48.9668C63.2479 47.0342 61.6879 45.4742 59.7554 45.4742C57.8229 45.4742 56.2629 47.0342 56.2629 48.9668V68.7577L53.399 65.8938C51.1289 63.6237 47.4385 63.6237 45.1683 65.8938L44.6328 66.4294L57.3572 79.3167C59.639 81.5985 62.8754 82.9373 66.4145 82.6928H66.4028Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M65.5742 40.8059L69.0667 37.3134" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M67.9023 45.4625H72.559" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M51.6042 59.4327H28.3208C25.7479 59.4327 23.6641 57.3488 23.6641 54.776V33.8209C23.6641 31.2481 25.7479 29.1642 28.3208 29.1642H58.5892C61.1621 29.1642 63.2459 31.2481 63.2459 33.8209V36.1492" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M28.3203 33.8208L40.7188 45.6139C42.2555 47.0807 44.6653 47.0807 46.202 45.6139L58.6004 33.8208" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M39.3217 44.2983L28.3203 54.7759" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_7076_75117">
                                        <rect width="55.8803" height="55.8803" fill="white" transform="translate(22.5 28)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <Heading level='h4' className='ps-4 pe-4 pb-3 ps-lg-0 pe-lg-0 pb-lg-0 text-lg-start'>Sign up to get a preview of the curriculum and early education tips from Primrose.</Heading>
                    </div>
                    <div className='right'>
                        <NewsletterForm />
                    </div>
                </div>
                {/* Franchise Owners Section */}
              
                    <div className='franchise-owners'>
                        {franchiseOwner && (
                            <div className='two-columns-image-and-text-alternative reverse-column'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    {franchiseOwner.image && (
                                        <img
                                            src={franchiseOwner.image.sourceUrl}
                                            alt={'Franchise Owner ' + franchiseOwner.name || 'feature image'}
                                            className='img-fluid'
                                            width="500"
                                            height="500"
                                        />
                                    )}
                                </div>
                                <div className='right-column col-12 col-lg-5'>
                                    <h2>{!franchiseOwner.multipleOwners ? 'Franchise Owner' : 'Franchise Owners'}</h2>
                                    <h5>{franchiseOwner?.name}</h5>
                                    <div className='bio' dangerouslySetInnerHTML={{__html: franchiseOwner.bio}} />
                                    <Button onClick={handleOpenModal}>Read More</Button>
                                    <Modal
                                        show={showModal}
                                        onClose={handleCloseModal}
                                        imageSrc={franchiseOwner.image.sourceUrl}
                                        bio={franchiseOwner.bio}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
               
                {/* Meet Our Staff Section */}
               
                    <div className='meet-staff'>
                        {meetOurStaff && (
                            <div className='two-columns-image-and-text-alternative'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    {meetOurStaff && (
                                        <img
                                            src={meetOurStaff.sourceUrl}
                                            alt={meetOurStaff.altText || 'Staff Image'}
                                            className='img-fluid'
                                            width="500"
                                            height="500"
                                        />
                                    )}
                                </div>
                                <div className='right-column col-12 col-lg-4 offset-lg-1'>
                                    <h2>Meet Our Staff</h2>
                                    <p className='b3'>When children feel safe, loved and confident, they can learn and grow to their fullest potential. That’s why Primrose school teachers and staff are dedicated to creating an environment that helps lay the foundation for a lifelong love of learning.</p>
                                        <Button
                                            href={`/schools/${schoolSlug}/staff`} 
                                            target='self'
                                        >
                                            Read More
                                        </Button>
                                </div>
                            </div>
                        )}
                    </div>
               
            </div>
        </div>
    );
}
