import React from 'react';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';

interface ClassroomSelectAndImageProps {
  leftColumn: {
    image: {
      sourceUrl: string;
    };
  };
  rightColumn: {
    heading: string;
    subheading: string;
  };
}

const dummyOptions = ['Option 1', 'Option 2', 'Option 3'];

const ClassroomSelectAndImage: React.FC<ClassroomSelectAndImageProps> = ({ leftColumn, rightColumn }) => {
  const dummyOptions = ['Choose a Classroom', 'Classroom 2', 'Classroom 3']; 

  return (
    <div className="container">
        <div className="classroom-select-and-image">
        <div className="left-column col-12 col-lg-6">
            <img src={leftColumn.image.sourceUrl} alt="Classroom Featured Image" />
        </div>
        <div className="right-column col-12 col-lg-6">
            <h2 className='green'>{rightColumn.heading}</h2>
            <p className='b3'>{rightColumn.subheading}</p>

                <SelectDropdown options={dummyOptions} />

            
        </div>
        <div className='accent'></div>
        </div>
     </div>
  );
}

export default ClassroomSelectAndImage;
