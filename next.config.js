/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
   },

}
const dotenv = require('dotenv');
dotenv.config();

module.exports = nextConfig
