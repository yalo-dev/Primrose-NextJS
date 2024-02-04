import React, { useEffect, useRef, useState } from 'react';

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
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<string[]>(props.selected || []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        } else {
            setContentHeight(0);
        }
    }, [isOpen]);

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];

        setSelected(newSelected);
        onSelect(newSelected);
    };
    return (
        <div className={`multi-select-dropdown custom-select ${isOpen ? 'active' : ''}`} ref={dropdownRef}>
            <div className="header" onClick={() => setIsOpen(!isOpen)}>
                {placeholder}
                <div className='icon'></div>
            </div>

            <div className="options" style={{ height: `${contentHeight}px` }}>
                <div ref={contentRef}>
                    {options.map(opt => (
                        <div key={opt.value} className={`option ${selected.includes(opt.value) ? 'active' : ''}`}>
                            <input
                                type="checkbox"
                                id={opt.value}
                                checked={selected.includes(opt.value)}
                                onChange={() => toggleOption(opt.value)}
                                onMouseDown={handleCheckboxClick}
                            />
                            <label htmlFor={opt.value}>{opt.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
