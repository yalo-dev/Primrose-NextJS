import { gql, useQuery } from "@apollo/client";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { data } = await useQuery(gql`
      query GetSeo {
        seo {
          redirects {
            format
            origin
            target
            type
          }
        }
      }
    `);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
