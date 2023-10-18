import React from 'react';
import Customizations from '../../filters/Customizations';

interface WysiwygEditorProps {
    editor?: string;
    customizations?: {
		topPaddingMobile?: string;
		topPaddingDesktop?: string;
		bottomPaddingMobile?: string;
		bottomPaddingDesktop?: string;
	};
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ editor, customizations }) => {
    return (
        <div className='container'>
            <Customizations
		   topPaddingMobile={customizations?.topPaddingMobile}
		   topPaddingDesktop={customizations?.topPaddingDesktop}
		   bottomPaddingMobile={customizations?.bottomPaddingMobile}
		   bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
	   >
            <div className='editor'>
                {editor && <div dangerouslySetInnerHTML={{ __html: editor }} />} 
            </div>
            </Customizations>
        </div>
    );
}

export default WysiwygEditor;
