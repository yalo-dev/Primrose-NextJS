import { useQuery } from "@apollo/client";
import { generateSitemap, GET_RESOURCES_SITEMAP } from "../utilities/sitemap";

export default function () {}

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"];
  const { data } = await useQuery(GET_RESOURCES_SITEMAP);
  const sitemap = generateSitemap(data.resources.nodes, `${proto}://${host}`);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
