/** @type {import('next').NextConfig} */
const nextConfig = {
    // External packages for server components
    serverExternalPackages: ['@prisma/client', 'bcryptjs'],

    // Disable ESLint during build
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript errors during build
    typescript: {
        ignoreBuildErrors: true,
    },

    // Exclude src folder from Next.js (it's for Vite)
    pageExtensions: ['tsx', 'ts'],

    // Only use app directory for API routes
    experimental: {
        // Disable static generation for API-only project
    },

    // CORS headers for frontend
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                ],
            },
        ];
    },
};

export default nextConfig;
