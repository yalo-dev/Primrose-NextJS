import React from 'react';
import Customizations from '../../filters/Customizations';

interface WysiwygEditorProps {
    editor?: string;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
        outerBackgroundColor?: string;
	};
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ editor, customizations }) => {
    return (
        
        <Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
           colorLabelOuter={customizations?.outerBackgroundColor} 
	   >
        <div className='container'>
            <div className='editor'>
                {editor && <div dangerouslySetInnerHTML={{ __html: editor }} />} 
            </div>
        </div>
        </Customizations>
       
    );
}

export default WysiwygEditor;
