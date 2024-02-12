import QuoteTestimonials from "../../app/components/modules/QuoteTestimonials/QuoteTestimonials";
import React from "react";
import NewsSlider from "../../app/components/modules/NewsSlider/NewsSlider";

interface NewsSliderProps {
    adminSettings: null | any;
    isClient: boolean
}

export default function SchoolNewsSlider({adminSettings, isClient}: NewsSliderProps) {
    if (!isClient) return null;

    const newsHeading = "See What's Happening in Our School";
    const newsItems = adminSettings?.newsItems;

    if (!newsItems || newsItems.length === 0) {
        return null;
    }
    return (
        <div className='news-slider-module'>
            <div className='container'>
                <h2 className='heading'>{newsHeading || 'Default News Heading'}</h2>
                <NewsSlider newsItems={newsItems}/>
            </div>
        </div>
    );
};
