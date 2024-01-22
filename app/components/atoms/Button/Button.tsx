import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';
import {decode} from 'html-entities';

type ButtonVariants = string;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariants;
    label?: string;
    href?: string;
    target?: string;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, href, target, children, ...props }) => {
    let buttonClass = '';

    switch (variant) {
        case 'primary':
            buttonClass = 'primary';
            break;
        case 'secondary':
            buttonClass = 'secondary';
            break;
        default:
            break;
    }
    if (href) {
        return (
            <Link href={href} passHref>
                <button className={buttonClass} {...props}>{decode(label) || children}</button>
            </Link>
        );
    }
    return <button className={buttonClass} {...props}>{decode(label) || children}</button>;
}

export default Button;

// HOW TO USE
{/* <Button label="Click me!" onClick={() => console.log('Button clicked!')} />
<Button href="/somepage" label="Go to somepage" />
<Button variant="secondary" label="Secondary button" />
<Button>
  <span style={{color: 'red'}}>Custom Styled Text</span>
</Button>
<Button href="https://www.example.com" target="_blank" label="Open in new tab" />
<Button variant="white" href="/white-page" label="White Page" onClick={() => console.log('Navigating to White Page')} /> */}
