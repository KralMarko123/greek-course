const sectionRules = [
  { key: "pronunciation", label: "Pronunciation Rules", match: /^pronunciation rules$/i },
  { key: "articles", label: "Genders & Articles", match: /^genders article/i }
];

export function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

function splitEntry(line) {
  const [front, ...rest] = line.split("=");

  return {
    greek: front?.trim() || line.trim(),
    meaning: rest.join("=").trim()
  };
}

function classifyLine(line) {
  if (/^[Α-Ωα-ωάέήίόύώϊϋΐΰς,\s]+$/.test(line.split("=")[0] || "")) return "vocab";
  if (line.includes("=")) return "vocab";
  return "note";
}

export function parseMaterial(rawText) {
  const lines = rawText
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const buckets = {
    alphabet: { label: "Alphabet & Vocabulary", lines: [] },
    pronunciation: { label: "Pronunciation Rules", lines: [] },
    articles: { label: "Genders & Articles", lines: [] }
  };

  let current = "alphabet";

  for (const line of lines) {
    const section = sectionRules.find((rule) => rule.match.test(line));
    if (section) {
      current = section.key;
      continue;
    }

    buckets[current].lines.push({
      raw: line,
      type: classifyLine(line),
      ...splitEntry(line)
    });
  }

  return Object.values(buckets).filter((section) => section.lines.length);
}

export function getSectionCount(material) {
  return material.reduce((total, section) => total + section.lines.length, 0);
}

export function getHighlights(material) {
  return material
    .flatMap((section) => section.lines)
    .filter((line) => line.type === "vocab" && line.meaning)
    .slice(0, 5);
}
