import Script from "next/script";
import React from "react";
import Customizations from "../../filters/Customizations";

interface SearchJobsProps {
  customizations?: {
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
    outerBackgroundColor?: string;
  };
}

const SearchCorporateJobs: React.FC<SearchJobsProps> = ({ customizations }) => {
  return (
    <Customizations
      topPaddingMobile={customizations?.topPaddingMobile}
      topPaddingDesktop={customizations?.topPaddingDesktop}
      bottomPaddingMobile={customizations?.bottomPaddingMobile}
      bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
      colorLabelOuter={customizations?.outerBackgroundColor}
    >
      <div className="container">
        <section className="careerplug-section">
          <iframe
            id="cpatsframe"
            src={`https://primrose-school-corporate.careerplug.com/?embed=1`}
            title="Current Openings"
            width="100%"
            height="300"
            style={{ border: "none", position: "relative" }}
          />
          <Script src={"https://cpats.s3.amazonaws.com/assets/embed.js"} />
        </section>
      </div>
    </Customizations>
  );
};

export default SearchCorporateJobs;
