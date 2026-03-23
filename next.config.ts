import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
{
        protocol:'https',
        hostname: `${process.env.S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com`,
        pathname:"/**"
      },
      {
        protocol:'https',
        hostname: `example.com`,
        pathname:"/**"
      }
    ]
  }
};


