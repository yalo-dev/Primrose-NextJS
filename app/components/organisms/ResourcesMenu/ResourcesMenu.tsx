import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getResourceMenu from "../../../../queries/getResourceMenu";
import Heading from "../../atoms/Heading/Heading";
import ListItem from "../../atoms/ListItem/ListItem";
import UnorderedList from "../../molecules/UnorderedList/UnorderedList";

interface MenuItem {
  uri: string;
  label: string;
}

export default function ResourcesMenu({ resourceMenu }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(resourceMenu);
  const router = useRouter();

  useEffect(() => {
    if (!menuItems) getResourceMenu().then((res) => setMenuItems(res));
  }, []);

  return (
    <>
      <div className="navbar-resources">
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
            <Heading level="h5" className="green m-sm-0">
              <Link className="green m-sm-0" href="/stories-resources">
                Stories & Resources
              </Link>
            </Heading>
            <UnorderedList listClass="d-flex flex-grow-1 justify-center ps-0 mb-0 ps-sm-5">
              {menuItems?.map((item, index) => (
                <ListItem
                  key={index}
                  className={`${router.asPath === item.uri || router.asPath === item.uri.slice(0, -1) ? "active" : ""} d-block position-relative pe-4`}
                >
                  {item && item.label && item.uri ? (
                    <Link className="b2" href={item.uri}>
                      {item.label}
                    </Link>
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
      <div className="resource-margin-top"></div>
    </>
  );
}
