import React from 'react';
import SelectDropdown from '../../molecules/SelectDropdown/SelectDropdown';
import Button from '../../atoms/Button/Button';

interface ButtonProps {
    target?: string;
    title?: string;
    url?: string;
}

interface ClassroomSelectAndContentProps {
    leftColumn: {
        heading?: string;
        subheading?: string;
        button?: ButtonProps;
        image?: {
            sourceUrl?: string;
        };
    };
    rightColumn: {
        heading?: string;
        subheading?: string;
    };
}

const dummyOptions = ['Choose a Classroom', 'Classroom 2', 'Classroom 3'];

const ClassroomSelectAndContent: React.FC<ClassroomSelectAndContentProps> = ({ leftColumn, rightColumn }) => {
    return (
        <div className="container">
            <div className="classroom-select-and-content">
                <div className="left-column col-12 col-lg-7">
                    {leftColumn.heading && <h2 className='green'>{leftColumn.heading}</h2>}
                    {leftColumn.subheading && <p className='b3'>{leftColumn.subheading}</p>}
                    {leftColumn.button?.url && (
                        <Button variant='primary' href={leftColumn.button.url} target={leftColumn.button.target || "_self"}>
                            {leftColumn.button.title}
                        </Button>
                    )}
                     {leftColumn.image?.sourceUrl && (
                        <img src={leftColumn.image.sourceUrl} alt="Classroom Featured Image" />
                    )}
                </div>
                <div className="right-column col-12 col-lg-5">
                    {rightColumn.heading && <h2 className='green'>{rightColumn.heading}</h2>}
                    {rightColumn.subheading && <p className='b3'>{rightColumn.subheading}</p>}
                    <SelectDropdown options={dummyOptions} />
                    <div className='accent'></div>
                </div>
               
            </div>
        </div>
    );
}

export default ClassroomSelectAndContent;
