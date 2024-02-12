import Button from "../../app/components/atoms/Button/Button";
import SelectDropdown from "../../app/components/molecules/SelectDropdown/SelectDropdown";
import React from "react";

// TODO: replace 'any' with types
interface FirstFiveProps {
    adminSettings: null | any
    corporateSettings: null | any;
    schoolSlug: null | any;
}
export default function FirstFive({ adminSettings, corporateSettings, schoolSlug}: FirstFiveProps) {
    const classroomsData = adminSettings?.classroomsOffered;
    const dropdownOptions = classroomsData && classroomsData.map(classroom => ({
        label: classroom,
        value: classroom.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')
    }));
    return (
        <div className='first-five-module'>
            <div className='first-five'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 heading-wrapper pb-lg-5'>
                            <h2 className='h1'>{corporateSettings?.homepageSubheadline?.title}</h2>
                            <div
                                className='b3'>{corporateSettings?.homepageSubheadline?.description?.replace('[CITY]', corporateSettings.address.city)}</div>
                        </div>
                        <div className='classrooms'>
                            <div className='two-columns-image-and-text-alternative'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    <img
                                        src='https://primroseschstg.wpenginepowered.com/wp-content/uploads/2023/08/stock.png'
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
                        <div className='staff'>
                            <div className='two-columns-image-and-text-alternative reverse-column'>
                                <div className='left-column col-12 col-lg-5 offset-lg-1'>
                                    {adminSettings?.meetStaffImage?.mediaItemUrl && <img
                                        src={adminSettings?.meetStaffImage?.mediaItemUrl}
                                        alt="staff image"
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
                    </div>
                </div>
            </div>
        </div>
    )
}