import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode double-mounts every client component in dev. Combined with
  // @react-three/fiber + Rapier on /about, that tears down and recreates the
  // WebGL context within ~1 frame and the scene never paints. Production
  // builds don't double-mount, so this is dev-ergonomics only.
  reactStrictMode: false,
};

export default nextConfig;
