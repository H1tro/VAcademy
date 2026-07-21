import type { OpenNextConfig } from "@opennextjs/cloudflare/types/open-next.js";

const config: OpenNextConfig = {
  default: {
    wrapper: "cloudflare-node",
    converter: "edge",
  },
};

export default config;
