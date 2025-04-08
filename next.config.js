/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'node-fetch': false,
        'whatwg-url': false,
        'fs': false,
        'net': false,
        'tls': false,
      }
    }
    return config
  },
}

module.exports = nextConfig 