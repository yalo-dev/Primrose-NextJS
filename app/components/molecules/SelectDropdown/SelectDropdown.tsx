import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const SelectDropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0] || "");
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
  
    const { height } = useSpring({
      from: { height: 0 },
      to: { height: isOpen ? optionsRef.current?.scrollHeight : 0 }
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? 'active' : ''}`} ref={dropdownRef}>
      <div className="header" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
        <div className='icon'></div>
      </div>

      <animated.div className="options" ref={optionsRef} style={{ height }}>
        {options.map((option, idx) => (
          <div key={idx} className="option" onClick={() => handleOptionClick(option)}>
            {option}
          </div>
        ))}
      </animated.div>
    </div>
  );
}

export default SelectDropdown;
