import React from 'react';
import { useRouter } from 'next/router';

interface TagProps {
  label: string;
  isFeatured?: boolean;
  tagSlug: string;
}

const Tag: React.FC<TagProps> = ({ label, isFeatured, tagSlug }) => {
  const router = useRouter();

  let tagClass = 'tag category';
  if (isFeatured) {
    tagClass += ' featured';
  }

  const handleTagClick = (e: React.MouseEvent) => {
    e.preventDefault();   // Prevent default click behavior
    e.stopPropagation(); // Prevent triggering parent's click handler
    router.push(`/resources/${tagSlug}`);
  };
  
  return (
    <div 
      className={`d-flex align-items-center ${tagClass} clickable tag`}
      onClick={handleTagClick}
    >
      {label}
    </div>
  );
};

export default Tag;
