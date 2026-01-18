/** @type {import('next').NextConfig} */
const nextConfig = {
    // External packages for server components
    serverExternalPackages: ['@prisma/client', 'bcryptjs'],

    // Disable ESLint during build (we'll fix issues locally)
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript errors during build
    typescript: {
        ignoreBuildErrors: true,
    },

    // CORS headers for Vite frontend
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
