import React from "react";
import ScrollToTopButton from "../../molecules/ScrollToTopButton/ScrollToTopButton";
import Footer from "../../organisms/Footer/Footer";
import Header from "../../organisms/Header/Header";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  layoutSettings: {
      headerMenu?: {
          menuItems?: {
              nodes?: any[]
          }
      }
      footerMenu?: {
          menuItems?: {
              nodes?: any[]
          }
      }
      siteSettings?: {
          siteSettings?: any
      }
  };
}

const Layout: React.FC<LayoutProps> = (
    {
        children,
        layoutSettings,
    }) => {
    return (
        <div id="appContainer" className="app app--container">
          <Header menuItems={layoutSettings.headerMenu.menuItems.nodes} />
          <main className="main main--container">{children}</main>
          <Footer menuItems={layoutSettings.footerMenu.menuItems.nodes} siteSettings={layoutSettings.siteSettings.siteSettings} />
          <ScrollToTopButton />
        </div>
    );
};

export default Layout;
