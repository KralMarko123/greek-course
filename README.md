# Greek Course Review

A small local web app for reviewing lesson materials from dated course folders.

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

Put the main notes as a `.txt` file in that folder. Put exercise files in:

```text
DD-MM-YYYY/exercises/
```

Refresh the app manifest after adding folders:

```bash
npm.cmd run manifest
```

The app reads `.txt` materials directly and embeds PDF exercises when the browser supports previewing them.

Images placed in `DD-MM-YYYY/images/` are shown in the lesson's visual overview section. Supported image formats include
`.webp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, and `.avif`.

## Build

```bash
npm.cmd run build
```

The build step creates `dist/` and copies the lesson manifest plus dated lesson folders into it.
