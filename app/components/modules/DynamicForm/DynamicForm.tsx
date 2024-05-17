import Script from "next/script";
import React, { useEffect, useState } from "react";
import Heading from "../../atoms/Heading/Heading";
import Subheading from "../../atoms/Subheading/Subheading";
import Customizations from "../../filters/Customizations";

declare global {
  interface Window {
    hbspt: any;
  }
}

interface DynamicFormProps {
  headings: {
    heading?: string;
    headingColor?: string;
    subheading?: string;
    subheadingColor?: string;
  };
  formid?: string;
  portalid?: string;
  region?: string;
  version?: string;
  customizations: {
    outerBackgroundColor?: string;
    topMarginMobile?: string;
    topMarginDesktop?: string;
    bottomMarginMobile?: string;
    bottomMarginDesktop?: string;
  };
  hubspotFormSnippets: {
    productionHubspotFormCode: null | string;
    stagingHubspotFormCode: null | string;
  };
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  headings,
  customizations,
  hubspotFormSnippets,
}) => {
  const containerID = "hubspotForm";
  const hubspotFormSnippet =
    process.env.NODE_ENV === "production"
      ? hubspotFormSnippets?.productionHubspotFormCode
      : hubspotFormSnippets?.stagingHubspotFormCode;

  const [hubScripts, setHubScripts] = useState([]);
  const [hubStyles, setHubStyles] = useState([]);

  // react doesn't execute scripts placed within "dangerouslySetInnerHTML" on divs so the following is a way around that
  useEffect(() => {
    // add the scripts string to a div innerHTML to make it easier to parse
    const div = document.createElement("div");
    div.innerHTML = hubspotFormSnippet;

    // grab the scripts as a list of objects
    const scripts = div.getElementsByTagName("script");
    // react will run this useEffect a couple times on load, so check and make sure there's no scripts loaded already, or they'll stack
    if (!hubScripts.length) {
      for (let i = 0; i < scripts.length; i++) {
        // set the scripts to next/script tag so they'll execute properly
        if (scripts[i].src) {
          setHubScripts((prev) => [
            ...prev,
            <Script strategy="afterInteractive" src={scripts[i].src} />,
          ]);
        } else if (scripts[i].innerHTML) {
          // next scripts get moved to the end of the <body>, so add a target attribute to load this within the proper container (if not already present)
          const scriptWithTarget = scripts[i].innerHTML.includes("target:")
            ? scripts[i].innerHTML
            : scripts[i].innerHTML
                .split("hbspt.forms.create({")
                .join(`hbspt.forms.create({target: "#${containerID}", `);
          setHubScripts((prev) => [
            ...prev,
            <Script
              defer={false}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: scriptWithTarget }}
            />,
          ]);
        }
      }
    }

    // grab the styles as a list of objects
    const styles = div.getElementsByTagName("style");
    //check and make sure there's no styles loaded already
    if (!hubStyles.length) {
      for (let i = 0; i < styles.length; i++) {
        setHubStyles((prev) => [
          ...prev,
          <style global jsx>{`
            ${styles[i].innerHTML}
          `}</style>,
        ]);
      }
    }
  }, []);

  return (
    <Customizations
      topMarginMobile={customizations.topMarginMobile}
      topMarginDesktop={customizations.topMarginDesktop}
      bottomMarginMobile={customizations.bottomMarginMobile}
      bottomMarginDesktop={customizations.bottomMarginDesktop}
      colorLabelOuter={customizations.outerBackgroundColor}
    >
      <div className="dynamic-form">
        <div className="container">
          {headings?.heading && (
            <Heading level="h2" color={headings?.headingColor}>
              {headings?.heading}
            </Heading>
          )}
          {headings?.subheading && (
            <Subheading
              level="div"
              className="b3"
              color={headings?.subheadingColor}
            >
              {headings?.subheading}
            </Subheading>
          )}

          <div id={containerID} className="form hbspt-form">
            {hubStyles}
            {hubScripts[0]}
            {window.hbspt && hubScripts[1]}{" "}
            {/* first script loads too slow for the hbspt variable, so load conditionally */}
          </div>
        </div>
      </div>
    </Customizations>
  );
};

export default DynamicForm;
