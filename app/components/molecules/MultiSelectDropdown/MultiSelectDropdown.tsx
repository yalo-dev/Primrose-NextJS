import React, { useState, useEffect, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  onSelect: (selectedValues: string[]) => void;
  placeholder?: string;
  selected?: string[];  
}

export const MultiSelectDropdown: React.FC<MultiSelectProps> = (props) => {
    const { options, onSelect, placeholder = "Select" } = props;
    const [isOpen, setIsOpen] = useState(false);
    const selected = props.selected || [];
    const dropdownRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
  
    const toggleOption = (value: string, e) => {
        e.preventDefault();
        
        const newSelected = selected.includes(value) 
            ? selected.filter(v => v !== value) 
            : [...selected, value];
        
        onSelect(newSelected);
    };
    useEffect(() => {
        console.log("Dropdown state changed to:", isOpen);
    }, [isOpen]);
    
  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
        <div className="header" onClick={() => {
    console.log("Header Clicked");
    setIsOpen(!isOpen);
}}>
    {selected.length > 0 ? selected.join(', ') : placeholder}
</div>

        {isOpen && (
        <div className="options" onClick={(e) => e.stopPropagation()}>
            {options.map(opt => (
           <div key={opt.value} className="option">
               <input 
    type="checkbox"
    id={opt.value}
    checked={selected.includes(opt.value)}
    onChange={(e) => e.preventDefault()} // Added this line
    onClick={(e) => {
        e.stopPropagation(); 
        toggleOption(opt.value, e);
    }} 
/>


                <label htmlFor={opt.value}>{opt.label}</label>
            </div>
            ))}
        </div>
        )}

    </div>
  );
}
