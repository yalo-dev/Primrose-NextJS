import { CommonPageComponent } from "../../app/components/templates/Layout/CommonPageComponent";
import { getAllPages, getPageByUri } from "../../app/lib/pages";

const DynamicPage = ({ page }) => {
  const modules = page?.data?.page?.modules?.modules || [];

  return <CommonPageComponent modules={modules} />;
};

export async function getStaticProps({ params }) {
  const { slugParent, slugChild } = params;
  let pageUri = `/${slugParent}/`;
  if (Array.isArray(slugChild) && slugChild.length > 0) {
    pageUri = `${pageUri}${slugChild.join("/")}/`;
  }
  const page = await getPageByUri(pageUri);

  if (!page.data.page) return { notFound: true };

  return {
    props: {
      page,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const pages = await getAllPages();
  const dynamicPages = pages.filter((el) => el?.node.uri.length > 1);
  const paths = dynamicPages.map((page) => {
    const segments = page.node.uri.split("/").filter((seg) => seg !== "");
    let slugParent = segments.shift();
    let slugChild = segments;
    return {
      params: {
        slugParent: slugParent,
        slugChild: slugChild,
        uri: page.uri,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default DynamicPage;
