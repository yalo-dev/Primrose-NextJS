import { useQuery } from "@apollo/client";
import { generateSitemap, GET_MARKETS_SITEMAP } from "../utilities/sitemap";

export default function () {}

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"];
  const { data } = await useQuery(GET_MARKETS_SITEMAP);

  // markets' modified time is pulled from a query on the schools
  // check each market shows once and choose the most recent modified time
  let reformat = {};
  data?.schools?.nodes?.forEach((node) => {
    const marketNode = node.markets?.nodes[0];
    const url = marketNode?.uri;

    if (!url) return;

    if (reformat[url]) {
      reformat[url].modifiedGmt < node.modifiedGmt
        ? (reformat[url] = { modifiedGmt: node.modifiedGmt, uri: url })
        : (reformat[url] = reformat[url]);
    } else {
      reformat[url] = { modifiedGmt: node.modifiedGmt, uri: url };
    }
  });

  // include careers url path in sitemap
  type SitemapNode = { uri: string; modifiedGmt: string };
  const withCareers = [];
  Object.values(reformat).forEach((node: SitemapNode) => {
    withCareers.push(node);
    const nodeWithCareers = {
      ...node,
      uri: node.uri.replace("locations/", "locations/careers/"),
    };
    withCareers.push(nodeWithCareers);
  });

  const sitemap = generateSitemap(withCareers, `${proto}://${host}`);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
