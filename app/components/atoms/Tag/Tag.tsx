import React from 'react';

interface TagProps {
  label: string;
  isFeatured?: boolean;
}

const Tag: React.FC<TagProps> = ({ label, isFeatured }) => {
  let tagClass = 'tag category';
  if (isFeatured) {
    tagClass += ' featured';
  }

  return (
    <div className={tagClass}>
      {label}
    </div>
  );
};

export default Tag;
