import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const DEFAULTS = {
  maxEdge: 1600,
  quality: 80,
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDir, "..");

export function parseArgs(argv, cwd = process.cwd()) {
  const opts = {
    inputDir: resolve(cwd, "assets/images"),
    outputDir: resolve(cwd, "public/media"),
    manifestPath: resolve(cwd, "src/lib/image-manifest.json"),
    stampPath: resolve(cwd, "assets/.image-pipeline.json"),
    maxEdge: DEFAULTS.maxEdge,
    quality: DEFAULTS.quality,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value == null) throw new Error(`missing value for ${arg}`);
      return value;
    };
    if (arg === "--input") opts.inputDir = resolve(cwd, next());
    else if (arg === "--output") opts.outputDir = resolve(cwd, next());
    else if (arg === "--manifest") opts.manifestPath = resolve(cwd, next());
    else if (arg === "--stamp") opts.stampPath = resolve(cwd, next());
    else if (arg === "--max-edge") opts.maxEdge = Number(next());
    else if (arg === "--quality") opts.quality = Number(next());
    else throw new Error(`unexpected argument: ${arg}`);
  }
  if (!Number.isInteger(opts.maxEdge) || opts.maxEdge < 1) {
    throw new Error("--max-edge must be a positive integer");
  }
  if (!Number.isInteger(opts.quality) || opts.quality < 1 || opts.quality > 100) {
    throw new Error("--quality must be an integer from 1 to 100");
  }
  return opts;
}

function walk(dir) {
  const found = [];
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.isFile() && IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      found.push(full);
    }
  }
  return found;
}

export function outputName(sourcePath, inputDir) {
  const rel = relative(inputDir, sourcePath).split(sep).join("/");
  const ext = extname(rel);
  const stem = rel.slice(0, rel.length - ext.length);
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error(`cannot name output for ${sourcePath}`);
  return `${slug}.webp`;
}

function readStamp(stampPath) {
  if (!existsSync(stampPath)) return { files: {} };
  try {
    const parsed = JSON.parse(readFileSync(stampPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : { files: {} };
  } catch {
    return { files: {} };
  }
}

function publicUrl(name) {
  return `/media/${name.split(sep).join("/")}`;
}

export async function runPipeline(opts) {
  const sources = walk(opts.inputDir).sort();
  if (sources.length === 0) {
    throw new Error(`no images in ${opts.inputDir}`);
  }

  const planned = sources.map((source) => ({
    source,
    name: outputName(source, opts.inputDir),
  }));
  const seen = new Map();
  for (const item of planned) {
    if (seen.has(item.name)) {
      throw new Error(`output collision: ${seen.get(item.name)} and ${item.source} both write ${item.name}`);
    }
    seen.set(item.name, item.source);
  }

  mkdirSync(opts.outputDir, { recursive: true });
  const stamp = readStamp(opts.stampPath);
  const prev = stamp.files && typeof stamp.files === "object" ? stamp.files : {};
  const nextFiles = {};
  let written = 0;
  let skipped = 0;

  for (const item of planned) {
    const dest = join(opts.outputDir, item.name);
    const stat = statSync(item.source);
    const signature = {
      source: relative(workspaceRoot, item.source).split(sep).join("/"),
      mtimeMs: Math.trunc(stat.mtimeMs),
      size: stat.size,
      maxEdge: opts.maxEdge,
      quality: opts.quality,
    };
    const cached = prev[item.name];
    if (
      existsSync(dest) &&
      cached &&
      cached.mtimeMs === signature.mtimeMs &&
      cached.size === signature.size &&
      cached.maxEdge === signature.maxEdge &&
      cached.quality === signature.quality
    ) {
      skipped += 1;
      nextFiles[item.name] = signature;
      continue;
    }

    mkdirSync(dirname(dest), { recursive: true });
    const meta = await sharp(item.source).metadata();
    const fits =
      meta.format === "webp" &&
      (meta.width ?? opts.maxEdge + 1) <= opts.maxEdge &&
      (meta.height ?? opts.maxEdge + 1) <= opts.maxEdge;
    if (fits) {
      copyFileSync(item.source, dest);
    } else {
      const tmp = `${dest}.tmp`;
      await sharp(item.source)
        .rotate()
        .resize({
          width: opts.maxEdge,
          height: opts.maxEdge,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: opts.quality, effort: 4 })
        .toFile(tmp);
      renameSync(tmp, dest);
    }
    written += 1;
    nextFiles[item.name] = signature;
  }

  const names = planned.map((item) => item.name);
  const heroName = names.find((name) => name.replace(/\\/g, "/").split("/").pop() === "hero.webp");
  const images = [...names].sort((a, b) => {
    if (a === heroName) return -1;
    if (b === heroName) return 1;
    return a.localeCompare(b);
  });
  const manifest = {
    hero: heroName ? publicUrl(heroName) : publicUrl(images[0]),
    images: images.map(publicUrl),
  };

  mkdirSync(dirname(opts.manifestPath), { recursive: true });
  writeFileSync(opts.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  mkdirSync(dirname(opts.stampPath), { recursive: true });
  writeFileSync(
    opts.stampPath,
    `${JSON.stringify({ version: 1, maxEdge: opts.maxEdge, quality: opts.quality, files: nextFiles }, null, 2)}\n`,
  );

  const stale = existsSync(opts.outputDir)
    ? readdirSync(opts.outputDir).filter((name) => name.endsWith(".tmp"))
    : [];
  for (const name of stale) rmSync(join(opts.outputDir, name), { force: true });

  return { written, skipped, manifest };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  runPipeline(opts)
    .then(({ written, skipped, manifest }) => {
      console.log(
        `[images] ${written} written, ${skipped} unchanged, hero ${manifest.hero}`,
      );
    })
    .catch((error) => {
      console.error(`[images] ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
