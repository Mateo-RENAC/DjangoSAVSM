// next.config.js

module.exports = {
  async rewrites() {
    return [
      {
        source: '/panel/api/:path*',
        destination: 'http://localhost:8000/panel/api/:path*',
      },
    ];
  },
};
