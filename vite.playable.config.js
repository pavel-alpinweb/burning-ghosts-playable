import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { minify } from "html-minifier-terser";
import path from "path";

const byteLength = (value) => new TextEncoder().encode(value).byteLength;

const formatSize = (bytes) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  return `${(bytes / 1_000).toFixed(2)} KB`;
};

const reportSingleFileSize = (html) => {
  const sizes = {
    HTML: byteLength(html),
    JavaScript: 0,
    Images: 0,
    Audio: 0,
  };
  const scriptPattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const dataUriPattern = /data:(image|audio)\/[a-z0-9.+-]+(?:;charset=[^,;"']+)?(?:;base64)?,(?:[a-z0-9+/=]+|[^\s"'`<]+)/gi;

  for (const scriptMatch of html.matchAll(scriptPattern)) {
    const script = scriptMatch[1];
    const scriptSize = byteLength(script);

    sizes.HTML -= scriptSize;
    sizes.JavaScript += scriptSize;

    for (const assetMatch of script.matchAll(dataUriPattern)) {
      const assetSize = byteLength(assetMatch[0]);
      const category = assetMatch[1].toLowerCase() === "image" ? "Images" : "Audio";

      sizes[category] += assetSize;
      sizes.JavaScript -= assetSize;
    }
  }

  const total = Object.values(sizes).reduce((sum, size) => sum + size, 0);
  const labelWidth = Math.max(...Object.keys(sizes).map((label) => label.length));

  console.log("\nPlayable bundle breakdown");
  for (const [label, size] of Object.entries(sizes)) {
    console.log(`${label.padEnd(labelWidth)}  ${formatSize(size)}`);
  }
  console.log("-".repeat(labelWidth + 11));
  console.log(`${"Total".padEnd(labelWidth)}  ${formatSize(total)}\n`);
};

const minifySingleFileHtml = () => ({
  name: "minify-single-file-html",
  enforce: "post",
  async generateBundle(_options, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === "asset" && asset.fileName.endsWith(".html")) {
        const html = await minify(asset.source.toString(), {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: {
            format: {
              comments: false,
            },
          },
          removeAttributeQuotes: true,
          removeComments: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
        });

        asset.source = html;
        reportSingleFileSize(html);
      }
    }
  },
});

export default defineConfig({
  root: path.resolve(__dirname, "./src/playable"),
  base: "./",
  define: {
    AD_NETWORK: JSON.stringify(process.env.AD_NETWORK || "generic"),
  },
  plugins: [viteSingleFile(), minifySingleFileHtml()],
  build: {
    outDir: path.resolve(__dirname, "./dist-playable"),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,

    cssCodeSplit: false,
    sourcemap: false,
  },
  resolve: {
    alias: {
      // eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
      "@public": path.resolve(__dirname, "./public"),
    },
  },
});
