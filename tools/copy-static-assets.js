const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const dateFolderPattern = /^\d{2}-\d{2}-\d{4}$/;

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) fs.copyFileSync(sourcePath, targetPath);
  }
}

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, "lesson-manifest.js"), path.join(dist, "lesson-manifest.js"));

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && dateFolderPattern.test(entry.name)) {
    copyDirectory(path.join(root, entry.name), path.join(dist, entry.name));
  }
}

console.log("Copied lesson manifest and dated lesson folders into dist/");
