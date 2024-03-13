import React, { useState } from 'react';

const DynamicRadioButtons = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    console.log('calendly radio button inital state: ', options[0])
    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        onSelect(value);
    };

    return (
        <div>
            <h4>Please select an event to schedule a time below:</h4>
            {options.map((option) => (
                <div key={option} style={{display: "inline", padding: '0 1em 0 0',}}>
                    <input
                        type="radio"
                        id={option}
                        name="dynamicRadio"
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                    />
                    <label htmlFor={option} style={{padding: "0 0 0 .5em"}}>{option}</label>
                </div>
            ))}
        </div>
    );
};

export default DynamicRadioButtons;