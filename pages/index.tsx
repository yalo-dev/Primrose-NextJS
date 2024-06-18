import { createContext } from "react";
import { CommonPageComponent } from "../app/components/templates/Layout/CommonPageComponent";
import { getPageByUri } from "../app/lib/pages";
import getMenuItems from "../queries/getMenuItems";
import getSchoolsOverview from "../queries/getSchoolsOverview";

export const SchoolsContext = createContext(null);

const HomePage = () => {
  const page = getPageByUri("home");
  const layoutSettings = getMenuItems();
  const schoolsOverview = getSchoolsOverview();
  const modules = page?.data?.page?.modules?.modules || [];

  return (
    <SchoolsContext.Provider value={schoolsOverview}>
      <CommonPageComponent modules={modules} />
    </SchoolsContext.Provider>
  );
};

export default HomePage;
