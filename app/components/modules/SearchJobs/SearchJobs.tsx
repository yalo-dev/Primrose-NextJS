import React from 'react';
import Customizations from '../../filters/Customizations';
import Script from "next/script";

interface SearchJobsProps {
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        outerBackgroundColor?: string;
	};
}

const SearchJobs: React.FC<SearchJobsProps> = ({ customizations }) => {
    return (
        
        <Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
           colorLabelOuter={customizations?.outerBackgroundColor} 
	   >
        <div className='container'>
            <section className="careerplug-section">
                <iframe
                    id='cpatsframe'
                    src={`https://primrosecareers.careerplug.com/jobs?embed=1`}
                    title="Current Openings"
                    width="100%"
                    height="300"
                    style={{ border: 'none', position: 'relative'}}
                />
                <Script src={"https://cpats.s3.amazonaws.com/assets/embed.js"} />
            </section>
        </div>
        </Customizations>
       
    );
}

export default SearchJobs;
