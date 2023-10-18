import React from 'react';
import ColorComponent from '../../filters/ColorComponent';

const getColorComponent = (color: string | undefined, children: React.ReactNode) => {
  if (!color) return children;
  
  return <ColorComponent color={color}>{children}</ColorComponent>;
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
