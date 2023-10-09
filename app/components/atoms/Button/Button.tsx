import Link from 'next/link';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariants = 'primary' | 'secondary' | 'white';

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
        case 'white':
            buttonClass = 'white';
            break;
        default:
            break;
    }
    if (href) {
        return (
            <Link href={href} passHref>
                <button className={buttonClass} {...props}>{label || children}</button>
            </Link>
        );
    }
    return <button className={buttonClass} {...props}>{label || children}</button>;
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
