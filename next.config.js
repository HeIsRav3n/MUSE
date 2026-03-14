/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  // SWC minification is enabled by default in Next.js 13+

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; media-src 'self' https: blob:; frame-src 'self' https://connect.solflare.com https://*.solflare.com https://audius.co https://*.audius.co;"
          }
        ]
      }
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.audius.co',
      },
      {
        protocol: 'https',
        hostname: 'audius.co',
      },
      {
        protocol: 'https',
        hostname: 'blockdaemon-audius-discovery-**.bdnodes.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'validator.stuffisup.com',
      },
      {
        protocol: 'https',
        hostname: '**.audius.exists.rocks',
      },
      {
        protocol: 'https',
        hostname: '**.figment.io',
      },
      {
        protocol: 'https',
        hostname: '**.audiusindex.org',
      },
      {
        protocol: 'https',
        hostname: '**.bdnodes.net',
      },
      {
        protocol: 'https',
        hostname: '**.audius.co',
      },
      {
        protocol: 'https',
        hostname: 'audius.co',
      },
      {
        protocol: 'https',
        hostname: '**.rickyrombo.com',
      },
      {
        protocol: 'https',
        hostname: '**.monophonic.digital',
      },
      {
        protocol: 'https',
        hostname: '**.theblueprint.xyz',
      },
      {
        protocol: 'https',
        hostname: '**.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.network',
      },
      {
        protocol: 'https',
        hostname: '**.fm',
      },
      {
        protocol: 'https',
        hostname: '**.shakespearetech.com',
      },
      {
        protocol: 'https',
        hostname: 'shakespearetech.com',
      },
      {
        protocol: 'https',
        hostname: '**.audius-nodes.com',
      },
      {
        protocol: 'https',
        hostname: 'audius-nodes.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Optimize bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      buffer: false,
      util: false,
      url: false,
      assert: false,
      querystring: false,
      os: false,
      constants: false,
      timers: false,
      process: false,
      console: false,
      vm: false,
      child_process: false,
      cluster: false,
      dgram: false,
      dns: false,
    };

    return config;
  },

  // Experimental features
  experimental: {},

  // Transpile packages that use ESM or need build-time transpilation
  transpilePackages: ['recharts', 'framer-motion', 'lucide-react'],

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  // Compress static assets
  compress: true,

  // Enable static optimization
  staticPageGenerationTimeout: 60,

  // Turbopack configuration (empty config to silence error)
  turbopack: {},
};

module.exports = nextConfig;
