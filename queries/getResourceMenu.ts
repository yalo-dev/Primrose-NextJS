import { gql, useQuery } from "@apollo/client";

export default async function getResourceMenu() {
  const { data } = await useQuery(gql`
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
