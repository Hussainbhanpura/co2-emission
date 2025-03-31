const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to the main server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );

  // Proxy community service requests
  app.use(
    '/api/community',
    createProxyMiddleware({
      target: 'http://localhost:5002',
      changeOrigin: true,
      pathRewrite: {
        '^/api/community': '', // Remove /api/community prefix when forwarding to community service
      },
    })
  );

  // Add a fallback proxy for direct auth requests (without /api prefix)
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:5000/api',
      changeOrigin: true,
    })
  );
};
