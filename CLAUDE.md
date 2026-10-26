# Claude Code Project Guide

## Project model

- This is a static GitHub Pages site built with plain HTML, CSS, and JavaScript. There is no framework, package manager, build step, or configured automated test suite.
- The deployed home page is the root `index.html`. Keep its page shell in HTML, shared visual rules in `style.css`, and interactive behavior/content in `script.js`.
- Preserve the lightweight, no-build setup. Do not add dependencies or a build system for routine content or layout changes.
- Work as a frontend developer within the existing static-site architecture; do not introduce a framework such as Tailwind or Bootstrap unless explicitly requested.

## Main site structure

- `index.html` defines the shared shell: sidebar navigation, PDF/video panels, and the main content region. Keep element IDs used by `script.js` in sync with markup.
- `script.js` maps ordinary sections through `contentMap` and routes them with `route()`, which reads `location.hash` (`#home`, `#about`, `#workbench`, `#library[/<id>]`, `#television[/<id>]`). Add a regular section to `contentMap`, a sidebar link in `index.html` (id `nav-<route>`), and a case in `route()`; use the existing PDF/video section functions for those specialized views.
- Navigation and list entries are real links (`<a href="#...">`); the current one carries `aria-current="page"`, which the CSS styles. Do not reintroduce click-handler-only `<li>` items.
- Page backgrounds crossfade between the two `.bg-layer` elements via `setBackgroundImage`; the main content is the `<main id="main-content">` element above them.
- PDF entries are listed in `pdfFiles` as `{ id, name, url }` (the `id` is the route slug); keep their paths relative to the site root and place published documents under `publishings/`.
- Video entries are listed in `videoFiles`; add matching supplemental copy to `videoExtraContent` when needed. TV artwork and other site imagery are under `media/`.
- `style.css` contains the main site's shared theme and component styles. Keep new styles consistent with its brown/cream palette and existing component naming; preserve the responsive layout around the `900px` breakpoint.
- Keep CSS organized with the existing stylesheet and component patterns; do not create a parallel styling system for the main site without a clear need.
- The home quote and project cards use external APIs. Keep loading/error states, and render API-provided text as text rather than executable HTML.

## Pages and directories

- `media/stalkers-lament.html` is a separate standalone page, not part of the main page shell. Its styles and scripts are currently inline. (`spotify.html` now lives in `test-page/` as an experiment.)
- `publishings/index.html` is a standalone PDF/article page. The root site's Library list is separately driven by `pdfFiles` in `script.js`.
- `legacy/` and `test-page/` contain historical pages, experiments, and prototypes. Do not treat them as canonical templates or change them when updating the live site unless the request specifically targets them.
- Use semantic HTML5 and avoid deprecated elements. Keep assets in the existing directories: site imagery belongs in `media/`, and publications in `publishings/` (there is no general `assets/` directory). Use relative URLs consistent with nearby files and check each path; GitHub Pages paths are case-sensitive when deployed.

## Editing and verification

- Prefer small, focused edits that preserve the current plain-file architecture and visual behavior. Keep HTML, CSS, JavaScript, and asset references synchronized.
- For new or changed controls, retain accessible names and keyboard-operable behavior; provide useful `alt` text for meaningful images and titles for embedded content.
- Before editing, inspect `git status` and preserve unrelated existing work. Before finishing, review changed markup and styles for unclosed tags, broken references, and syntax issues.
- There are no repository-defined build or test commands. For UI or interaction changes, validate the affected page in a browser at desktop and narrow viewport sizes, and check the browser console and referenced asset paths.

## Git and deployment

- Do not stage, commit, or push changes unless the user explicitly requests that action. Never assume that a change should be deployed immediately.
- If asked to commit, stage only the files relevant to the request and use a concise, descriptive commit message. If asked to push, push to the appropriate remote and the active/requested branch after checking the current branch and worktree state.
