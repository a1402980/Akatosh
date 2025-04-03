/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./app', './components', './styles'],
  },
};

export default nextConfig;

