import React from 'react';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';

interface ClassroomSelectAndImageProps {
  leftColumn: {
    image?: {
      sourceUrl?: string;
    };
  };
  rightColumn: {
    heading?: string;
    subheading?: string;
  };
}

const ClassroomSelectAndImage: React.FC<ClassroomSelectAndImageProps> = ({ leftColumn, rightColumn }) => {
  const dummyOptions = ['Choose a Classroom', 'Classroom 2', 'Classroom 3'];

  return (
    <div className="container">
      <div className="classroom-select-and-image">
        {leftColumn.image?.sourceUrl && (
          <div className="left-column col-12 col-lg-6">
            <img src={leftColumn.image.sourceUrl} alt="Classroom Featured Image" />
          </div>
        )}

        {(rightColumn.heading || rightColumn.subheading) && (
          <div className="right-column col-12 col-lg-6">
            {rightColumn.heading && <h2 className='green'>{rightColumn.heading}</h2>}
            {rightColumn.subheading && <p className='b3'>{rightColumn.subheading}</p>}

            {(dummyOptions && dummyOptions.length > 0) && <SelectDropdown options={dummyOptions} />}
          </div>
        )}
        <div className='accent'></div>
      </div>
    </div>
  );
}

export default ClassroomSelectAndImage;
