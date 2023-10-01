import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => {
  return <p className={className}>{children}</p>;
}

export default Paragraph;

// HOW TO USE
// <Paragraph className="my-custom-class">This is a paragraph with a custom class.</Paragraph>
