import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'white';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariants;
    label: string;
    href?: string;
    target?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, href, target, ...props }) => {
    let buttonClass = '';

    switch (variant) {
        case 'primary':
            buttonClass = 'primary';
            break;
        case 'secondary':
            buttonClass = 'secondary';
            break;
        case 'white':
            buttonClass = 'white';
            break;
        default:
            break;
    }
    if (href) {
        return (
            <a href={href} target={target}>
                <button className={buttonClass} {...props}>{label}</button>
            </a>
        );
    }
    return <button className={buttonClass} {...props}>{label}</button>;
}

export default Button;

Button.displayName = 'Button'