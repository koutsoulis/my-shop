// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // headers: async () => {
  //   return [
  //     {
  //       source: "/api/trpc",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, s-maxage=604800, max-age=604800",
  //         },
  //       ],
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;
