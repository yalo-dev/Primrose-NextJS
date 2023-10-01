import React from 'react';

interface SubheadingProps {
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  children: React.ReactNode;
  className?: string;
}

const Subheading: React.FC<SubheadingProps> = ({ level, children, className }) => {
  switch (level) {
    case 'h2': return <h2 className={className}>{children}</h2>;
    case 'h3': return <h3 className={className}>{children}</h3>;
    case 'h4': return <h4 className={className}>{children}</h4>;
    case 'h5': return <h5 className={className}>{children}</h5>;
    case 'h6': return <h6 className={className}>{children}</h6>;
    case 'div': return <div className={className}>{children}</div>;
    default: return <span>{children}</span>;
  }
}

export default Subheading;

// HOW TO USE
// <Subheading level="h2">This is an H2 subheading.</Subheading>
// <Subheading level="div" className="my-custom-class">This is a div subheading with a custom class.</Subheading>
