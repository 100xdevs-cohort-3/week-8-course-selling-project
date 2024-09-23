/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "appxcontent.kaxa.in",
      "appx-wsb-gcp-mcdn.akamai.net.in",
      "res.cloudinary.com",
    ], // Add your external domain here
  },
  env: {
    URL: process.env.URL,
  },
};

export default nextConfig;
