import React from 'react';

interface TagProps {
  label: string;
  isFeatured?: boolean;
}

const Tag: React.FC<TagProps> = ({ label, isFeatured }) => {
  let tagClass = 'tag category';
  if (isFeatured) {
    tagClass += 'tag featured';
  }

  return (
    <div className={`d-flex align-items-center ${tagClass}`}>
      {label}
    </div>
  );
};

export default Tag;
