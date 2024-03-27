import Button from "../../app/components/atoms/Button/Button";
import SelectDropdown from "../../app/components/molecules/SelectDropdown/SelectDropdown";
import React from "react";
import FranchiseOwnerBio from "../../app/components/modules/FranchiseOwnerModal/FranchiseOwnerBio";
import Image from 'next/image';

// TODO: replace 'any' with types
interface FirstFiveProps {
    adminSettings: null | any
    corporateSettings: null | any;
    schoolSlug: null | any;
    staffImage?: {sourceUrl: string, altText: string}
}
export default function FirstFive({ adminSettings, corporateSettings, schoolSlug, staffImage}: FirstFiveProps) {
    const whichStaffImage = adminSettings?.meetStaffImage?.mediaItemUrl
        ? {sourceUrl: adminSettings?.meetStaffImage?.mediaItemUrl, altText: 'staff image'}
        : {sourceUrl: staffImage?.sourceUrl, altText: staffImage?.altText}
    const selectedClassrooms = adminSettings?.classroomsOffered;
    const selectedExtraCare = adminSettings?.extraCareOffered
    const selectedOfferings =  selectedExtraCare != 'None' ? selectedClassrooms.concat(selectedExtraCare) : selectedClassrooms;
    const sortedSelectedOfferings = [...selectedOfferings].sort((a, b) => {
        if (a === "Summer Adventure Club") return 1;
        if (b === "Summer Adventure Club") return -1;
        return 0;
    });
    // const dropdownOptions = selectedOfferings && selectedOfferings.map(classroom => classroom && ({
    //     label: classroom,
    //     url: `${schoolSlug}/classrooms/${classroom.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
    // }));
    const dropdownOptions = sortedSelectedOfferings && sortedSelectedOfferings.filter(classroom => classroom).map(classroom => {
        const linkText = classroom === "Before After School" ? "Before & After School" : classroom
        return {
            label: linkText,
            url: `${schoolSlug}/classrooms/${classroom.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
        }
    });

    return (
        <div className='first-five-module'>
            <div className='first-five'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 heading-wrapper'>
                            <h2 className='h1'>{corporateSettings?.homepageSubheadline?.title}</h2>
                            <div
                                className='b3'>{corporateSettings?.homepageSubheadline?.description?.replace('[CITY]', corporateSettings.address.city)}</div>
                        </div>
                        <div className='classrooms'>
                            <div className='two-columns-image-and-text-alternative'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    <Image
                                        priority
                                        src='/schoolsHomeDefault/classrooms%20and%20programs.jpg'
                                        alt='child in daycare classroom'
                                        width={500}
                                        height={500}
                                    />
                                </div>
                                <div className='right-column col-12 col-lg-5 offset-lg-1'>
                                    <h2 className="">Our Classrooms & Programs</h2>
                                    <div className='blurb'>
                                        Our time-tested approach to early childhood education is designed to foster good
                                        character and grow social and emotional skills while also building literacy, and
                                        math skills.
                                    </div>

                                    <div className='d-lg-flex align-center'>
                                        <div className='me-2 mb-2 mb-lg-0'>
                                            <Button href={schoolSlug + "/classrooms"}>
                                                Explore Education & Care
                                            </Button>
                                        </div>
                                        {dropdownOptions && <SelectDropdown options={dropdownOptions} placeholder="Explore Classrooms"/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        { adminSettings?.franchiseOwner?.bio
                            ? <FranchiseOwnerBio franchiseOwner={adminSettings.franchiseOwner} />
                            : <div className='staff'>
                                <div className='two-columns-image-and-text-alternative reverse-column'>
                                  <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    {whichStaffImage?.sourceUrl && <Image
                                        priority
                                      src={whichStaffImage?.sourceUrl}
                                      alt={whichStaffImage?.altText}
                                      width={500}
                                      height={500}
                                    />}
                                  </div>
                                  <div className='right-column col-12 col-lg-5 offset-lg-1'>
                                    <h2 className="">Meet Our Teachers & Staff</h2>
                                    <div className='blurb'>
                                        When children feel safe, loved and confident, they can learn and grow to their
                                        fullest potential. That’s why Primrose school teachers and staff are dedicated
                                        to creating an environment that helps lay the foundation for a lifelong love of
                                        learning.
                                    </div>
                                    <Button href={schoolSlug + "/staff"}>
                                        Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}