import Image from 'next/image';
import Link from 'next/link';
import Button from '../../../../app/components/atoms/Button/Button';
import { useRouter } from 'next/router';
import ResourcesMenu from '../ResourcesMenu/ResourcesMenu';
import SchoolsMenu from '../SchoolsMenu/SchoolsMenu';

export default function Header({ menuItems }) {
    const router = useRouter();
    const showResourcesMenu = router.pathname.includes('/resources');
    const showSchoolsMenu = router.pathname.includes('/schools');

    return (
        <header className='header border-bottom'>
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
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarContent'
                        aria-controls='navbarContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse col-lg6' id='navbarContent'>
                        <ul className='navbar-nav'>
                            {menuItems && menuItems.map((item, index) => (
                                <li key={index} className='nav-item m-2'>
                                    <Link className='nav-link'
                                        href={item.url}
                                        aria-label={item.label} passHref>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className='navbar-search col-lg-4'>
                            <form className='d-flex' role='search'>
                                <label htmlFor='search' className='hidden'>Email Address</label>
                                <input className='form-control me-2' type='search' name='search' id='search' placeholder='Search' aria-label='Search' required />
                                <Button label='Search' variant='primary' type='submit' />
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
