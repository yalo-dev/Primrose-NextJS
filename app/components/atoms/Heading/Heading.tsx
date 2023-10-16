import React from 'react';
import { Green, White, DarkGray, Gray, Teal, Blue, Violet, Orange, Red, NeutralOne, NeutralTwo, NeutralThree, NeutralFour, NeutralFive, NeutralSix, GrayOne, GrayTwo, GrayThree, GrayFour, GrayFive, GraySix } from '../../filters/ColorComponent';


const getColorComponent = (color: string | undefined, children: React.ReactNode) => {
  const colors = { Green, White, DarkGray, Gray, Teal, Blue, Violet, Orange, Red, NeutralOne, NeutralTwo, NeutralThree, NeutralFour, NeutralFive, NeutralSix, GrayOne, GrayTwo, GrayThree, GrayFour, GrayFive, GraySix };
  
  if (!color) return children;
  
  const ColorComponent = colors[color];
  return ColorComponent ? <ColorComponent>{children}</ColorComponent> : children;
};

interface HeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  color?: string; // Adding color prop
}

const Heading: React.FC<HeadingProps> = ({ level, children, className, color }) => {
  // Here, you can call getColorComponent function
  const coloredChildren = getColorComponent(color, children);

  switch (level) {
    case 'h1': return <h1 className={className}>{coloredChildren}</h1>;
    case 'h2': return <h2 className={className}>{coloredChildren}</h2>;
    case 'h3': return <h3 className={className}>{coloredChildren}</h3>;
    case 'h4': return <h4 className={className}>{coloredChildren}</h4>;
    case 'h5': return <h5 className={className}>{coloredChildren}</h5>;
    case 'h6': return <h6 className={className}>{coloredChildren}</h6>;
    default: return <span>{coloredChildren}</span>;
  }
}

export default Heading;


// HOW TO USE
// <Heading level="h2" className="my-custom-class" color={headingColor}>This is an H2 Heading with custom class</Heading>

