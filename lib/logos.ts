import fs from "node:fs";
import path from "node:path";

/** Server-only: the public path of a firm's logo (a file named <slug>.svg, .png, .jpg or .webp in public/logos), if one exists. */
export function logoPath(slug: string): string | undefined {
  const file = ["svg", "png", "jpg", "webp"].map((ext) => `${slug}.${ext}`).find((f) => fs.existsSync(path.join(process.cwd(), "public", "logos", f)));
  return file ? `/logos/${file}` : undefined;
}
