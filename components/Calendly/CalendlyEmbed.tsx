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
            className="calendly-inline-widget"
            data-url={dynamicURL}
            style={{ minWidth: "350px", height: "800px", width: "1000px", marginLeft: "-50px" }}
        ></div>
    );
};

export default CalendlyEmbed;