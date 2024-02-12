import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <Script id="google-tag-manager" strategy="afterInteractive">
                        {`
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-MJKZ3SLB');
                        `}
                    </Script>
                    <Script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" data-domain-script="dcc6852c-83ad-4770-8fe8-5c1528352fce" strategy="afterInteractive"></Script>
                    <Script>
                        {`
                           function OptanonWrapper() { }
                        `}
                    </Script>
                    <Script src="https://cdn.optimizely.com/js/20299544930.js" strategy="afterInteractive"></Script>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                    <link
                        href="//fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@200;400&family=Poppins:wght@300;400;500&display=swap"
                        rel="stylesheet"
                    />
                    <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/22602766.js"></script>
                </Head>
                <body>
                    <noscript
                        dangerouslySetInnerHTML={{
                        __html: `<iframe src="//www.googletagmanager.com/ns.html?id=GTM-MJKZ3SLB" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
