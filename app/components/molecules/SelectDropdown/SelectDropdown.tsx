import React, {useState, useRef, useEffect, Dispatch, SetStateAction} from 'react';
import { useSpring, animated } from 'react-spring';

export interface OptionType {
    label: string;
    value: string;
}

interface SelectDropdownProps {
    options: OptionType[];
    placeholder?: string;
    onSelect: Dispatch<SetStateAction<OptionType>>;
    selectedOption: OptionType
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, placeholder, onSelect, selectedOption }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleOptionClick = (option: OptionType, event: React.MouseEvent) => {
        event.preventDefault();
        onSelect(option);
        setIsOpen(false);
    };


    return (
        <div className={`custom-select ${isOpen ? 'active' : ''}`} ref={dropdownRef}>
            <div className="header" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption?.label ?? placeholder}
                <div className='icon'></div>
            </div>

            <animated.div className="options" ref={optionsRef} style={{ height }}>
                {options.map((option, idx) => (
                    <div key={idx} className="option" data-value={option.value}>
                        <a target={"_self"} onClick={(event) => handleOptionClick(option, event)}>
                            {option.label}
                        </a>
                    </div>
                ))}
            </animated.div>
        </div>
    );
}

export default SelectDropdown;
