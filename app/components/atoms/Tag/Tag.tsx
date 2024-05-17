import { useRouter } from "next/router";
import React from "react";

interface TagProps {
  label: string;
  isFeatured?: boolean;
  tagSlug: string;
}

const Tag: React.FC<TagProps> = ({ label, isFeatured, tagSlug }) => {
  const router = useRouter();

  let tagClass = "tag category";
  if (isFeatured) {
    tagClass += " featured";
  }

  const handleTagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/stories-resources/tag/${tagSlug}`);
  };

  return (
    <a href={`/stories-resources/tag/${tagSlug}`}>
      <div
        className={`d-flex align-items-center clickable ${tagClass}`}
        onClick={handleTagClick}
      >
        {label}
      </div>
    </a>
  );
};

export default Tag;
