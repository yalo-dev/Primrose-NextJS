import { gql } from "@apollo/client";
import { client } from "../app/lib/apollo";

export default async function getResourceMenu() {
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

  return data?.menu?.menuItems?.nodes;
}
