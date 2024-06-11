import { gql, useQuery } from "@apollo/client";

export default function getResourceMenu() {
  const { data } = useQuery(gql`
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
  `);

  return data?.menu?.menuItems?.nodes;
}
