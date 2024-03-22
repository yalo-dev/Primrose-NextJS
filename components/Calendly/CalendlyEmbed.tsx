import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";

const CalendlyEmbed = ({ url, successUrl }) => {

    const [dynamicURL, setDynamicURL] = useState(url)
    const router = useRouter();

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

    return (
        <div
            id="calendly-iframe"
            className="calendly-inline-widget"
            style={{ minWidth: "280px" }}
        >
            <iframe
                src={dynamicURL}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Select a Date &amp; Time - Calendly"
                onLoad={ () => {
                    document.getElementById('calendly-iframe').style.height = self.innerHeight + "px";
                }}
            />
        </div>
    );
};

export default CalendlyEmbed;