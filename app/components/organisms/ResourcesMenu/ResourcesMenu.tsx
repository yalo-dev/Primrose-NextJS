import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { client } from '../../../lib/apollo';
import { gql } from '@apollo/client';

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

  const isActive = (uri: string): boolean => {
    const currentPathSlugs = router.asPath.split('/');
    const uriSlugs = uri.split('/');
    return currentPathSlugs[currentPathSlugs.length - 1] === uriSlugs[uriSlugs.length - 1];
  };
  console.log('Current asPath:', router.asPath);
  console.log('Current pathname:', router.pathname);
  console.log('Menu items:', menuItems);
  return (
    <>
      <div className='navbar-resources'>
        <div className='container'>
          <div className='title'>
            Stories & Resources
          </div>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className={router.asPath === item.uri || router.asPath === item.uri.slice(0, -1) ? 'active' : ''}>
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
      <div className='margin-top'></div>
    </>
  );
}
