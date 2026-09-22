import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import sharp from "sharp";
import { outputName, parseArgs, runPipeline } from "./optimize-images.mjs";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

test("parseArgs rejects a bad quality", () => {
  assert.throws(() => parseArgs(["--quality", "0"]), /--quality/);
});

test("outputName slugs spaces and keeps folders", () => {
  assert.equal(outputName("/src/hero.JPG", "/src"), "hero.webp");
  assert.equal(outputName("/src/sets/Night Out.png", "/src"), "sets/night-out.webp");
});

test("pipeline writes webp, manifest, and skips a second run", async () => {
  const root = mkdtempSync(join(tmpdir(), "images-"));
  const input = join(root, "in");
  const output = join(root, "out");
  const manifestPath = join(root, "manifest.json");
  const stampPath = join(root, "stamp.json");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(join(input, "sets"), { recursive: true });
  writeFileSync(join(input, "hero.png"), PNG);
  writeFileSync(join(input, "sets", "extra.png"), PNG);

  const opts = {
    inputDir: input,
    outputDir: output,
    manifestPath,
    stampPath,
    maxEdge: 64,
    quality: 60,
  };
  const first = await runPipeline(opts);
  assert.equal(first.written, 2);
  assert.equal(first.manifest.hero, "/media/hero.webp");
  assert.deepEqual(first.manifest.images, ["/media/hero.webp", "/media/sets/extra.webp"]);
  const heroStat = statSync(join(output, "hero.webp"));
  assert.ok(heroStat.size > 0);

  const second = await runPipeline(opts);
  assert.equal(second.written, 0);
  assert.equal(second.skipped, 2);
  assert.equal(statSync(join(output, "hero.webp")).mtimeMs, heroStat.mtimeMs);
});

test("an in-range webp master is copied, not recompressed", async () => {
  const root = mkdtempSync(join(tmpdir(), "images-copy-"));
  const input = join(root, "in");
  const output = join(root, "out");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(input, { recursive: true });
  const master = join(input, "hero.webp");
  await sharp({
    create: { width: 8, height: 8, channels: 3, background: { r: 10, g: 20, b: 30 } },
  })
    .webp({ quality: 80 })
    .toFile(master);
  const before = readFileSync(master);
  await runPipeline({
    inputDir: input,
    outputDir: output,
    manifestPath: join(root, "manifest.json"),
    stampPath: join(root, "stamp.json"),
    maxEdge: 1600,
    quality: 80,
  });
  assert.deepEqual(readFileSync(join(output, "hero.webp")), before);
});
