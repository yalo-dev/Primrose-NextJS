import React, {useEffect, useRef, useState} from "react";
import Heading from "../../app/components/atoms/Heading/Heading";
import Subheading from "../../app/components/atoms/Subheading/Subheading";
import Button from "../../app/components/atoms/Button/Button";

interface ScheduleATourSliderProps {
    adminSettings: null | any
    schoolSlug: string
}
export default function ScheduleATourSlider({adminSettings, schoolSlug}: ScheduleATourSliderProps) {
    const satImages = adminSettings?.satImages?.map((imgObj) => ({url: imgObj.image.sourceUrl, altText: imgObj.altText}))
    const defaultImages = [
        {url: '/schoolsHomeDefault/scrollies-1.jpg', altText: "A child and teacher's hand on a book",},
        {url: '/schoolsHomeDefault/scrollies-2.jpg', altText: 'A young boy playing with toys',},
        {url: '/schoolsHomeDefault/scrollies-3.jpg', altText: 'A young boy playing to the floor looking up at camera',},
        {url: '/schoolsHomeDefault/scrollies-4.jpg', altText: 'A young boy smiling at camera',},
        {url: '/schoolsHomeDefault/scrollies-5.jpg', altText: 'A young boy looking at camera',}
    ]
    const scheduleATourImages = satImages ?? defaultImages;
    const leftScrollerRef = useRef<HTMLDivElement>(null);
    const rightScrollerRef = useRef<HTMLDivElement>(null);

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
            setInterval(scrollContent, 1);
        } else {
            const images = document.querySelectorAll('.find-a-school .image-scroller img');
            images.forEach((img) => {
                img.addEventListener('load', () => {
                    if (checkIfImagesLoaded()) {
                        setInterval(scrollContent, 20);
                    }
                });
            });
        }
    }, []);
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
                    <div className="image-scroller first" ref={leftScrollerRef}>
                        {scheduleATourImages.map((imgObj, idx) => (
                            imgObj.url && <img key={idx} src={imgObj.url}
                                                           alt={imgObj.altText || `slider image ${idx}`}/>
                        ))}
                        {scheduleATourImages.map((imgObj, idx) => (
                            imgObj.url && <img key={`dup-${idx}`} src={imgObj.url}
                                                           alt={imgObj.altText || `slider image ${idx} (copy)`}/>
                        ))}
                    </div>
                    <div className="image-scroller second" ref={rightScrollerRef}>
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