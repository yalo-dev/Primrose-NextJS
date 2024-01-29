import React from 'react';
import Customizations from '../../filters/Customizations';

interface TimelineProps {
    editor?: string;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        outerBackgroundColor?: string;
	};
}

const Timeline: React.FC<TimelineProps> = ({ editor, customizations }) => {
    return (
        
        <Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
           colorLabelOuter={customizations?.outerBackgroundColor} 
	   >
        <div className='container'>
            <div className='timeline'>
                {editor && <div dangerouslySetInnerHTML={{ __html: editor }} />} 
            </div>
        </div>
        </Customizations>
       
    );
}

export default Timeline;
