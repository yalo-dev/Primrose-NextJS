import QuoteTestimonials from "../../app/components/modules/QuoteTestimonials/QuoteTestimonials";
import React from "react";

interface NewsSliderProps {
    adminSettings: null | any;
    isClient: boolean
}

export default function NewsSlider({adminSettings, isClient}: NewsSliderProps) {
    if (!isClient) return null;

    const newsHeading = "See What's Happening in Our School";
    const newsItems = adminSettings.newsItems;

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
