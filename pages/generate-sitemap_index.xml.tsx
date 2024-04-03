
export default function() {
}

export async function getServerSideProps({req, res}) {
    const host = req.headers.host
    const proto = req.headers['x-forwarded-proto']
    const url = `${proto}://${host}`
    const datetime = new Date().toISOString().split('T')[0]
    const sitemap = `
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <sitemap>
                <loc>${url}/page-sitemap.xml</loc>
                <lastmod>${datetime}</lastmod>
                </sitemap>
                <sitemap>
                <loc>${url}/schools-sitemap.xml</loc>
                <lastmod>${datetime}</lastmod>
                </sitemap>
                <sitemap>
                <loc>${url}/resources-sitemap.xml</loc>
                <lastmod>${datetime}</lastmod>
                </sitemap>
                <sitemap>
                <loc>${url}/market-sitemap.xml</loc>
                <lastmod>${datetime}</lastmod>
            </sitemap>
        </sitemapindex>
    `

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {props: {}}
}