import { CommonPageComponent } from "../app/components/templates/Layout/CommonPageComponent";
import { getPageByUri } from "../app/lib/pages";
import getMenuItems from "../queries/getMenuItems";

const HomePage = ({ page }) => {
  const modules = page?.data?.page?.modules?.modules || [];

  return <CommonPageComponent modules={modules} />;
};

export default HomePage;

export async function getStaticProps() {
  const page = await getPageByUri("home");
  const layoutSettings = await getMenuItems();

  return {
    props: {
      page,
      layoutSettings,
    },
    revalidate: 10,
  };
}
