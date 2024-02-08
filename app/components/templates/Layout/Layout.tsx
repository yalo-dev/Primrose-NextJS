import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import ScrollToTopButton from '../../molecules/ScrollToTopButton/ScrollToTopButton';

interface LayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
    menuItems: any[];
    footerMenuItems: any[];
    siteSettings: any;
}

const Layout: React.FC<LayoutProps> = ({ children, menuItems, footerMenuItems, siteSettings }) => {
    return (
        <div id='appContainer' className='app app--container'>
            <Header menuItems={menuItems} />
            <main className='main main--container'>
                {children}
            </main>
            <Footer menuItems={footerMenuItems} siteSettings={siteSettings} />
            <ScrollToTopButton />
        </div>
    );
}

export default Layout;
