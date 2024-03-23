async function getRedirects(){
  const response = await fetch(`https://www.primroseschools.com/api/redirects`);
  const data = await response.json();
  let _redirects = [];
  data.seo.redirects.map((redirect, index) =>{
    if(!redirect.origin.includes('http') && !redirect.origin.includes('www' ) && !redirect.origin.includes('?' )&& !redirect.target.includes('?') ){
      if(!redirect.target.includes('http')){
        redirect.target = "/" + redirect.target;
      }
      _redirects.push({
        source: `/${redirect.origin.replace('.*', ':slug')}`,
        destination: `${redirect.target.replace('.*', ':slug')}`,
        permanent: true,
      })
    }
  });
  return _redirects;
}
module.exports = {
  async redirects() {
    return getRedirects();
  },
  images: {
    dangerouslyAllowSVG: true,
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
