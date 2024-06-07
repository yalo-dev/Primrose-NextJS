import { useQuery } from "@apollo/client";
import { generateSitemap, GET_PAGES_SITEMAP } from "../utilities/sitemap";

export default function () {}

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"];
  const { data } = await useQuery(GET_PAGES_SITEMAP);
  const sitemap = generateSitemap(data.pages.nodes, `${proto}://${host}`);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
