module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['localhost', 'primroseschools.local', 'primrose-headless.local', 'primroseschool.wpengine.com', 'primroseschstg.wpenginepowered.com', 'primroseschdev.wpengine.com', 'settings.primroseschools.com', 'temp.primroseschools.com'],
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
