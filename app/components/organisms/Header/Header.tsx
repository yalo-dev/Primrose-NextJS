import Link from 'next/link';
import Button from '../../../../app/components/atoms/Button/Button';
import { useRouter } from 'next/router';
import ResourcesMenu from '../ResourcesMenu/ResourcesMenu';
import SchoolsMenu from '../SchoolsMenu/SchoolsMenu';
import { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import React from 'react';

export default function Header({ menuItems }) {
    const router = useRouter();
    const showResourcesMenu = router.pathname.includes('/stories-resources');
    const showSchoolsMenu = router.pathname.includes('/schools');
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isDesktopSearchActive, setIsDesktopSearchActive] = useState(false);
    const desktopSearchBarRef = useRef<HTMLDivElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    const desktopSearchInputRef = useRef<HTMLInputElement>(null);
    const [submenuStyles, setSubmenuStyles] = useState(null);

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
        if (window.innerWidth >= 992) {
            setSubmenuStyles({
                opacity: 0,
                pointerEvents: 'none'
            });
    
            setTimeout(() => {
                setSubmenuStyles(null);
                setActiveSubmenu(null);
            }, 1000);
        } else {
            setActiveSubmenu(null);
        }
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

    const handleCloseAndReset = () => {
        closeSubmenu();
        resetNav();
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
                <Link className='parent-item nav-link d-none d-lg-flex' href={item.url} passHref onClick={handleCloseAndReset}>
                    {item.label}
                </Link>
                <div className='parent-item nav-link d-flex d-lg-none justify-content-between align-items-center' onClick={() => toggleSubmenu(key)}>
                    {item.label}
                    <span className="arrow px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.323475 11.794C-0.0579244 11.4797 -0.109455 10.9192 0.208378 10.542L4.20212 5.80315L0.233801 1.48682C-0.100162 1.12357 -0.0730885 0.561399 0.29427 0.231171C0.661629 -0.0990572 1.23016 -0.0722866 1.56413 0.290963L5.53244 4.60729C6.13597 5.26375 6.15767 6.25971 5.58329 6.94125L1.58955 11.6801C1.27172 12.0573 0.704875 12.1082 0.323475 11.794Z" fill="white" />
                        </svg>
                    </span>
                </div> 
                {hasChildren && (
                    <div className={`submenu ${isSubmenuActive ? 'show' : ''}`} style={submenuStyles || undefined}>
                        <div className={`container`}>
                            <div className={`submenu-parent-link d-none d-lg-block`}>
                                <Link className='parent-item nav-link d-none d-lg-flex' href={item.url} passHref onClick={handleCloseAndReset}>
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
                                        Back to Main Menu
                                    </span>
                                </div>
                                <div className="parent">
                                    <Link onClick={handleCloseAndReset} className='nav-link w-100' href={item.url} passHref>
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
                                        <Link  className='nav-link' href={childItem.url} passHref onClick={handleCloseAndReset}>
                                            <span className="b4">{childItem.label}</span>
                                        </Link>
                                        {/* {childItem.label === 'Open a School' && (
                                            <Link onClick={closeSubmenu} className='nav-link child-sub' href="/path-to-opening" passHref>
                                                <span className="b4">Path to Opening</span>
                                            </Link>   
                                        )} */}
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
            if (mobileSearchInputRef.current && !mobileSearchInputRef.current.contains(event.target)) {
                setIsSearchActive(false);
            }
        };

        document.querySelector('.mobile-location-icon').addEventListener('mousedown', function (e) {
            if (window.innerWidth <= 991) {
                resetNav();
                window.location.href = "/find-a-school";
            }
        });

        document.querySelector('.clear-icon').addEventListener('mousedown', function (e) {
            e.stopPropagation();
            clearInput();
        });
        const searchIcon = document.querySelector('.search-icon');
        const searchForm = document.querySelector('.search-form') as HTMLFormElement;
        searchIcon.addEventListener('mousedown', function (e) {
            if (window.innerWidth <= 991) {
                if (searchIcon.classList.contains('active')) { 
                    // submit the form on click of the search icon
                    searchForm.submit();
                }
            }
        });

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

            <nav className={`navbar navbar-expand-lg fixed-top ${isDesktopSearchActive ? 'show' : ''}`}>
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
                                    <form className='search-form d-flex flex-row' role='search' onSubmit={handleSearchSubmit}>
                                        <label htmlFor='search' className='hidden'>Search</label>               
                                        <input
                                            className={`form-control ${isSearchActive ? 'active' : ''}`}
                                            type='search'
                                            name='search'
                                            id='search'
                                            placeholder='Search'
                                            aria-label='Search'
                                            required
                                            value={inputText}
                                            onChange={handleInputChange}
                                            ref={mobileSearchInputRef}
                                            enterKeyHint={"search"}
                                        />
                                        <button type="submit" hidden>Search</button>
                                        <div
                                            className={`search-inner-icon ${isSearchActive ? 'active' : ''} ${inputText ? 'hide' : ''}`}
                                            onClick={clearInput}>
                                            <img src="data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z' fill='%235E6738'/%3E%3C/svg%3E" />
                                        </div>
                                        <div
                                            className={`clear-icon ${inputText ? 'show' : ''}`}
                                            onClick={clearInput}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="10" fill="#D2D3D1" />
                                                <path d="M12.1211 7.87866L7.87845 12.1213" stroke="#5E6738" />
                                                <path d="M7.87891 7.87866L12.1215 12.1213" stroke="#5E6738" />
                                            </svg>
                                        </div>
                                        <div className={`search-icon ${isSearchActive ? 'active' : ''}`} onClick={() => { clearInput(); toggleSearch(); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8947 7.81579C13.8947 11.1731 11.1731 13.8947 7.81579 13.8947C4.45848 13.8947 1.73684 11.1731 1.73684 7.81579C1.73684 4.45848 4.45848 1.73684 7.81579 1.73684C11.1731 1.73684 13.8947 4.45848 13.8947 7.81579ZM12.8913 13.7595C11.5257 14.9267 9.75308 15.6316 7.81579 15.6316C3.49925 15.6316 0 12.1323 0 7.81579C0 3.49925 3.49925 0 7.81579 0C12.1323 0 15.6316 3.49925 15.6316 7.81579C15.6316 9.56904 15.0543 11.1875 14.0794 12.4913L17.7284 16.1403L16.5003 17.3685L12.8913 13.7595Z" fill="#5E6738" />
                                            </svg>
                                        </div>
                                        <div className={`find-a-school-button ${isSearchActive ? 'active' : ''}`}>
                                            <span className="find-button"><Button onClick={resetNav} label='Find A School' variant='secondary' href='/find-a-school' /></span>
                                        </div>
                                        <a href="/find-a-school" className={`mobile-location-icon ${isSearchActive ? 'active' : ''}`} >
                                            <div>
                                                <svg width="24" height="29" viewBox="0 0 24 29" fill="#5E6738" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.05063 4.20281C-0.167919 8.47353 -0.167919 15.4082 4.05063 19.6786L11.6936 27.4167L19.3365 19.6786C23.555 15.4082 23.555 8.47353 19.3365 4.20281C15.1185 -0.0676034 8.26862 -0.0676034 4.05063 4.20281ZM11.8376 16.5565C14.384 16.5565 16.4485 14.4539 16.4485 11.8602C16.4485 9.26653 14.384 7.16391 11.8376 7.16391C9.29132 7.16391 7.22679 9.26653 7.22679 11.8602C7.22679 14.4539 9.29132 16.5565 11.8376 16.5565Z" ></path></svg>
                                            </div>
                                        </a>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>     
            </nav>
            {showResourcesMenu && <ResourcesMenu />}
            {showSchoolsMenu && <SchoolsMenu />}
        </header>
    )
}
