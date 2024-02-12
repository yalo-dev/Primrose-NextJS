import Slider from "react-slick";
import Link from "next/link";
import React from "react";

// TODO: create types for any fields using 'any'
interface HeroWithSliderProps {
    corporateSettings: null | any;
    adminSettings: null | any;
    schoolSlug: string;
}
export default function HeroWithSlider({corporateSettings, adminSettings, schoolSlug}: HeroWithSliderProps) {
    const classroomsData = adminSettings?.classroomsOffered;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className='hero-with-slider-module'>
            <div className='hero-with-slider'>
                <div className='container'>
                    <div className='row'>
                        <div className='col left-col col-12 col-lg-6'>
                            <div>
                                {corporateSettings?.homepageHeroImage && (
                                    <Slider {...settings}>
                                        {corporateSettings.homepageHeroImage.map((image, index) => (
                                            <div className='image-wrapper d-block' key={index}>
                                                <img src={image.mediaItemUrl} alt={image.altText || `Hero Image ${index}`}/>
                                            </div>
                                        ))}
                                    </Slider>
                                )}
                            </div>
                        </div>
                        <div className='col right-col col-12 col-lg-6'>
                            {adminSettings?.hiringNow && (
                                <div className='alert hiring-alert'>
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h5 className="alert-title text-white mb-0">Now Hiring</h5>
                                        </div>
                                        <div className="col text-end">
                                            <a href={`/schools/${schoolSlug}/careers`}
                                               className="text-white text-decoration-underline">View Job Openings</a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {adminSettings?.enrollingNow && (
                                <div className='alert enrolling-alert'>
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h5 className="alert-title text-white mb-0">Now Enrolling</h5>
                                        </div>
                                        <div className="col text-end">
                                            <a href={`/schools/${schoolSlug}/schedule-a-tour`}
                                               className="text-white text-decoration-underline">Schedule a Tour</a>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className='d-lg-flex'>
                                <div className='info-wrapper'>
                                    {/* <h5 className='green'>The Leader in Early Education and Care®️</h5> */}
                                    <div className='hours mt-4'><h5 className='green'>Hours & Location</h5><span
                                        className='b3'>M-F {adminSettings?.hoursOfOperation.openingTime}-{adminSettings?.hoursOfOperation.closingTime}</span>
                                    </div>
                                    <div className='phone'><span className='b3'><a
                                        href={`tel:${corporateSettings?.phoneNumber}`}>{corporateSettings?.phoneNumber}</a></span>
                                    </div>
                                    <div className='address'>
                                            <span className='icon me-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18"
                                                     viewBox="0 0 15 18" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                          d="M2.91631 2.78948C0.36123 5.37616 0.36123 9.57634 2.91631 12.1628L7.54545 16.8496L12.1746 12.1628C14.7297 9.57634 14.7297 5.37616 12.1746 2.78948C9.61986 0.202986 5.47105 0.202986 2.91631 2.78948ZM7.63273 10.2719C9.17498 10.2719 10.4254 8.99835 10.4254 7.4274C10.4254 5.85646 9.17498 4.58295 7.63273 4.58295C6.09047 4.58295 4.84004 5.85646 4.84004 7.4274C4.84004 8.99835 6.09047 10.2719 7.63273 10.2719Z"
                                                          stroke="#555F68" strokeWidth="1.5"/>
                                                </svg>
                                            </span>
                                        <span
                                            className='b3'>{corporateSettings?.address?.streetAddress} {corporateSettings?.address?.streetAddress2}, {corporateSettings?.address?.city}, {corporateSettings?.address?.state} {corporateSettings?.address?.zipcode}</span>
                                    </div>
                                    <div className='classrooms'>
                                        <h5 className='mt-4 green'>Age Groups Served</h5>
                                        <ul>
                                            {classroomsData && classroomsData
                                                .filter(classroom => classroom !== "Summer Adventure Club" && classroom !== "Before & After Care")
                                                .map((classroom, index) => {
                                                    const classroomSlug = classroom.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-');
                                                    const classroomUrl = `${[schoolSlug]}/classrooms/${classroomSlug}`;

                                                    return (
                                                        <li key={`classroom-${index}`}>
                                                            <Link href={classroomUrl}>
                                                                <span className='b3'>{classroom}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>

                                </div>
                                {corporateSettings?.accreditations && (
                                    <div className='accreditations'>
                                        <h5 className='mt-4 green'>Accreditation</h5>
                                        <div className="accreditation-images  d-flex">
                                            {corporateSettings.accreditations.map((accreditation, index) => accreditation && (
                                                <div key={`accreditation-${index}`} className="accreditation-image">
                                                    <img className='me-2 me-lg-0 mb-lg-2' width='60' height='60'
                                                         src={accreditation.accreditations.image.mediaItemUrl}
                                                         alt={accreditation.title || 'Accreditation Image'}/>
                                                </div>
                                            ))}
                                            {adminSettings.accreditation.image && (
                                                <div className="accreditation-image">
                                                    <img className='me-2 me-lg-0 mb-lg-2' width='60' height='60'
                                                         src={adminSettings.accreditation.image.mediaItemUrl}
                                                         alt={adminSettings.accreditation.imageAlt}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div
                                className='social-links d-flex justify-content-center align-center border-top border-bottom mt-3 mb-3 mb-lg-0 pt-2 pb-2'>
                                {adminSettings?.facebookLink && (
                                    <a href={adminSettings.facebookLink} target="_blank" title="Facebook"
                                       rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                             viewBox="0 0 60 60" fill="none">
                                            <path
                                                d="M45 30.0919C45 21.7567 38.2846 15 30.0019 15C21.7154 15.0019 15 21.7567 15 30.0937C15 37.6247 20.4856 43.8676 27.6547 45V34.4544H23.8489V30.0937H27.6584V26.766C27.6584 22.9846 29.8988 20.8961 33.324 20.8961C34.9663 20.8961 36.6817 21.1905 36.6817 21.1905V24.9025H34.79C32.9284 24.9025 32.3472 26.0667 32.3472 27.261V30.0919H36.5054L35.8418 34.4526H32.3453V44.9981C39.5144 43.8658 45 37.6228 45 30.0919Z"
                                                fill="black"/>
                                        </svg>
                                    </a>
                                )}
                                {adminSettings?.instagramLink && (
                                    <a href={adminSettings.instagramLink} target="_blank" title="Instagram"
                                       rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                             viewBox="0 0 60 60" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M36.7368 15H23.2848C18.7166 15 15 18.714 15 23.2789V36.7211C15 41.2862 18.7166 45 23.2848 45H36.7368C41.3054 45 45.0219 41.286 45.0219 36.7211V23.2789C45.0221 18.714 41.3054 15 36.7368 15ZM42.3584 36.7211C42.3584 39.8185 39.8366 42.3383 36.737 42.3383H23.2848C20.1853 42.3384 17.6637 39.8185 17.6637 36.7211V23.2789C17.6637 20.1817 20.1853 17.6617 23.2848 17.6617H36.7368C39.8364 17.6617 42.3583 20.1817 42.3583 23.2789V36.7211H42.3584ZM30.0141 22.2703C25.7484 22.2703 22.2782 25.7381 22.2782 30.0006C22.2782 34.2629 25.7484 37.7305 30.0141 37.7305C34.2797 37.7305 37.75 34.2629 37.75 30.0006C37.75 25.7381 34.2797 22.2703 30.0141 22.2703ZM30.0141 35.0685C27.2174 35.0685 24.9419 32.795 24.9419 30.0004C24.9419 27.2056 27.2172 24.9319 30.0141 24.9319C32.811 24.9319 35.0863 27.2056 35.0863 30.0004C35.0863 32.795 32.8108 35.0685 30.0141 35.0685ZM36.6956 20.5853C37.058 20.2216 37.5622 20.014 38.0754 20.014C38.5904 20.014 39.0947 20.2216 39.4569 20.5853C39.821 20.9473 40.0288 21.4513 40.0288 21.9659C40.0288 22.4787 39.821 22.9827 39.4569 23.3465C39.0929 23.7085 38.5904 23.9178 38.0754 23.9178C37.5622 23.9178 37.0578 23.7085 36.6956 23.3465C36.3315 22.9827 36.122 22.4789 36.122 21.9659C36.122 21.4513 36.3314 20.9473 36.6956 20.5853Z"
                                                  fill="black"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}