import React from 'react';

interface UnorderedListProps {
    listClass?: string;
    children: React.ReactNode;
  }
  
  const UnorderedList: React.FC<UnorderedListProps> = ({ listClass, children }) => {
    return (
      <ul className={listClass}>
        {children}
      </ul>
    );
  }

export default UnorderedList;

// HOW TO USE
{/* <UnorderedList listClass="some-list-class">
<ListItem className="some-list-item-class">Item 1</ListItem>
<ListItem className="some-list-item-class">Item 2</ListItem>
<ListItem className="some-list-item-class">Item 3</ListItem>
</UnorderedList> 

OR

<UnorderedList listClass="some-list-class">
      {menuItems.map((item, index) => (
        <ListItem key={index} className="some-list-item-class">
          <a href={item.uri}>{item.label}</a>
        </ListItem>
      ))}
</UnorderedList> */}