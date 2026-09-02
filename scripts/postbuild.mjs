import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");

if (fs.existsSync(outDir)) {
  const indexPath = path.join(outDir, "index.html");
  const notFoundPath = path.join(outDir, "404.html");
  const noJekyllPath = path.join(outDir, ".nojekyll");

  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
  }
  fs.writeFileSync(noJekyllPath, "");
  console.log("GitHub Pages files ready in /out");
}
