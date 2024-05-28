// next.config.mjs

export default {
  async rewrites() {
    return [
      {
        source: '/panel/api/:path*',
        destination: 'http://localhost:8000/panel/api/:path*', // Proxy to Django backend
      },
    ];
  },
};