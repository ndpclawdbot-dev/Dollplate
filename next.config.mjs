/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow @react-pdf/renderer and other packages that use canvas/native modules
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
}

export default nextConfig
