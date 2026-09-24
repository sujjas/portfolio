import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode double-mounts every client component in dev. Combined with
  // @react-three/fiber + Rapier on /about, that tears down and recreates the
  // WebGL context within ~1 frame and the scene never paints. Production
  // builds don't double-mount, so this is dev-ergonomics only.
  reactStrictMode: false,

  // The Sena flagship embed is a prerendered SvelteKit build living in
  // /public/design/sena-live. Its router expects extensionless paths under
  // the base (/design/sena-live/home), but Next serves public files only at
  // their exact filename. This rewrite maps the extensionless request onto
  // the .html file, so a direct load and the app's own client-side
  // navigation both resolve. The dot-free matcher leaves real asset
  // requests (/_app/*.js, *.css, *.png) untouched.
  async rewrites() {
    return [
      {
        source: "/design/sena-live/:page([^.]+)",
        destination: "/design/sena-live/:page.html",
      },
    ];
  },
};

export default nextConfig;
