import React from 'react';
import ColorComponent from '../../filters/ColorComponent';

const getColorComponent = (color: string | undefined, children: React.ReactNode) => {
  if (!color) return children;
  
  return <ColorComponent color={color}>{children}</ColorComponent>;
};

interface SubheadingProps {
  level:  'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  children: React.ReactNode;
  className?: string;
  color?: string; // Adding color prop
}

const Subheading: React.FC<SubheadingProps> = ({ level, children, className, color }) => {
  // Here, you can call getColorComponent function
  const coloredChildren = getColorComponent(color, children);

  switch (level) {
    case 'h2': return <h2 className={className}>{coloredChildren}</h2>;
    case 'h3': return <h3 className={className}>{coloredChildren}</h3>;
    case 'h4': return <h4 className={className}>{coloredChildren}</h4>;
    case 'h5': return <h5 className={className}>{coloredChildren}</h5>;
    case 'h6': return <h6 className={className}>{coloredChildren}</h6>;
    case 'div': return <div className={className}>{coloredChildren}</div>;
    default: return <span>{coloredChildren}</span>;
  }
}

export default Subheading;

// HOW TO USE
// <Subheading level="h2">This is an H2 subheading.</Subheading>
// <Subheading level="div" className="my-custom-class" color={subheadingColor}>This is a div subheading with a custom class.</Subheading>
