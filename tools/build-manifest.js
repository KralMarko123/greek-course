const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dateFolderPattern = /^\d{2}-\d{2}-\d{4}$/;
const lessonDetails = {
  "2026-04-20": {
    title: "Greek Alphabet, Pronunciation, and Articles",
    tags: ["Alphabet", "Pronunciation", "Articles"]
  },
  "2026-04-22": {
    title: "Greek Articles, Plurals, and Adjective Agreement",
    tags: ["Articles", "Plurals", "Adjectives"]
  }
};

function toIsoDate(folderName) {
  const [day, month, year] = folderName.split("-");
  return `${year}-${month}-${day}`;
}

function toDisplayTitle(isoDate) {
  return `Greek lesson - ${new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${isoDate}T12:00:00`))}`;
}

function findMaterial(folderPath) {
  const textFiles = fs
    .readdirSync(folderPath)
    .filter((entry) => entry.toLowerCase().endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return textFiles.find((entry) => entry.toLowerCase() === "main.txt") || textFiles[0];
}

function findExercises(folderPath) {
  const exercisesPath = path.join(folderPath, "exercises");
  if (!fs.existsSync(exercisesPath)) return [];

  const friendlyTitles = {
    "20-04-2026/1.pdf": "Article endings practice"
  };

  return fs
    .readdirSync(exercisesPath)
    .filter((entry) => fs.statSync(path.join(exercisesPath, entry)).isFile())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((fileName) => {
      const extension = path.extname(fileName).slice(1).toLowerCase() || "file";
      const folderName = path.basename(folderPath);
      const titleKey = `${folderName}/${fileName}`;
      const baseTitle = fileName
        .replace(path.extname(fileName), "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const title = /^\d+$/.test(baseTitle) ? `Exercise ${baseTitle}` : baseTitle;

      return {
        title: friendlyTitles[titleKey] || title.charAt(0).toUpperCase() + title.slice(1),
        path: `${folderName}/exercises/${fileName}`,
        type: extension
      };
    });
}

function findImages(folderPath) {
  const imagesPath = path.join(folderPath, "images");
  if (!fs.existsSync(imagesPath)) return [];

  const imageExtensions = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);

  return fs
    .readdirSync(imagesPath)
    .filter((entry) => imageExtensions.has(path.extname(entry).toLowerCase()))
    .filter((entry) => fs.statSync(path.join(imagesPath, entry)).isFile())
    .sort()
    .map((fileName) => {
      const title = fileName
        .replace(path.extname(fileName), "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        path: `${path.basename(folderPath)}/images/${fileName}`
      };
    });
}

function findLinks(folderPath) {
  const linksPath = path.join(folderPath, "links.json");
  if (!fs.existsSync(linksPath)) return [];

  const links = JSON.parse(fs.readFileSync(linksPath, "utf8"));
  if (!Array.isArray(links)) throw new Error(`${linksPath} must contain an array`);

  return links.map((link) => ({
    title: link.title,
    source: link.source,
    focus: link.focus,
    url: link.url
  }));
}

const lessons = fs
  .readdirSync(root)
  .filter((entry) => dateFolderPattern.test(entry) && fs.statSync(path.join(root, entry)).isDirectory())
  .sort((a, b) => toIsoDate(b).localeCompare(toIsoDate(a)))
  .map((folderName) => {
    const folderPath = path.join(root, folderName);
    const material = findMaterial(folderPath);
    const date = toIsoDate(folderName);
    const details = lessonDetails[date] || {};

    return {
      id: date,
      date,
      title: details.title || toDisplayTitle(date),
      folder: folderName,
      material: material ? `${folderName}/${material}` : "",
      exercises: findExercises(folderPath),
      images: findImages(folderPath),
      links: findLinks(folderPath),
      tags: details.tags || ["Lesson"]
    };
  })
  .filter((lesson) => lesson.material);

const output = `window.GREEK_COURSE_LESSONS = ${JSON.stringify(lessons, null, 2)};\n`;
fs.writeFileSync(path.join(root, "lesson-manifest.js"), output, "utf8");

console.log(`Wrote ${lessons.length} lesson${lessons.length === 1 ? "" : "s"} to lesson-manifest.js`);
