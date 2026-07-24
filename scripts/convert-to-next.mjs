import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "TERELJI_SEVEN_STAR_3_IMAGES_RESTORED.html");
const source = fs.readFileSync(sourcePath, "utf8");

const styleMatch = source.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if (!styleMatch || !bodyMatch) {
  throw new Error("Could not find the style or body block in the source HTML.");
}

fs.mkdirSync(path.join(root, "app"), { recursive: true });
fs.mkdirSync(path.join(root, "public", "images"), { recursive: true });

let imageIndex = 0;
const imageNames = [];
const extractImages = (content) =>
  content.replace(
    /data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)/gi,
    (_, type, data) => {
    imageIndex += 1;
    const extension = type.toLowerCase() === "jpeg" ? "jpg" : type.toLowerCase();
    const fileName = `resort-${String(imageIndex).padStart(2, "0")}.${extension}`;
    fs.writeFileSync(path.join(root, "public", "images", fileName), Buffer.from(data, "base64"));
    imageNames.push(fileName);
    return `/images/${fileName}`;
    },
  );

const css = extractImages(styleMatch[1])
  .replace(
    "--font-serif: 'Playfair Display', serif; --font-sans: 'Noto Sans KR', sans-serif;",
    "--font-serif: var(--font-playfair-display), serif; --font-sans: var(--font-noto-sans-kr), sans-serif;",
  )
  // These three selectors are unused remnants whose temporary source URLs deny access.
  .replace(/^.*genspark\.ai.*(?:\r?\n|$)/gm, "");

let body = extractImages(bodyMatch[1])
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(
    /https:\/\/www\.genspark\.ai\/api\/files\/s\/puThCBmO(?=#)/g,
    "",
  )
  .trim();

const contentModule = `// Generated from the original static HTML by scripts/convert-to-next.mjs.
// Keep the source HTML as the design archive; edit React behavior in app/page.tsx.
export const pageContent = ${JSON.stringify(body)};
`;

fs.writeFileSync(path.join(root, "app", "page-content.ts"), contentModule);
fs.writeFileSync(path.join(root, "app", "globals.css"), `${css.trim()}\n`);

console.log(`Extracted ${imageNames.length} images:`);
console.log(imageNames.join("\n"));
