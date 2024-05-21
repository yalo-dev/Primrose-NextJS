import React, { useEffect, useState } from "react";
import getMenuItems from "../../../../queries/getMenuItems";
import ScrollToTopButton from "../../molecules/ScrollToTopButton/ScrollToTopButton";
import Footer from "../../organisms/Footer/Footer";
import Header from "../../organisms/Header/Header";

interface LayoutSettings {
  headerMenu?: {
    menuItems?: {
      nodes?: any[];
    };
  };
  footerMenu?: {
    menuItems?: {
      nodes?: any[];
    };
  };
  siteSettings?: {
    siteSettings?: any;
  };
}

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  layoutSettings: LayoutSettings;
}

const INIT_SETTINGS: LayoutSettings = {
  headerMenu: {
    menuItems: {
      nodes: [],
    },
  },
  footerMenu: {
    menuItems: {
      nodes: [],
    },
  },
  siteSettings: {
    siteSettings: null,
  },
};

const fetchMenuItems = async (callback: (data: LayoutSettings) => void) => {
  const menuItems = await getMenuItems();
  callback(menuItems);
};

const Layout: React.FC<LayoutProps> = ({ children, layoutSettings }) => {
  const [settings, setSettings] = useState(layoutSettings);
  useEffect(() => {
    if (!layoutSettings) {
      fetchMenuItems(setSettings);
    }
  }, []);

  if (!settings) return;

  return (
    <div id="appContainer" className="app app--container">
      <Header menuItems={settings.headerMenu.menuItems.nodes} />
      <main className="main main--container">{children}</main>
      <Footer
        menuItems={settings.footerMenu.menuItems.nodes}
        siteSettings={settings.siteSettings.siteSettings}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
