/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'], // Ajoutez ici d'autres domaines si besoin
    formats: ['image/avif', 'image/webp'],
  },
  // Environnement pour les variables liées à l'environnement
  env: {
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;