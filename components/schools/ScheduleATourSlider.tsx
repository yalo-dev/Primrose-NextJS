import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "../../app/components/atoms/Button/Button";
import Heading from "../../app/components/atoms/Heading/Heading";
import Subheading from "../../app/components/atoms/Subheading/Subheading";

interface ScheduleATourSliderProps {
  schoolSlug: string;
  images: Array<{ url: string; altText: string }> | null | undefined;
  usesCalendly: boolean;
}
export default function ScheduleATourSlider({
  images,
  schoolSlug,
  usesCalendly,
}: ScheduleATourSliderProps) {
  // if null value passed, and defaultImageFallback is set to false, don't return anything
  if (!images) return;

  const scheduleATourImages = images?.length ? images : null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonText = usesCalendly ? "Schedule A Tour" : "Contact Us";

  const scrollContent = () => {
    const scroller = scrollRef.current;

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

  return (
    <div className="container">
      <div className="find-a-school">
        <div className="left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center">
          <Heading level="h2">Our family would love to meet yours.</Heading>
          <Subheading level="div" className="b3">
            Contact us to schedule a tour.
          </Subheading>
          <Button
            variant="secondary"
            href={"/schools/" + schoolSlug + "/schedule-a-tour"}
          >
            {buttonText}
          </Button>
        </div>
        <div className="right-column col-4 col-lg-5 col-xxl-6">
          <div className="image-scroller first" ref={scrollRef}>
            {scheduleATourImages.map(
              (imgObj, idx) =>
                imgObj.url && (
                  <Image
                    width={720}
                    height={720}
                    key={idx}
                    src={imgObj.url}
                    alt={imgObj.altText || `slider image ${idx}`}
                  />
                ),
            )}
            {scheduleATourImages.map(
              (imgObj, idx) =>
                imgObj.url && (
                  <Image
                    width={720}
                    height={720}
                    key={`dup-${idx}`}
                    src={imgObj.url}
                    alt={imgObj.altText || `slider image ${idx} (copy)`}
                  />
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
