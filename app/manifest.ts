import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             SITE_NAME,
    short_name:       "Build With Aamir",
    description:      SITE_DESCRIPTION,
    start_url:        "/",
    display:          "standalone",
    background_color: "#0B0D10",
    theme_color:      "#0B0D10",
    icons: [
      { src: "/icon",       sizes: "64x64",   type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
