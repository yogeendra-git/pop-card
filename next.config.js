/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js Server Actions default to a 1MB request body limit. The
  // certificate/achievement/avatar photo uploads (see src/lib/actions.ts)
  // accept files up to 5MB, so without this override any photo over ~1MB
  // is rejected with a "Body exceeded limit" error.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
}

module.exports = nextConfig