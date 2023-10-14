import React from 'react';

interface WysiwygEditorProps {
    editor?: string; // Made it optional
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ editor }) => {
    return (
        <div className='container pt-5 pb-5'>
            {editor && <div dangerouslySetInnerHTML={{ __html: editor }} />} 
        </div>
    );
}

export default WysiwygEditor;
