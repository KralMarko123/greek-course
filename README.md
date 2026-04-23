# Greek Course Review

A small local web app for reviewing lesson materials from dated course folders.

Site is live at [kralmarko123.github.io/greek-course](https://kralmarko123.github.io/greek-course/)

## Run

```bash
npm.cmd start
```

Then open:

```text
http://localhost:5173
```

## Add A Lesson

Create a folder named with the lesson date:

```text
DD-MM-YYYY/
```

Put the main notes in `main.txt`. Put exercise files in numbered order inside:

```text
DD-MM-YYYY/exercises/
```

Refresh the app manifest after adding folders:

```bash
npm.cmd run manifest
```

The app reads `.txt` materials directly and embeds PDF exercises when the browser supports previewing them.
Numbered exercise files such as `1.pdf`, `2.pdf`, and `3.pdf` are shown in numeric order as Exercise 1, Exercise 2, and Exercise 3.

Images placed in `DD-MM-YYYY/images/` are shown in the lesson's visual overview section. Supported image formats include
`.webp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, and `.avif`.

Optional practice links can be added in `DD-MM-YYYY/links.json`:

```json
[
  {
    "title": "Learn the Greek alphabet and pronunciation",
    "source": "My Small Skinny Greek Lessons",
    "focus": "Modern Greek alphabet sounds and vowel recap",
    "url": "https://www.youtube.com/watch?v=8Zlr32wqQNg"
  }
]
```

## Build

```bash
npm.cmd run build
```

The build step creates `dist/` and copies the lesson manifest plus dated lesson folders into it.

## GitHub Pages

Publish the built app to a `gh-pages` branch:

```bash
npm.cmd run deploy
```

In the GitHub repository settings, set Pages to deploy from the `gh-pages` branch.
