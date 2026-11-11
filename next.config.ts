import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // next/image로 Supabase Storage(판매글 사진)의 이미지를 보여줄 수 있게 허용
  // (허용하지 않은 외부 주소의 이미지는 next/image가 거부합니다)
  images: {
    remotePatterns: [
      new URL("https://letdzrbayptvdzowigdy.supabase.co/storage/v1/object/public/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
