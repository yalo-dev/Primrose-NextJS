import React from 'react';

interface ListItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ className, children, onClick }) => {
  return (
    <li className={className} onClick={onClick}>
      {children}
    </li>
  );
}

export default ListItem;

// HOW TO USE
// <ul>
// <ListItem>Item 1</ListItem>
// <ListItem className="special-item">Item 2</ListItem>
// <ListItem onClick={() => console.log("Item clicked!")}>Clickable Item</ListItem>
// // ... other list items
// </ul>