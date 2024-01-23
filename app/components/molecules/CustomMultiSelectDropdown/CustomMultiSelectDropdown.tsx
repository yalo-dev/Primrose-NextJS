import React, { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string;
    className?: string; // Add className to the Option interface
}

interface CustomMultiSelectDropdownProps {
    options: Option[];
    onSelect: (selectedValues: string[]) => void;
    placeholder?: string;
}

export const CustomMultiSelectDropdown: React.FC<CustomMultiSelectDropdownProps> = ({
    options,
    onSelect,
    placeholder = "Select",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        setSelected(newSelected);
        onSelect(newSelected);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && optionsRef.current) {
            optionsRef.current.style.height = `${optionsRef.current.scrollHeight}px`;
        } else if (optionsRef.current) {
            optionsRef.current.style.height = '0px';
        }
    }, [isOpen]);

    return (
        <div className={`custom-multi-select-dropdown multi-select-dropdown custom-select ${isOpen ? 'active' : ''}`} ref={dropdownRef}>
            <div className="header" onClick={() => setIsOpen(!isOpen)}>
                {placeholder}
                <div className='icon'></div>
            </div>
            <div className="options" ref={optionsRef}>
                {options.map((opt) => (
                    <div key={opt.value} className={`option ${opt.className ? opt.className : ''} ${selected.includes(opt.value) ? 'active' : ''}`}>
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
        </div>
    );
};
