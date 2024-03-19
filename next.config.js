async function getRedirects(){
  const response = await fetch(`https://temp.primroseschools.com/api/redirects`);
  const data = await response.json();
  let _redirects = [];
  data.seo.redirects.map((redirect, index) =>{
    _redirects.push({
      source: `/${redirect.origin.replace('.*', ':slug')}`,
      destination: `/${redirect.target.replace('.*', ':slug')}`,
      permanent: true,
    })
  });
  console.log(_redirects);
  return _redirects;
}
module.exports = {
  async redirects() {
    //let _redirects = await getRedirects();
    //console.log(_redirects);
    return getRedirects();
  },
  images: {
    dangerouslyAllowSVG: true,
    //domainPatterns: ['localhost', 'primroseschools.local', 'primrose-headless.local', 'primroseschool.wpengine.com', 'primroseschstg.wpenginepowered.com', 'primroseschdev.wpengine.com', 'settings.primroseschools.com', 'temp.primroseschools.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'settings.primroseschools.com',
        port: '',
        pathname: '/wp-content/**',
      },
    ],
  },

};
