import React, { useState, useEffect, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  onSelect: (selectedValues: string[]) => void;
  placeholder?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectProps> = ({ options, onSelect, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    //onSelect(selected);
  }, [selected, onSelect]);
 
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
    };

  const toggleOption = (value: string) => {
    setSelected(prevState => {
      if (prevState.includes(value)) {
        return prevState.filter(v => v !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="header" onClick={() => setIsOpen(!isOpen)}>
        {selected.length > 0 ? selected.join(', ') : placeholder}
      </div>
      {isOpen && (
        <div className="options">
          {options.map(opt => (
            <div key={opt.value} className="option">
              <input 
                type="checkbox"
                id={opt.value}
                checked={selected.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
              <label htmlFor={opt.value}>{opt.label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
