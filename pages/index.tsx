import { createContext } from "react";
import { CommonPageComponent } from "../app/components/templates/Layout/CommonPageComponent";
import { getPageByUri } from "../app/lib/pages";
import getMenuItems from "../queries/getMenuItems";
import getSchoolsOverview from "../queries/getSchoolsOverview";

export const SchoolsContext = createContext(null);

const HomePage = ({ page, schoolsOverview }) => {
  const modules = page?.data?.page?.modules?.modules || [];

  return (
    <SchoolsContext.Provider value={schoolsOverview}>
      <CommonPageComponent modules={modules} />
    </SchoolsContext.Provider>
  );
};

export default HomePage;

export async function getStaticProps() {
  const page = await getPageByUri("home");
  const layoutSettings = await getMenuItems();
  const schoolsOverview = await getSchoolsOverview();

  return {
    props: {
      page,
      layoutSettings,
      schoolsOverview,
    },
    revalidate: 10,
  };
}
