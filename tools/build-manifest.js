const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dateFolderPattern = /^\d{2}-\d{2}-\d{4}$/;

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
  return fs
    .readdirSync(folderPath)
    .filter((entry) => entry.toLowerCase().endsWith(".txt"))
    .sort()[0];
}

function findExercises(folderPath) {
  const exercisesPath = path.join(folderPath, "exercises");
  if (!fs.existsSync(exercisesPath)) return [];

  const friendlyTitles = {
    "article_ex_a_filled_endings_v2_(1)_(1).pdf": "Article endings practice"
  };

  return fs
    .readdirSync(exercisesPath)
    .filter((entry) => fs.statSync(path.join(exercisesPath, entry)).isFile())
    .sort()
    .map((fileName) => {
      const extension = path.extname(fileName).slice(1).toLowerCase() || "file";
      const title = fileName
        .replace(path.extname(fileName), "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        title: friendlyTitles[fileName] || title.charAt(0).toUpperCase() + title.slice(1),
        path: `${path.basename(folderPath)}/exercises/${fileName}`,
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

const lessons = fs
  .readdirSync(root)
  .filter((entry) => dateFolderPattern.test(entry) && fs.statSync(path.join(root, entry)).isDirectory())
  .sort((a, b) => toIsoDate(b).localeCompare(toIsoDate(a)))
  .map((folderName) => {
    const folderPath = path.join(root, folderName);
    const material = findMaterial(folderPath);
    const date = toIsoDate(folderName);

    return {
      id: date,
      date,
      title: date === "2026-04-20" ? "Greek Alphabet, Pronunciation, and Articles" : toDisplayTitle(date),
      folder: folderName,
      material: material ? `${folderName}/${material}` : "",
      exercises: findExercises(folderPath),
      images: findImages(folderPath),
      tags: date === "2026-04-20" ? ["Alphabet", "Pronunciation", "Articles"] : ["Lesson"]
    };
  })
  .filter((lesson) => lesson.material);

const output = `window.GREEK_COURSE_LESSONS = ${JSON.stringify(lessons, null, 2)};\n`;
fs.writeFileSync(path.join(root, "lesson-manifest.js"), output, "utf8");

console.log(`Wrote ${lessons.length} lesson${lessons.length === 1 ? "" : "s"} to lesson-manifest.js`);
