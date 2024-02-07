import React from 'react';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';

interface ImageComponent {
  image: {
    altText: string;
    sourceUrl: string;
    imageType: 'Icon' | 'Normal Image'; // Add the imageType property
  };
}

interface BodyCopyComponent {
  bodyCopy: string;
  bodyCopyColor?: string;
  bodyCopySize: 'b1' | 'b2' | 'b3' | 'b4' | 'b5';
}

interface ButtonComponent {
  button: {
    target: string;
    title: string;
    url: string;
  };
  buttonStyle?: 'primary' | 'secondary' | 'white';
}

interface HeadingComponent {
  heading: string;
  headingColor?: string;
  headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface wysiwygComponent {
  wysiwyg: string;
}

type Component = ImageComponent | BodyCopyComponent | ButtonComponent | HeadingComponent | wysiwygComponent;

interface Column {
  columnWidth: string;
  imageOrVideo?: 'Image' | 'Video';
  video?: {
    target: string;
    title: string;
    url: string;
  }
  image?: {
    imageType: string;
    columnImage: {
      sourceUrl: string;
      altText: string;
    }
  };
  title?: {
    columnTitle: string;
    headingLevel?: 'h2' | 'h3' | 'h4' | 'h5';
  }
  blurb?: string;
  button?: {
    buttonLink: {
      target: string;
      title: string;
      url: string;
    }
    buttonStyle: string;
  };
  components: Component[];
}

interface CustomizationsData {
  bottomPaddingDesktop?: string;
  bottomPaddingMobile?: string;
  outerBackgroundColor?: string;
  topPaddingDesktop?: string;
  topPaddingMobile?: string;
}

interface DynamicColumnsProps {
  heading?: string;
  columns: Column[];
  customizations?: CustomizationsData;
  moduleId?: string;
}

const getColumnClass = (columns) => {
  switch (columns.length) {
    case 2: return 'dynamic-length col-12 col-md-6';
    case 3: return 'dynamic-length col-12 col-md-4';
    case 4: return 'dynamic-length col-12 col-md-3';
    default: return '';
  }
};

const DynamicColumns: React.FC<DynamicColumnsProps> = ({ heading, columns, customizations, moduleId }) => {
  const isTwoColumns = columns.length === 2;

  return (
    <Customizations
      topPaddingMobile={customizations?.topPaddingMobile}
      topPaddingDesktop={customizations?.topPaddingDesktop}
      bottomPaddingMobile={customizations?.bottomPaddingMobile}
      bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
    >
      <div className='dynamic-columns' id={moduleId}>
        <div className='container'>
          <div className='row d-flex flex-row flex-wrap justify-content-center'>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className={`${getColumnClass(columns)} d-flex flex-column`}>
                {column.imageOrVideo === 'Image' && column.image && column.image.columnImage && column.image.columnImage.sourceUrl && (
                  <img
                    src={column.image.columnImage.sourceUrl}
                    alt={column.image.columnImage.altText}
                    className={column.image.imageType === 'Icon' ? 'icon-image' : 'normal-image-video'}
                  />
                )}
                {column.imageOrVideo === 'Video' && column.video && (
                  <video className="normal-image-video"
                    autoPlay
                    muted
                    loop>
                    <source src={column.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="title-container column-gap">
                  {column.title && column.title.headingLevel && (
                    React.createElement(column.title.headingLevel, null, column.title.columnTitle)
                  )}
                </div>
                {column.blurb && <div className='b2 mb-4' dangerouslySetInnerHTML={{ __html: column.blurb }} />}
                {column.button && (
                  <div className='link-container'>
                    {column.button.buttonStyle === 'Style 1' ? (
                      <Button
                        href={column.button.buttonLink.url}
                        target={column.button.buttonLink.target}
                        variant="primary" // Use 'primary' variant for Style 1
                      >
                        {column.button.buttonLink.title}
                      </Button>
                    ) : column.button.buttonStyle === 'Style 2' ? (
                      <a
                        href={column.button.buttonLink.url}
                        target={column.button.buttonLink.target}
                        className="custom-style-2"
                      >
                        {column.button.buttonLink.title}
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Customizations>
  );
};

export default DynamicColumns;