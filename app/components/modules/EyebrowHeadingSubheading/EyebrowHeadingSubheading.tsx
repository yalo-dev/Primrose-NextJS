import React from 'react';
import ColorComponent from '../../filters/ColorComponent';
import Customizations from '../../filters/Customizations';

interface Props {
  eyebrow?: string;
  eyebrowColor?: string;
  heading?: string;
  headingColor?: string;
  headingSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subheading?: string;
  subheadingColor?: string;
  subheadingSize?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  customizations?: {
    topPaddingMobile?: string;
    topPaddingDesktop?: string;
    bottomPaddingMobile?: string;
    bottomPaddingDesktop?: string;
  };
  alignment?: 'left' | 'center' | 'right';
}

const EyebrowHeadingSubheading: React.FC<Props> = ({
  eyebrow, eyebrowColor, heading, headingColor, headingSize = 'h2',
  subheading, subheadingColor, subheadingSize = 'h3', customizations, alignment = 'left'
}) => {

  const containerStyle = {
    textAlign: alignment
  };


  const createMarkup = (text: string | undefined) => {
    return { __html: text || '' };
  };

  return (
    <div className='container' style={containerStyle}>
      <Customizations
        topPaddingMobile={customizations?.topPaddingMobile}
        topPaddingDesktop={customizations?.topPaddingDesktop}
        bottomPaddingMobile={customizations?.bottomPaddingMobile}
        bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
      >
        <div className="eyebrow-heading-subheading">
          {eyebrow && (
            <span>
              <ColorComponent color={eyebrowColor}>
                <span dangerouslySetInnerHTML={createMarkup(eyebrow)} />
              </ColorComponent>
            </span>
          )}
          {heading && React.createElement(
            headingSize, 
            {}, 
            <ColorComponent color={headingColor}>
              <span dangerouslySetInnerHTML={createMarkup(heading)} />
            </ColorComponent>
          )}
          {subheading && React.createElement(
            subheadingSize, 
            {}, 
            <ColorComponent color={subheadingColor}>
              <span dangerouslySetInnerHTML={createMarkup(subheading)} />
            </ColorComponent>
          )}
        </div>
      </Customizations>
    </div>
  );
};

export default EyebrowHeadingSubheading;
