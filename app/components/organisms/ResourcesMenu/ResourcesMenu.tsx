import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { client } from '../../../lib/apollo';
import { gql } from '@apollo/client';
import Heading from '../../atoms/Heading/Heading';
import ListItem from '../../atoms/ListItem/ListItem';
import UnorderedList from '../../molecules/UnorderedList/UnorderedList';

interface MenuItem {
  uri: string;
  label: string;
}

export default function ResourcesMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();

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

  return (
    <>
      <div className='navbar-resources'>
        <div className='container'>
          <div className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center'>
          <Heading level="h5" className="green m-sm-0">
            <Link className="green m-sm-0" href="/resources">Stories & Resources</Link>
          </Heading>
          <UnorderedList listClass='d-flex flex-grow-1 justify-center ps-0 mb-0 ps-sm-4'>
            {menuItems.map((item, index) => (
              <ListItem 
                key={index} 
                className={`${router.asPath === item.uri || router.asPath === item.uri.slice(0, -1) ? 'active' : ''} d-block position-relative pe-4`}
              >
                {item && item.label && item.uri ? (
                  <Link className='b2' href={item.uri}>{item.label}</Link>
                ) : (
                  <span>Invalid item</span>
                )}
              </ListItem>
            ))}
          </UnorderedList>
          </div>
        </div>
      </div>
      {/* offset for menu height */}
      <div className='resource-margin-top'></div>  
    </>
  );
}
