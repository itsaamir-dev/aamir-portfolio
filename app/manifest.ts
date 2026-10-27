import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             SITE_NAME,
    short_name:       "Build With Aamir",
    description:      SITE_DESCRIPTION,
    start_url:        "/",
    display:          "standalone",
    background_color: "#FFFFFF",
    theme_color:      "#FFFFFF",
    icons: [
      { src: "/icon.png",       sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
