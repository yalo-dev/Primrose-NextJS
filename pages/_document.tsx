import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
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
          <Script
            dangerouslySetInnerHTML={{
              __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-MJKZ3SLB');
                            `,
            }}
            strategy={"lazyOnload"}
          />
          <Script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            data-domain-script="dcc6852c-83ad-4770-8fe8-5c1528352fce"
            strategy={"lazyOnload"}
          ></Script>
          <Script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                            function OptanonWrapper() { };
                            `,
            }}
            strategy={"lazyOnload"}
          />
          <Script
            src="https://cdn.optimizely.com/js/20299544930.js"
            strategy={"lazyOnload"}
          ></Script>
          <Script
            src="//js.hsforms.net/forms/embed/v2.js"
            strategy={"lazyOnload"}
          ></Script>
          <link
            href="//fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@200;400&family=Poppins:wght@300;400;500&display=swap"
            rel="stylesheet"
          />
          <Script
            id="hs-script-loader"
            src="//js.hs-scripts.com/22602766.js"
            strategy={"lazyOnload"}
          ></Script>
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="//www.googletagmanager.com/ns.html?id=GTM-MJKZ3SLB" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
            }}
          />
          <Script
            strategy={"lazyOnload"}
            id="custom-analytics"
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                            function crumbleCookie(a) {
                                for (
                                    var d = document.cookie.split(";"), c = {}, b = 0;
                                    b < d.length;
                                    b++
                                ) {
                                    var e = d[b].substring(0, d[b].indexOf("=")).trim(),
                                        i = d[b].substring(d[b].indexOf("=") + 1, d[b].length).trim();
                                    c[e] = i;
                                }
                                if (a) return c[a] ? c[a] : null;
                                return c;
                            }
                            
                            function bakeCookie(a, d, c, b, e, i) {
                                var j = new Date();
                                j.setTime(j.getTime());
                                c && (c *= 864e5);
                                j = new Date(j.getTime() + c);
                                document.cookie =
                                    a +
                                    "=" +
                                    escape(d) +
                                    (c ? ";expires=" + j.toGMTString() : "") +
                                    (b ? ";path=" + b : "") +
                                    (e ? ";domain=" + e : "") +
                                    (i ? ";secure" : "");
                            }
                            
                            function writeLogic(n) {
                                var a = getTrafficSource(n, ".primroseschools.com");
                                a = a.replace(/\\|{2,}/g, "|");
                                a = a.replace(/^\\|/, "");
                                a = unescape(a);
                            
                                bakeCookie(n, a, 7, "/", "", ""); // Cookie expiration sets to 182 days
                            }
                            
                            function getParam(s, q) {
                                try {
                                    var match = s.match("[?&]" + q + "=([^&]+)");
                                    return match ? match[1] : "";
                                } catch (e) {
                                    return "";
                                }
                            }
                            
                            function calculateTrafficSource() {
                                var source = "",
                                    medium = "",
                                    campaign = "",
                                    term = "",
                                    content = "";
                                var search_engines = [
                                    ["bing", "q"],
                                    ["google", "q"],
                                    ["yahoo", "q"],
                                    ["baidu", "q"],
                                    ["yandex", "q"],
                                    ["ask", "q"]
                                ];
                                var ref = document.referrer;
                                ref = ref.substr(ref.indexOf("//") + 2);
                                ref_domain = ref;
                                ref_path = "/";
                                ref_search = "";
                            
                                var url_search = document.location.search;
                                if (url_search.indexOf("utm_source") > -1) {
                                    source = getParam(url_search, "utm_source");
                                    medium = getParam(url_search, "utm_medium");
                                    campaign = getParam(url_search, "utm_campaign");
                                    term = getParam(url_search, "utm_term");
                                    content = getParam(url_search, "utm_content");
                                } else if (getParam(url_search, "gclid")) {
                                    source = "google";
                                    medium = "cpc";
                                    campaign = "(not set)";
                                } else if (ref) {
                                    // Separate domain, path, and query parameters
                                    if (ref.indexOf("/") > -1) {
                                        ref_domain = ref.substr(0, ref.indexOf("/"));
                                        ref_path = ref.substr(ref.indexOf("/"));
                                        if (ref_path.indexOf("?") > -1) {
                                            ref_search = ref_path.substr(ref_path.indexOf("?") + 1);
                                            ref_path = ref_path.substr(0, ref_path.indexOf("?"));
                                        }
                                    }
                                    medium = "referral";
                                    source = ref_domain;
                                    // Extract term for organic source
                                    for (var i = 0; i < search_engines.length; i++) {
                                        if (ref_domain.indexOf(search_engines[i][0]) > -1) {
                                            medium = "organic";
                                            source = search_engines[i][0];
                                            term =
                                                getParam(ref_search, search_engines[i][1]) ||
                                                "(not provided)";
                                            break;
                                        }
                                    }
                                }
                            
                                return {
                                    source: source,
                                    medium: medium,
                                    campaign: campaign,
                                    term: term,
                                    content: content
                                };
                            }
                            
                            function getTrafficSource(cookieName, hostname) {
                                var trafficSources = calculateTrafficSource();
                                var source =
                                    trafficSources.source.length === 0
                                        ? "direct"
                                        : trafficSources.source;
                                var medium =
                                    trafficSources.medium.length === 0 ? "None" : trafficSources.medium;
                                var campaign =
                                    trafficSources.campaign.length === 0
                                        ? ""
                                        : trafficSources.campaign;
                                if (medium === "referral") {
                                    campaign = "";
                                }
                                var rightNow = new Date();
                                var value =
                                    "source=" +
                                    source +
                                    "&medium=" +
                                    medium +
                                    "&campaign=" +
                                    campaign +
                                    "&term=" +
                                    trafficSources.term +
                                    "&content=" +
                                    trafficSources.content +
                                    "&date=" +
                                    rightNow
                                        .toISOString()
                                        .slice(0, 10)
                                        .replace(/-/g, "");
                                return value;
                            }
                            
                            (function() {
                                var date = new Date();
                                var fr_date =
                                    date.getUTCFullYear().toString() +
                                    (date.getUTCMonth() < 9
                                        ? "0" + (date.getUTCMonth() + 1).toString()
                                        : (date.getUTCMonth() + 1).toString()) +
                                    (date.getUTCDate() < 10
                                        ? "0" + date.getUTCDate().toString()
                                        : date.getUTCDate().toString());
                                var session = crumbleCookie()["UserSession"];
                                if (typeof session == "undefined") {
                                    writeLogic("UserSession");
                                } else {
                                    const trafficSource = calculateTrafficSource();
                                    if (
                                        trafficSource.source !== "" &&
                                        trafficSource.medium !== "" &&
                                        trafficSource.campaign !== "" &&
                                        trafficSource.content !== ""
                                    ) {
                                        writeLogic("UserSession");
                                    }
                                }
                            })();`,
            }}
          ></Script>
          {/*<DynamicComponentWithNoSSR />*/}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
