/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: true,  
  swcMinify: true,
  serverRuntimeConfig: {
    generatorDataPath: "./lib/generator/data"
  },
}

module.exports = nextConfig
