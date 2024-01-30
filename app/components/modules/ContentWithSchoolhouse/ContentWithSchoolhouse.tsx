import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../atoms/Heading/Heading';
import Subheading from '../../atoms/Subheading/Subheading';
import Customizations from '../../filters/Customizations';



interface ContentWithSchoolhouseProps {
    editor: string;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        backgroundColor?: string;
	};
   
}

const ContentWithSchoolhouse: React.FC<ContentWithSchoolhouseProps> = ({ editor, customizations }) => {
    
    return (
        <div className="container">
		<Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
		   colorLabel={customizations?.backgroundColor}
	   >
                            <div className="contentwithschoolhouse" dangerouslySetInnerHTML={{ __html: editor }} />

            </Customizations>
        </div>
    );
};

export default ContentWithSchoolhouse;
