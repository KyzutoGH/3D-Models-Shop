/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}
module.exports = {
    webpack: (config) => {
        config.externals = [...(config.externals || []), { canvas: 'canvas' }];
        return config;
    },
}
module.exports = {
    experimental: {
        middleware: true,
    },
}
module.exports = {
    images: {
        domains: ['www.flaticon.com'],
    },
}
module.exports = {
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/dashboard',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/admin',
                destination: '/admin/login',
            },
        ];
    },
};
module.exports = nextConfig
