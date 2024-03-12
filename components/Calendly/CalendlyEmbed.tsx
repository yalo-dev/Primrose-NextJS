import React, { useState, useEffect } from "react";

const CalendlyEmbed = ({ url }) => {

    const [dynamicURL, setDynamicURL] = useState(url)

    useEffect(() => {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://assets.calendly.com/assets/external/widget.js"
        );
        head.appendChild(script);
        const calendlyIframe = document.querySelector('.calendly-inline-widget iframe');
        if (calendlyIframe != null) {
            calendlyIframe.setAttribute('src', url)
        }
        setDynamicURL(url)
    }, [url, dynamicURL]);

    console.log(dynamicURL)

    return (
        <div
            className="calendly-inline-widget"
            data-url={dynamicURL}
            style={{ minWidth: "350px", height: "700px" }}
        ></div>
    );
};

export default CalendlyEmbed;