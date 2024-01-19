import React from 'react';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';
import Image from "next/legacy/image";


interface ImageComponent {
  image: {
    altText: string;
    sourceUrl: string;
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
  image?: {
    imageType: string;
    columnImage: {
      sourceUrl: string;
      altText: string;
    }
  };
  title?: string;
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
}

const getColumnClass = (columns) => {
  switch (columns.length) {
    case 2: return 'col-12 col-md-6';
    case 3: return 'col-12 col-md-4';
    case 4: return 'col-12 col-md-3';
    default: return '';
  }
};

const DynamicColumns: React.FC<DynamicColumnsProps> = ({ heading, columns, customizations }) => {


  return (
    <Customizations
      topPaddingMobile={customizations?.topPaddingMobile}
      topPaddingDesktop={customizations?.topPaddingDesktop}
      bottomPaddingMobile={customizations?.bottomPaddingMobile}
      bottomPaddingDesktop={customizations?.bottomPaddingDesktop}
    >
      <div className='dynamic-columns'>
        <div className='container'>
          <div className='row'>
          {columns.map((column, columnIndex) => ( 
            <div key={columnIndex} className={`${getColumnClass(columns)}`}>
              {column.image && column.image.columnImage.sourceUrl && <Image src={column.image.columnImage.sourceUrl} alt={column.image.columnImage.altText} />}
              {column.title && <p className='b4 bold mt-3'>{column.title}</p>}
              {column.blurb && <div className='b2 mb-4' dangerouslySetInnerHTML={{ __html: column.blurb }} />}
              {column.button && (
                <Button href={column.button.buttonLink.url} target={column.button.buttonLink.target}>
                  {column.button.buttonLink.title}
                </Button>
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
