import React, { useEffect } from "react";
import Script from "next/script";

const CalendlyEmbed = ({ url }) => {
    useEffect(() => {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://assets.calendly.com/assets/external/widget.js"
        );
        head.appendChild(script);
    }, []);

    function isCalendlyEvent(e) {
        return e.data.event &&
            e.data.event.indexOf('calendly') === 0;
    };

    window.addEventListener(
        'message',
        function(e) {
            if (isCalendlyEvent(e)) {
                // console.log(e.data);
            }
        }
    );

    return (
        <div
            className="calendly-inline-widget"
            data-url={url}
            style={{ minWidth: "350px", height: "700px" }}
        ></div>
    );
};

export default CalendlyEmbed;