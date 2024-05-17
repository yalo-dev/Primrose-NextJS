import Link from "next/link";
import { useState } from "react";

const DynamicRadioButtons = ({ skipURL, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  //console.log('calendly radio button inital state: ', options[0])
  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div>
      <legend
        style={{
          fontSize: "16px",
          fontWeight: "600",
          fontFamily: '"Poppins", "Helvetica Neue", Helvetica, sans-serif',
        }}
      >
        Please select an event to schedule a time below:
      </legend>
      {options.sort().map((option) => (
        <div key={option} style={{ padding: "0 1em 0 0" }}>
          <input
            type="radio"
            id={option}
            name="dynamicRadio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
          />
          <label htmlFor={option} style={{ padding: "0 0 0 .5em" }}>
            {option}
          </label>
        </div>
      ))}
      <div style={{ position: "relative", marginTop: "10px" }}>
        <Link
          style={{
            color: "#5E6738",
            fontSize: "16px",
            fontWeight: "400",
            textDecoration: "underline",
            fontFamily: '"Poppins", "Helvetica Neue", Helvetica, sans-serif',
          }}
          href={skipURL}
        >
          Or skip this step and we'll follow up with you to schedule soon. Skip{" "}
          {">"}
        </Link>
      </div>
    </div>
  );
};

export default DynamicRadioButtons;
