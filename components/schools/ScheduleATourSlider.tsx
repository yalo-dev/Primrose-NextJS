import React, {useEffect, useRef} from "react";
import Heading from "../../app/components/atoms/Heading/Heading";
import Subheading from "../../app/components/atoms/Subheading/Subheading";
import Button from "../../app/components/atoms/Button/Button";

interface ScheduleATourSliderProps {
    schoolSlug: string
    images: Array<{url: string, altText: string}> | null | undefined
}
export default function ScheduleATourSlider({images, schoolSlug }: ScheduleATourSliderProps) {
    // if null value passed, and defaultImageFallback is set to false, don't return anything
    if (!images) return

    const scheduleATourImages = images?.length ? images : null;
    const scrollRef = useRef<HTMLDivElement>(null);

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
        return () => clearInterval(scrollInterval)
    }, []);

    return (
        <div className='container'>
            <div className='find-a-school'>
                <div className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                    <Heading level='h2'>Our family would love to meet yours.</Heading>
                    <Subheading level='div' className='b3'>Contact us to schedule a tour.</Subheading>
                    <Button variant="secondary" href={"/schools/" + schoolSlug + "/schedule-a-tour"}>
                        Schedule A Tour
                    </Button>
                </div>
                <div className='right-column col-4 col-lg-5 col-xxl-6'>
                    <div className="image-scroller first" ref={scrollRef}>
                        {scheduleATourImages.map((imgObj, idx) => (
                            imgObj.url && <img key={idx} src={imgObj.url}
                                                           alt={imgObj.altText || `slider image ${idx}`}/>
                        ))}
                        {scheduleATourImages.map((imgObj, idx) => (
                            imgObj.url && <img key={`dup-${idx}`} src={imgObj.url}
                                                           alt={imgObj.altText || `slider image ${idx} (copy)`}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}