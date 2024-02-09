import Link from 'next/link';
import NewsletterForm from '../../molecules/NewsletterForm/NewsletterForm';
import Script from 'next/script';

export default function Footer({ menuItems, siteSettings }) {
    const footerLogo = siteSettings?.logoFooter || '';
    const socialIcons = siteSettings?.socialIcons || [];
    const footerLinks = siteSettings?.footerLinks || [];
    const copyrightInfo = siteSettings?.copyrightInfo || '';
    const disclaimer = siteSettings?.disclaimer || '';

    return (
        <footer className='footer'>
            <div className='container'>
            <div className='row'>
                <div className='logo mt-2 mb-2 col-12 col-lg-1'>
                    <Link href='/'>
                        <img
                            src={footerLogo.sourceUrl || '/assets/logo.svg'}
                            alt={footerLogo.altText || 'Primrose Logo'}
                            width={75}
                            height={75}
                            className='d-inline-block mx-auto'
                        />
                    </Link>
                </div>
                <div className='nav col-12 col-lg-4'>
                    <ul className='pt-2 pb-2'>
                        {menuItems.map((item, index) => (
                            <li key={index} className='pb-4'>
                                <Link href={item.url} passHref>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='wrap col-lg-4 col-xl-3'>
                    <div className='newsletter-form-wrapper'>
                        <h4 className='white'>Join our Newsletter</h4>
                        <NewsletterForm />
                    </div>
                    <div className='social col-12 col-lg-4 d-flex justify-content-between mt-4 mb-3 w-100'>
                    {socialIcons.map((icon, index) => {
                    if (icon.icon && icon.icon.sourceUrl && icon.link && icon.link.url) {
                        return (
                            <a key={index} href={icon.link.url} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={icon.icon.sourceUrl}
                                    alt={icon.icon.altText || 'Social Icon'}
                                    width={40}
                                    height={40}
                                />
                            </a>
                        );
                    } else {
                        console.log(`Missing data for icon at index ${index}`);
                        return null;
                    }
                })}
                    </div>
                </div>

                <ul className='util-menu col-12 col-lg-3 col-xl-4 d-flex justify-content-start'>
                    {footerLinks.map((link, index) => (
                        <li key={index} className='p-2 ps-0'>
                            {link.link && link.link.url ? (
                                <Link href={link.link.url} target={link.link.target} passHref>
                                    {link.link.title}
                                </Link>
                            ) : (
                                <span>Error: Missing {index}</span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className='bottom col-12 col-lg-6 text-left mt-4 order-5'>
                    <button id="ot-sdk-btn" className="ot-sdk-show-settings mb-4">Cookie Settings</button>
                    <div className='text col-12' dangerouslySetInnerHTML={{ __html: copyrightInfo }}></div>
                    <div className='disclaimer col-12' dangerouslySetInnerHTML={{ __html: disclaimer }}></div>
                </div>
            </div>
            </div>
        </footer>
    );
}
