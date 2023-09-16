import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { client } from '../../../lib/apollo';
import { gql } from '@apollo/client';

interface MenuItem {
  uri: string;
  label: string;
}

export default function ResourceMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data } = await client.query({
        query: gql`
          query ResourcesMenu {
            menu(id: "9", idType: DATABASE_ID) {
              menuItems {
                nodes {
                  uri
                  label
                }
              }
            }
          }
        `,
      });

      if (data.menu && data.menu.menuItems && Array.isArray(data.menu.menuItems.nodes)) {
        setMenuItems(data.menu.menuItems.nodes);
      }
    };

    fetchMenuItems();
    
  }, []);

  // const scrollContainerRef = useRef<HTMLUListElement>(null);

  // const handleScroll = (direction) => {
  //   if (scrollContainerRef.current) {
  //     const container = scrollContainerRef.current;
  //     let scrollAmount = 0;
  //     const slideTimer = setInterval(function(){
  //       if(direction === 'left'){
  //         container.scrollLeft -= 10;
  //       } else {
  //         container.scrollLeft += 10;
  //       }
  //       scrollAmount += 10;
  //       if(scrollAmount >= 100){
  //         window.clearInterval(slideTimer);
  //       }
  //     }, 25);
  //   }
  // };


 return (
  <>
      <div className='navbar-resources'>
        <div className='container'>
          <div className='title'>
              Stories & Resources
          </div>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                {item && item.label && item.uri ? (
                  <Link href={item.uri}>{item.label}</Link>
                ) : (
                  <span>Invalid item</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='padding'></div>
    </>
  );
}
