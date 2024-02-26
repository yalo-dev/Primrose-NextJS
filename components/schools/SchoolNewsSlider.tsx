import QuoteTestimonials from "../../app/components/modules/QuoteTestimonials/QuoteTestimonials";
import React from "react";
import NewsSlider from "../../app/components/modules/NewsSlider/NewsSlider";

interface NewsSliderProps {
    adminSettings: null | any;
    isClient: boolean;
}

export default function SchoolNewsSlider({adminSettings, isClient}: NewsSliderProps) {
    if (!isClient) return null;

    const newsHeading = "See What's Happening in Our School";
    const newsItems = adminSettings?.newsItems;

    if (!newsItems || newsItems.length === 0) {
        return null;
    }

    const currentDate = new Date();

    const filteredNewsItems = newsItems.filter(
        (newsItem) =>
            new Date(newsItem.publishDate) <= currentDate &&
            (!newsItem.expires || new Date(newsItem.expires) >= currentDate)
    );

    return (
        <div className='news-slider-module'>
            <div className='container'>
                <h2 className='heading'>{newsHeading || 'Default News Heading'}</h2>
                <NewsSlider newsItems={filteredNewsItems.slice(0, 20)} />
            </div>
        </div>
    );
};
