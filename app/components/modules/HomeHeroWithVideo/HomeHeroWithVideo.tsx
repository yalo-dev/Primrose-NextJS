import Image from "next/image";
import React, { useRef, useState } from "react";
import useScreenWidth from "../../../../hooks/useScreenWidth";
import Button from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";
import Subheading from "../../atoms/Subheading/Subheading";
import Customizations from "../../filters/Customizations";
import GoogleMapForm from "./GoogleMapsForm";

interface School {
  id: any;
  slug: string;
  uri: string;
  name: string;
  address: string;
  hours: string;
  notes: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: string;
}

interface HomeHeroWithVideoProps {
  leftColumn: {
    eyebrow?: string;
    eyebrowColor?: string;
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
  };
  rightColumn: {
    videoOrImage?: string;
    video?: {
      mediaItemUrl?: string;
    };
    image?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  switchColumnOrderOnDesktop?: boolean;
  centerModule?: boolean;
  customizations?: {
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
    backgroundColor?: string;
  };
}

const HomeHeroWithVideo: React.FC<HomeHeroWithVideoProps> = ({
  switchColumnOrderOnDesktop,
  centerModule,
  leftColumn,
  rightColumn,
  customizations,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [nearestSchool, setNearestSchool] = useState<any>(null);
  const [nearestSchoolInfoClass, setNearestSchoolInfoClass] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const screenWidth = useScreenWidth();
  const showVideo =
    rightColumn.videoOrImage === "Video" && rightColumn.video?.mediaItemUrl;
  const showMobileVideo = showVideo && screenWidth < 992;

  return (
    <>
      <div className="container">
        <Customizations
          topPaddingMobile={customizations?.topPaddingMobile}
          topPaddingDesktop={customizations?.topPaddingDesktop}
          bottomPaddingMobile={customizations?.bottomPaddingMobile}
          bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
          colorLabel={customizations?.backgroundColor}
        >
          <div
            className={`home-hero-with-video ${switchColumnOrderOnDesktop ? "reverse-column" : ""} ${centerModule ? "center-module" : ""}`}
          >
            <div className="left-column col-12 col-lg-6">
              <div className="heading-wrapper d-block">
                {leftColumn.eyebrow && (
                  <Subheading
                    level="div"
                    className="h5"
                    color={leftColumn.eyebrowColor}
                  >
                    {leftColumn.eyebrow}
                  </Subheading>
                )}
                {leftColumn.heading && (
                  <Heading level="h1" color={leftColumn.headingColor}>
                    <div
                      dangerouslySetInnerHTML={{ __html: leftColumn.heading }}
                    />
                  </Heading>
                )}
                {leftColumn.subheading && (
                  <Subheading level="h5" color={leftColumn.subheadingColor}>
                    {leftColumn.subheading}
                  </Subheading>
                )}
              </div>
              {showMobileVideo && (
                <div className="video-wrapper d-block d-lg-none">
                  <video ref={videoRef} autoPlay muted playsInline loop>
                    {rightColumn.video?.mediaItemUrl?.includes(".mp4") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/mp4"
                      />
                    )}

                    {rightColumn.video?.mediaItemUrl?.includes(".ogv") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/ogg"
                      />
                    )}

                    {rightColumn.video?.mediaItemUrl?.includes(".webm") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/webm"
                      />
                    )}
                  </video>
                </div>
              )}

              {rightColumn.videoOrImage === "Image" &&
                rightColumn.image?.sourceUrl && (
                  <div className="image-wrapper mb-4 mb-lg-0 d-block d-lg-none">
                    <Image
                      src={rightColumn.image?.sourceUrl}
                      alt={rightColumn.image?.altText}
                      width={1920}
                      height={1080}
                      priority
                    />
                  </div>
                )}
              <GoogleMapForm
                setNearestSchool={setNearestSchool}
                setNearestSchoolInfoClass={setNearestSchoolInfoClass}
                setSearchAddress={setSearchAddress}
                setUserLocation={setUserLocation}
              />
              <div className={`nearest-school-info ${nearestSchoolInfoClass}`}>
                {nearestSchool && (
                  <>
                    <div className="name-wrapper d-flex justify-content-between">
                      <a href={nearestSchool.uri} className="name">
                        <h5>{nearestSchool.name}</h5>
                      </a>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="6"
                          height="12"
                          viewBox="0 0 6 12"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z"
                            fill="#555F68"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="b2 pb-2">
                      {nearestSchool.distance} mi · {nearestSchool.address}
                    </div>
                    <p className="hours">{nearestSchool.hours}</p>
                    <div className="phone-wrapper">
                      <div className="b2">
                        <Button
                          className="primary me-2"
                          href={`/schools/${nearestSchool.slug}/schedule-a-tour`}
                        >
                          Schedule a Tour
                        </Button>
                        <a
                          href={`tel:${nearestSchool.phone}`}
                          className="phone"
                        >
                          <span className="me-2">
                            <svg
                              width="50"
                              height="50"
                              viewBox="0 0 50 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="25"
                                cy="25"
                                r="24.5"
                                fill="white"
                                stroke="#DFE2D3"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M30.9098 27.155C32.0744 27.8022 33.2397 28.4494 34.4043 29.0966C34.9056 29.3749 35.1254 29.9656 34.9281 30.5042C33.9261 33.2415 30.9915 34.6863 28.2303 33.6786C22.5764 31.6148 18.3852 27.4236 16.3214 21.7697C15.3137 19.0085 16.7585 16.0739 19.4958 15.0719C20.0344 14.8746 20.6251 15.0944 20.904 15.5957C21.5506 16.7603 22.1978 17.9256 22.845 19.0902C23.1484 19.6365 23.077 20.285 22.6618 20.7516C22.1181 21.3635 21.5744 21.9753 21.0306 22.5865C22.1914 25.4132 24.5868 27.8086 27.4134 28.9694C28.0247 28.4256 28.6365 27.8819 29.2484 27.3382C29.7157 26.923 30.3635 26.8516 30.9098 27.155Z"
                                stroke="#5E6738"
                              />
                            </svg>
                          </span>
                          <span className="d-none d-lg-inline">
                            {nearestSchool.phone}
                          </span>
                        </a>
                      </div>
                    </div>
                    <a
                      className="green underline pt-4 d-block"
                      href={`/find-a-school?search_string=${encodeURIComponent(searchAddress)}&latitude=${userLocation.lat}&longitude=${userLocation.lng}`}
                    >
                      View all locations nearest you
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="right-column col-12 col-lg-6">
              {!showMobileVideo && (
                <div className="video-wrapper d-none d-lg-block">
                  <video ref={videoRef} autoPlay muted playsInline loop>
                    {rightColumn.video?.mediaItemUrl?.includes(".mp4") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/mp4"
                      />
                    )}

                    {rightColumn.video?.mediaItemUrl?.includes(".ogv") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/ogg"
                      />
                    )}

                    {rightColumn.video?.mediaItemUrl?.includes(".webm") && (
                      <source
                        src={rightColumn.video?.mediaItemUrl}
                        type="video/webm"
                      />
                    )}
                  </video>
                </div>
              )}

              {rightColumn.videoOrImage === "Image" &&
                rightColumn.image?.sourceUrl && (
                  <div className="image-wrapper mb-4 mb-lg-0 d-none d-lg-block">
                    <Image
                      src={rightColumn.image?.sourceUrl}
                      alt={rightColumn.image?.altText}
                      width={1920}
                      height={1080}
                      priority
                    />
                  </div>
                )}
            </div>
          </div>
        </Customizations>
      </div>
    </>
  );
};

export default HomeHeroWithVideo;
