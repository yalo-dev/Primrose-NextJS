import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CalendlyEmbed = ({ url, successUrl }) => {
  const [dynamicURL, setDynamicURL] = useState(url);
  const router = useRouter();

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js",
    );
    head.appendChild(script);
    const calendlyIframe = document.querySelector(
      ".calendly-inline-widget iframe",
    );
    if (calendlyIframe != null) {
      calendlyIframe.setAttribute("src", url);
    }
    setDynamicURL(url);
  }, [url, dynamicURL]);

  return (
    <div
      id="calendly-iframe"
      className="calendly-inline-widget"
      style={{ minWidth: "280px", marginBottom: "20px" }}
    >
      <iframe
        src={dynamicURL}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Select a Date &amp; Time - Calendly"
        onLoad={() => {
          //console.log("iframe height", self.innerHeight)
          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            )
          ) {
            // true for mobile device
            //console.log("mobile device");
            document.getElementById("calendly-iframe").style.height = "1250px";
          } else {
            // false for not mobile device
            //console.log("not mobile device");
            document.getElementById("calendly-iframe").style.height =
              self.innerHeight + "px";
          }
        }}
      />
    </div>
  );
};

export default CalendlyEmbed;
