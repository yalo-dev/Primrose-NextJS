import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";
import Subheading from "../../atoms/Subheading/Subheading";
import Customizations from "../../filters/Customizations";

interface FindASchoolProps {
  heading?: string;
  headingColor?: string;
  subheading?: string;
  subheadingColor?: string;
  images?: {
    image: {
      sourceUrl?: string;
      altText?: string;
    };
  }[];
  button?: {
    target?: string;
    title?: string;
    url?: string;
  };
  buttonStyle?: "primary" | "secondary" | "white";
  customizations?: {
    backgroundColor?: string;
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
  };
}

const FindASchool: React.FC<FindASchoolProps> = ({
  heading,
  headingColor,
  subheading,
  subheadingColor,
  images,
  button,
  buttonStyle,
  customizations,
}) => {
  const leftScrollerRef = useRef<HTMLDivElement | null>(null);
  const rightScrollerRef = useRef<HTMLDivElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const scrollContent = () => {
    const scroller = leftScrollerRef.current;

    if (scroller) {
      scroller.scrollTop += 1;
      if (scroller.scrollTop >= scroller.scrollHeight / 2) {
        scroller.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(scrollContent, 10);
    return () => clearInterval(scrollInterval);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  return (
    <div className="container jumbo">
      <Customizations
        topPaddingMobile={customizations?.topPaddingMobile}
        topPaddingDesktop={customizations?.topPaddingDesktop}
        bottomPaddingMobile={customizations?.bottomPaddingMobile}
        bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
        colorLabel={customizations?.backgroundColor}
      >
        <div className="find-a-school">
          <div className="left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center">
            {heading && (
              <Heading level="h2" color={headingColor}>
                {heading}
              </Heading>
            )}
            {subheading && (
              <Subheading level="div" className="b3" color={subheadingColor}>
                {subheading}
              </Subheading>
            )}
            {button?.url && button.title && (
              <Button
                variant={buttonStyle || "primary"}
                href={button.url}
                target={button.target || "_self"}
              >
                {button.title}
              </Button>
            )}
          </div>
          <div className="right-column col-4 col-lg-5 col-xxl-6">
            {images && images.length > 0 && (
              <>
                <div className="image-scroller" ref={leftScrollerRef}>
                  {images.map(
                    (imgObj, idx) =>
                      imgObj.image?.sourceUrl && (
                        <Image
                          priority
                          key={idx}
                          src={imgObj.image.sourceUrl}
                          alt={imgObj.image.altText}
                          onLoad={handleImageLoad}
                          width={1920}
                          height={1920}
                        />
                      ),
                  )}
                  {images.map(
                    (
                      imgObj,
                      idx, // Duplicating for infinite scroll illusion
                    ) =>
                      imgObj.image?.sourceUrl && (
                        <Image
                          priority
                          key={`dup-${idx}`}
                          src={imgObj.image.sourceUrl}
                          alt={imgObj.image.altText}
                          onLoad={handleImageLoad}
                          width={1920}
                          height={1920}
                        />
                      ),
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Customizations>
    </div>
  );
};

export default FindASchool;
