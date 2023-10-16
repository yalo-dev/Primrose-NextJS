import React from 'react';
import { Green, White, DarkGray, Gray, Teal, Blue, Violet, Orange, Red, NeutralOne, NeutralTwo, NeutralThree, NeutralFour, NeutralFive, NeutralSix, GrayOne, GrayTwo, GrayThree, GrayFour, GrayFive, GraySix } from '../../filters/ColorComponent';

const getColorComponent = (color: string | undefined, children: React.ReactNode) => {
  const colors = { Green, White, DarkGray, Gray, Teal, Blue, Violet, Orange, Red, NeutralOne, NeutralTwo, NeutralThree, NeutralFour, NeutralFive, NeutralSix, GrayOne, GrayTwo, GrayThree, GrayFour, GrayFive, GraySix };
  
  if (!color) return children;
  
  const ColorComponent = colors[color];
  return ColorComponent ? <ColorComponent>{children}</ColorComponent> : children;
};

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void; 
}

const Paragraph: React.FC<ParagraphProps> = ({ children, className, color, onClick }) => {
  const coloredChildren = getColorComponent(color, children);
  return <p className={className} onClick={onClick}>{coloredChildren}</p>; 
}

export default Paragraph;

// HOW TO USE
// <Paragraph className="my-custom-class">This is a paragraph with a custom class.</Paragraph>
