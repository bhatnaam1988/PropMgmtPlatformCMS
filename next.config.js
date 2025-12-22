const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Keep unoptimized since Filestack handles transformations
    // Using Filestack's built-in CDN transformations for property images
    // This avoids Next.js server-side processing delay on first request
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.filestackcontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  experimental: {
    // Remove if not using Server Components
    serverComponentsExternalPackages: ['mongodb'],
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    // Get allowed origins from environment, default to production URL
    const allowedOrigins = process.env.CORS_ORIGINS || process.env.NEXT_PUBLIC_BASE_URL || 'https://secure-forms-2.preview.emergentagent.com';
    const originList = allowedOrigins.split(',').map(origin => origin.trim());
    
    return [
      {
        source: "/(.*)",
        headers: [
          // CORS - Restrict to specific origins
          { 
            key: "Access-Control-Allow-Origin", 
            value: originList[0] // Primary domain
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "GET, POST, PUT, DELETE, OPTIONS" 
          },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "Content-Type, Authorization" 
          },
          
          // Security Headers
          { 
            key: "Strict-Transport-Security", 
            value: "max-age=31536000; includeSubDomains" 
          },
          { 
            key: "X-Frame-Options", 
            value: "SAMEORIGIN" 
          },
          { 
            key: "X-Content-Type-Options", 
            value: "nosniff" 
          },
          { 
            key: "X-XSS-Protection", 
            value: "1; mode=block" 
          },
          { 
            key: "Referrer-Policy", 
            value: "strict-origin-when-cross-origin" 
          },
          { 
            key: "Permissions-Policy", 
            value: "camera=(), microphone=(), geolocation=()" 
          },
          { 
            key: "Content-Security-Policy", 
            value: "frame-ancestors 'self';" 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
