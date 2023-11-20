import Image from "next/legacy/image";
import Link from 'next/link';
import Button from '../../../../app/components/atoms/Button/Button';
import { useRouter } from 'next/router';
import ResourcesMenu from '../ResourcesMenu/ResourcesMenu';
import SchoolsMenu from '../SchoolsMenu/SchoolsMenu';
import { useState } from "react";

export default function Header({ menuItems }) {
    const router = useRouter();
    const showResourcesMenu = router.pathname.includes('/resources');
    const showSchoolsMenu = router.pathname.includes('/schools');
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    const renderMenuItem = (item) => {
        const hasChildren = item.childItems && item.childItems.nodes.length > 0;
    
        return (
            <li key={item.id} className={`nav-item ${hasChildren ? 'has-children' : ''}`}>
                <Link href={item.url}  className='nav-link' passHref>
                    {item.label}
                </Link>
                {hasChildren && (
                    <ul className="submenu">
                        {item.childItems.nodes.map(childItem => (
                            <li key={childItem.id} className='nav-subitem'>
                                <Link  className='nav-link' href={childItem.url} passHref>
                                    {childItem.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    };
    

    
    return (
        <header className='header'>
            <title>Primrose Schools</title>
            <nav className='navbar navbar-expand-lg fixed-top'>
            <div className='container'>
                    <div className='navbar-logo m-2 ms-lg-0 col-lg-2'>
                        <Link
                            href='/' passHref>
                            <Image
                                src='/assets/logo.svg'
                                alt='Description'
                                width={250}
                                height={75}
                                className='d-inline-block align-text-top navbar-logo'
                                priority={true}
                            />
                        </Link>
                    </div>
                    <button
                        className='navbar-toggler'
                        type='button'
                        onClick={toggleNav}
                        aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    </div>
                    <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id='navbarContent'>
                    <div className='container'>
                        <ul className='navbar-nav'>
                        
                        {menuItems && menuItems.filter(item => !item.parentId).map(renderMenuItem)}

                            
                        </ul>
                        <div className='navbar-search col-lg-4'>
                            <form className='d-flex' role='search'>
                                <label htmlFor='search' className='hidden'>Search</label>
                                <div className='search-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z" fill="#5E6738"/>
                                </svg>
                                </div>
                                <input className='form-control me-2' type='search' name='search' id='search' placeholder='Search...' aria-label='Search' required />
                                <div className='clear-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="10" fill="#D2D3D1"/>
                                <path d="M12.1211 7.87866L7.87845 12.1213" stroke="#5E6738"/>
                                <path d="M7.87891 7.87866L12.1215 12.1213" stroke="#5E6738"/>
                                </svg>
                                </div>
                                <Button label='Find a school' variant='secondary' type='submit' />
                                <div className='location-icon'>
                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="50" height="50" rx="25" fill="white"/>
                                    <path d="M26.977 32.7854C26.7624 33.482 25.7807 33.4941 25.5491 32.8029L23.5341 26.7889C23.2268 25.8719 22.3678 25.2538 21.4006 25.2538H15.7378C14.9656 25.2538 14.6974 24.2276 15.3708 23.8497L31.0947 15.0254C31.6853 14.694 32.3779 15.2531 32.1785 15.9002L26.977 32.7854Z" stroke="#5E6738" strokeWidth="1.5"/>
                                    </svg>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
            </nav>
            { showResourcesMenu && <ResourcesMenu /> }
            { showSchoolsMenu && <SchoolsMenu /> }
        </header>
    )
}
