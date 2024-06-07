import { useQuery } from "@apollo/client";
import { generateSitemap, GET_SCHOOLS_SITEMAP } from "../utilities/sitemap";

export default function () {}

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"];
  const { data } = await useQuery(GET_SCHOOLS_SITEMAP);

  // format to include all pages withing the schools route
  const withAllPages = [];
  data?.schools?.nodes?.forEach((node) => {
    const classrooms = node?.schoolAdminSettings?.classroomsOffered;
    const hasStaff = node?.schoolAdminSettings?.staffMembers?.length;

    // push homepage
    withAllPages.push(node);

    // prevent duplicate featured images
    const noImageNode = {
      ...node,
      featuredImage: null,
    };

    // push classroom index page
    const classroomIndex = {
      ...noImageNode,
      uri: node.uri + "/classrooms",
    };
    withAllPages.push(classroomIndex);

    // push classroom detail pages
    classrooms?.forEach((classroom) => {
      const slug = classroom
        .replace(/& /g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      withAllPages.push({
        ...classroomIndex,
        uri: classroomIndex.uri + `/${slug}`,
      });
    });

    // push staff pages if school has staff
    hasStaff &&
      withAllPages.push({
        ...noImageNode,
        uri: node.uri + "/staff",
      });

    // push careers pagess
    withAllPages.push({
      ...noImageNode,
      uri: node.uri + "/careers",
    });

    // push schedule-a-tour pages
    withAllPages.push({
      ...noImageNode,
      uri: node.uri + "/schedule-a-tour",
    });
  });

  const sitemap = generateSitemap(withAllPages, `${proto}://${host}`);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
