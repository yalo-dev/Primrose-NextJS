import Image from 'next/image';
import Link from 'next/link';

export default function Footer({ menuItems, siteSettings }) {
    const footerLogo = siteSettings?.logoFooter || '';
    const socialIcons = siteSettings?.socialIcons || [];
    const footerLinks = siteSettings?.footerLinks || [];
    const copyrightInfo = siteSettings?.copyrightInfo || '';

    return (
        <footer className='footer border-top pt-4 pb-2'>
            <div className='container'>
                <div className='row'>
                    <div className='logo text-center mt-2 mb-2 col-12 col-lg-2'>
                        <Link href='/' passHref>
                            <Image
                                src={footerLogo.sourceUrl || '/assets/logo.svg'}
                                alt={footerLogo.altText || 'Primrose Logo'}
                                width={75}
                                height={75}
                                className='d-inline-block mx-auto'
                                priority={true}
                            />
                        </Link>
                    </div>
                    <div className='nav col-12 col-lg-6'>
                        <ul className='pt-2 pb-2'>
                            {menuItems.map((item, index) => (
                                <li key={index} className='p-2'>
                                    <Link href={item.url} passHref>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='social col-12 col-lg-4 d-flex justify-content-center'>
                        {socialIcons && socialIcons.map((icon, index) => {
                            if (icon.icon && icon.icon.sourceUrl !== null &&
                                icon.icon.sourceUrl !== undefined &&
                                icon.icon.altText !== null &&
                                icon.icon.altText !== undefined) {
                                return (
                                    <Image
                                        key={index}
                                        src={icon.icon.sourceUrl}
                                        alt={icon.icon.altText || 'Social Icon'}
                                        width={24}
                                        height={24}
                                        className='p-1'
                                    />
                                );
                            } else {
                                console.log(`Missing data for icon at index ${index}`);
                                return null;
                            }
                        })}
                    </div>
                </div>
                <div className='row'>
                    <div className='copy col-12 text-center mt-2 mb-2'>
                        <div className='text col-12'>{copyrightInfo}</div>
                        <ul className='text col-12 d-flex justify-content-center'>
                            {footerLinks.map((link, index) => (
                                <li key={index} className='p-2 ps-3 pe-3'>
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
                    </div>
                </div>
            </div>
        </footer>
    );
}
