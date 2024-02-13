import React, {useEffect, useRef, useState} from "react";
import Heading from "../../app/components/atoms/Heading/Heading";
import Subheading from "../../app/components/atoms/Subheading/Subheading";
import Button from "../../app/components/atoms/Button/Button";

interface ScheduleATourSliderProps {
    adminSettings: null | any
    schoolSlug: string
}
export default function ScheduleATourSlider({adminSettings, schoolSlug}: ScheduleATourSliderProps) {
    const scheduleATour = adminSettings?.satImages || {};
    const hasScheduleATour = scheduleATour.length > 0;
    const leftScrollerRef = useRef<HTMLDivElement>(null);
    const rightScrollerRef = useRef<HTMLDivElement>(null);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    const scrollContent = () => {
        const leftScroller = leftScrollerRef.current;
        const rightScroller = rightScrollerRef.current;


        if (leftScroller) {
            leftScroller.scrollTop += .9;
            if (leftScroller.scrollTop >= leftScroller.scrollHeight / 2) {
                leftScroller.scrollTop = 0;
            }
        }

        if (rightScroller) {
            rightScroller.scrollTop -= .9;
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
            setInterval(scrollContent, 1);
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
    if (!hasScheduleATour) return;
    return (

        <div className='container'>
            <div className='find-a-school'>
                <div
                    className='left-column col-8 col-lg-7 col-xxl-6 d-lg-flex flex-lg-column justify-content-lg-center'>
                    <Heading level='h2'>Our family would love to meet yours.</Heading>
                    <Subheading level='div' className='b3'>Contact us to schedule a tour.</Subheading>

                    <Button variant="secondary" href={"/schools/" + schoolSlug + "/schedule-a-tour"}>
                        Schedule A Tour
                    </Button>

                </div>
                <div className='right-column col-4 col-lg-5 col-xxl-6'>
                    {scheduleATour && scheduleATour.length > 0 && (
                        <>
                            <div className="image-scroller first" ref={leftScrollerRef}>
                                {scheduleATour.map((imgObj, idx) => (
                                    imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl}
                                                                   alt={imgObj.altText || `slider image ${idx}`}/>
                                ))}
                                {scheduleATour.map((imgObj, idx) => (
                                    imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl}
                                                                   alt={imgObj.altText || `slider image ${idx} (copy)`}/>
                                ))}
                            </div>
                            <div className="image-scroller second" ref={rightScrollerRef}>
                                {scheduleATour.map((imgObj, idx) => (
                                    imgObj.image.sourceUrl && <img key={idx} src={imgObj.image.sourceUrl}
                                                                   alt={imgObj.altText || `slider image ${idx}`}/>
                                ))}
                                {scheduleATour.map((imgObj, idx) => (
                                    imgObj.image.sourceUrl && <img key={`dup-${idx}`} src={imgObj.image.sourceUrl}
                                                                   alt={imgObj.altText || `slider image ${idx} (copy)`}/>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}