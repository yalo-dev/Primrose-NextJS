import Link from 'next/link';
import Button from '../../../../app/components/atoms/Button/Button';
import { useRouter } from 'next/router';
import ResourcesMenu from '../ResourcesMenu/ResourcesMenu';
import SchoolsMenu from '../SchoolsMenu/SchoolsMenu';
import { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import React from 'react';

const GET_TRENDING_SEARCH_ITEMS = gql`
  query GetTrendingSearchItems {
    siteSettings {
      siteSettings {
        trendingSearches {
          searchItem {
            target
            title
            url
          }
        }
      }
    }
  }
`;

export default function Header({ menuItems }) {
    const router = useRouter();
    const showResourcesMenu = router.pathname.includes('/resources');
    const showSchoolsMenu = router.pathname.includes('/schools');
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isDesktopSearchActive, setIsDesktopSearchActive] = useState(false);
    const desktopSearchBarRef = useRef<HTMLDivElement>(null);
    const { data, loading, error } = useQuery(GET_TRENDING_SEARCH_ITEMS);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    const desktopSearchInputRef = useRef<HTMLInputElement>(null);


    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const toggleDesktopSearch = () => {
        setIsDesktopSearchActive(!isDesktopSearchActive);
        // Focus on the desktop search input when it becomes active
        if (!isDesktopSearchActive) {
            setTimeout(() => desktopSearchInputRef.current?.focus(), 0);
        }
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
        // Focus on the mobile search input when it becomes active
        if (!isSearchActive) {
            setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
        }
    };

    const toggleSubmenu = (key) => {
        if (activeSubmenu === key) {
            setActiveSubmenu(null);
        } else {
            setActiveSubmenu(key);
        }
    };

    const closeSubmenu = () => {
        setActiveSubmenu(null);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const clearInput = () => {
        setInputText('');
    };

    const resetNav = () => {
        setActiveSubmenu(null);
        setIsNavOpen(false);
        setIsSearchActive(false);
        setIsDesktopSearchActive(false);
        setInputText('');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (inputText.trim()) {
            console.log(`Searching for: ${inputText.trim()}`); // Debugging log
            window.location.href=(`/search?query=${encodeURIComponent(inputText.trim())}`);
            resetNav();
        } else {
            console.log("Empty search query"); // Debugging log
        }
    };
    

    const renderMenuItem = (item, index) => {
        const hasChildren = item.childItems && item.childItems.nodes.length > 0;

        const twoColumns = item.childItems && item.childItems.nodes.length > 4;

        const threeColumns = item.childItems && item.childItems.nodes.length > 8;

        const key = `${item.label}-${item.url}-${item.parentId || 'root'}-${index}`;

        const isSubmenuActive = activeSubmenu === key;

        return (
            <li key={key} className={`nav-item ${hasChildren ? 'has-children' : ''} ${item.cssClasses}`}>
                <Link className='parent-item nav-link d-none d-lg-flex' href={item.url} passHref>
                    {item.label}
                </Link>
                <div className='parent-item nav-link d-flex d-lg-none justify-content-between' onClick={() => toggleSubmenu(key)}>
                    {item.label}
                    <span className="arrow pe-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="white" />
                        </svg>
                    </span>
                </div> 
                {hasChildren && (
                    <div className={`submenu ${isSubmenuActive ? 'show' : ''}`}>
                        <div className={`container`}>
                            <div className={`submenu-parent-link d-none d-lg-block`}>
                                <Link className='parent-item nav-link d-none d-lg-flex' href={item.url} passHref>
                                    <h3>
                                        {item.label}
                                        <span className='icon ps-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="#555F68" />
                                        </svg>
                                    </span>
                                    </h3>
                                    
                                </Link>
                            </div>
                            
                            <ul className={`${twoColumns ? 'double-column' : ''} ${threeColumns ? 'triple-column' : ''}`}>
                                <div className="back" onClick={closeSubmenu}>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.34278 9.48477C5.6479 9.23335 5.68913 8.78495 5.43486 8.48324L2.23987 4.69213L5.41452 1.23907C5.68169 0.94847 5.66003 0.498731 5.36615 0.234549C5.07226 -0.0296345 4.61743 -0.0082178 4.35026 0.282382L1.17561 3.73545C0.692786 4.26061 0.675427 5.05738 1.13493 5.60261L4.32992 9.39373C4.58419 9.69543 5.03766 9.7362 5.34278 9.48477Z" fill="#5E6738" />
                                        </svg>
                                    </button>
                                    <span>
                                        Back
                                    </span>
                                </div>
                                <div className="parent">
                                    <Link onClick={resetNav} className='nav-link w-100' href={item.url} passHref>
                                        <h2 className="w-100 d-flex">
                                            <span>{item.label}</span>
                                            <span className="arrow ms-4 me-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="#5e6738" />
                                                </svg>
                                            </span>
                                        </h2>
                                    </Link>
                                </div>
                                {item.childItems.nodes.map((childItem, childIndex) => (
                                    <li key={`child-${childItem.label}-${childItem.url}-${childIndex}`} className={`${childItem.cssClasses} nav-item`}>
                                        <Link onClick={resetNav} className='nav-link' href={childItem.url} passHref>
                                            <span className="b4">{childItem.label}</span>
                                        </Link>
                                        {childItem.label === 'Open a School' && (
                                            <Link onClick={resetNav} className='nav-link child-sub' href="/path-to-opening" passHref>
                                                <span className="b4">- Path to Opening</span>
                                            </Link>   
                                        )}
                                    </li>
                                ))}
                            </ul>
                    </div>
                </div>
                )}
            </li>
        );
    };


    useEffect(() => {
        // Set the position of the submenu to the left edge of viewport
        const positionSubmenu = () => { 
            let currentSubmenuPos = document.querySelector('.nav-wrapper').getBoundingClientRect();
            Array.from(document.getElementsByClassName('submenu') as HTMLCollectionOf<HTMLElement>).forEach((el) => {
                el.style.left = `-${currentSubmenuPos.x}px`;
            });
        };
        positionSubmenu();
        document.querySelector('.navbar-nav').addEventListener('mouseover', function (e) {
            positionSubmenu();
        });


        const handleClickOutside = (event) => {
            if (desktopSearchBarRef.current && !desktopSearchBarRef.current.contains(event.target)) {
                setIsDesktopSearchActive(false);
            }
        };

        // Attach the listener
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            // Clean up the listener when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    return (
        <header className='header'>
            <title>Primrose Schools</title>

            <nav className='navbar navbar-expand-lg fixed-top'>
                <div className='container ps-0 pe-0'>

                    <div className='navbar-logo-wrapper'>
                        <Link
                            href='/' passHref>
                            <img
                                src='/assets/logo.svg'
                                alt='Description'
                                width={250}
                                height={75}
                                className='d-inline-block align-text-top navbar-logo'
                            />
                        </Link>
                    </div>
                    <button
                        className='navbar-toggler'
                        type='button'
                        onClick={toggleNav}
                        aria-label='Toggle navigation'>
                        <span className={`navbar-toggler-icon ${isNavOpen ? 'open' : ''}`}>
                            <span className="bar bar1"></span>
                            <span className="bar bar2"></span>
                            <span className="bar bar3"></span>
                        </span>
                    </button>

                    <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id='navbarContent'>
                        <div className='container p-0 h-100'>
                            <div className='nav-wrapper d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between align-items-lg-center h-100'>
                                <ul className='navbar-nav order-2 order-lg-1'>
                                    {menuItems && menuItems
                                        .filter(item => !item.parentId)
                                        .map((item, index) => renderMenuItem(item, index))
                                    }
                                </ul>
                                <div className={`navbar-search mt-4 mt-lg-0 pb-4 pb-lg-0 order-1 order-lg-2 ${isSearchActive ? 'active' : ''}`}>
                                    <form className='d-flex' role='search' onSubmit={handleSearchSubmit}>
                                        <label htmlFor='search' className='hidden'>Search</label>
                                        <div className='search-icon d-lg-none d-flex' onClick={() => { console.log('Search icon clicked'); toggleSearch(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z" fill="#5E6738" />
                                            </svg>
                                        </div>
                                        <div className={`search-icon desktop  d-none d-lg-flex ${isDesktopSearchActive ? 'active' : ''}`} onClick={toggleDesktopSearch}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z" fill="#5E6738" />
                                            </svg>
                                        </div>
                                        <input
                                            className='form-control'
                                            type='search'
                                            name='search'
                                            id='search'
                                            placeholder='Search...'
                                            aria-label='Search'
                                            required
                                            value={inputText}
                                            onChange={handleInputChange}
                                            ref={mobileSearchInputRef} 
                                        />
                                        <button type="submit" hidden>Search</button>
                                        <div
                                            className={`clear-icon ${inputText ? 'show' : ''}`}
                                            onClick={clearInput}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="10" fill="#D2D3D1" />
                                                <path d="M12.1211 7.87866L7.87845 12.1213" stroke="#5E6738" />
                                                <path d="M7.87891 7.87866L12.1215 12.1213" stroke="#5E6738" />
                                            </svg>
                                        </div>
                                        <div className='find-a-school-button'>
                                            <span className="find-button"><Button onClick={resetNav} label='Find A School' variant='secondary' href='/find-a-school' /></span>
                                            <div className='location-icon'>
                                                <a href='/find-a-school'>
                                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="50" height="50" rx="25" fill="white" />
                                                        <path d="M26.977 32.7854C26.7624 33.482 25.7807 33.4941 25.5491 32.8029L23.5341 26.7889C23.2268 25.8719 22.3678 25.2538 21.4006 25.2538H15.7378C14.9656 25.2538 14.6974 24.2276 15.3708 23.8497L31.0947 15.0254C31.6853 14.694 32.3779 15.2531 32.1785 15.9002L26.977 32.7854Z" stroke="#5E6738" strokeWidth="1.5" />
                                                    </svg>
                                                </a>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={desktopSearchBarRef} className={`desktop-search-bar ${isDesktopSearchActive ? 'show' : ''}`}>
                    <form role='search' onSubmit={handleSearchSubmit}>
                        <div className="container position-relative">
                     
                        <div className='search-icon desktop d-none d-lg-flex' onClick={() => { 
                            console.log('Desktop Search icon clicked'); 
                            toggleDesktopSearch(); 
                        }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z" fill="white" />
                                </svg>
                            </div>
                            <input
                                className='form-control'
                                type='search'
                                name='search'
                                id='desktop-search'
                                placeholder=''
                                aria-label='Search'
                                required
                                value={inputText}
                                onChange={handleInputChange}
                                ref={desktopSearchInputRef}
                            />
                            <button type="submit" hidden>Search</button>
                            <div className={`clear-icon ${inputText ? 'show' : ''}`} onClick={clearInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <circle cx="15" cy="14.8492" r="9.75" transform="rotate(45 15 14.8492)" stroke="#E6E6E6" strokeWidth="1.5" />
                                    <rect x="17.7266" y="11.2129" width="1.28571" height="9" transform="rotate(45 17.7266 11.2129)" fill="#E6E6E6" />
                                    <rect x="11.3633" y="12.1218" width="1.28571" height="9" transform="rotate(-45 11.3633 12.1218)" fill="#E6E6E6" />
                                </svg>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </nav>
            {showResourcesMenu && <ResourcesMenu />}
            {showSchoolsMenu && <SchoolsMenu />}
        </header>
    )
}
