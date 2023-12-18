import React from 'react';
import Customizations from '../../filters/Customizations';
import Button from '../../atoms/Button/Button';
import Heading from '../../atoms/Heading/Heading';


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
    altText: string;
    sourceUrl: string;
  };
  title?: string;
  blurb?: string;
  button?: {
    target: string;
    title: string;
    url: string;
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

const getColumnClass = (columnWidth) => {
  switch (columnWidth) {
    case '25%': return 'quarter';
    case '33%': return 'third';
    case '50%': return 'half';
    case '66%': return 'two-third';
    case '75%': return 'three-fourth';
    case '100%': return 'full';
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
          <div className='col-12 col-lg-6'>{heading && <h2 className='green mb-5'>{heading}</h2>}</div>
          <div className='columns'>
          {columns.map((column, columnIndex) => ( 
            <div key={columnIndex} className={`column ${getColumnClass(column.columnWidth)}`}>
              {column.image && <img src={column.image.sourceUrl} alt={column.image.altText} />}
              {column.title && <p className='b4 bold mt-3'>{column.title}</p>}
              {column.blurb && <p className='b2 mb-4'>{column.blurb}</p>}
              {column.button && (
                <Button href={column.button.url} target={column.button.target}>
                  {column.button.title}
                </Button>
              )}
              {/* {column.components.map((component, componentIndex) => {
                if ('image' in component) {
                  return <img key={componentIndex} src={component.image.sourceUrl} alt={component.image.altText} />;
                }
                if ('bodyCopy' in component) {
                  return <p key={componentIndex} className={component.bodyCopySize}>{component.bodyCopy}</p>;
                }
                if ('button' in component) {
                  return (
                    <Button key={componentIndex} href={component.button.url} target={component.button.target} variant={component.buttonStyle}>
                      {component.button.title}
                    </Button>
                  );
                }
                if ('heading' in component) {
                  return (
                    <Heading key={componentIndex} level={component.headingSize} color={component.headingColor}>
                      {component.heading}
                    </Heading>
                  );
                }
                if ('wysiwyg' in component) {
                  return <div key={componentIndex} dangerouslySetInnerHTML={{ __html: component.wysiwyg }} />;
                }
                return null;
              })} */}
            </div>
          ))}
          </div>
        </div>
      </div>
    </Customizations>
  );
};

export default DynamicColumns;
