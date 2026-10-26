# Codebase Review Tasks

Findings from the repository review. Each item has the **Issue** (what is wrong) and the **Work** (suggested fix).
Items are numbered as in the review, grouped by theme.

## Broken or incorrect

### 1. `publishings/index.html` points at a PDF that does not exist at that path
- **Issue:** The page references `./path-to-arab-revolt.pdf` (lines 64-71), but the file lives at `publishings/humanities/path-to-arab-revolt.pdf`. The iframe is empty and the download link is dead. The `<title>` is also a placeholder ("My Article").
- **Work:** Change the iframe `src` and both links to `./humanities/path-to-arab-revolt.pdf`. Give the page a real title and heading, and add a `title` attribute to the iframe.

### 2. Two published PDFs are orphaned
- **Issue:** `publishings/statistics/cs-computer-experiments-report.pdf` and `cs-spotify-data-analysis-report.pdf` are not in `pdfFiles` in `script.js`, so the Library never lists them.
- **Work:** Add entries to `pdfFiles` with root-relative paths (e.g. `publishings/statistics/cs-computer-experiments-report.pdf`) and readable names.

### 3. `test-page/main-test.html` links to a missing page
- **Issue:** It links to `showcase-youtube-video.html`, which no longer exists. The page now lives at `media/stalkers-lament.html`.
- **Work:** Low priority (historical page). No need to fix. The pages under `test-page/` are simply drafts and not part of the main website showcased.

### 4. `test-page/main1.html` and `index-v20260415.html` have broken `media/` paths
- **Issue:** They use `media/...` relative paths, which resolve to a non-existent `test-page/media/` folder, so images are broken.
- **Work:** Low priority. Remove/exclude the pages (see item 20).

## Security

### 5. Quote text is rendered with `innerHTML`
- **Issue:** `displayQuote` (script.js:81-82) writes `quote-text` and `quote-author` from the backend via `innerHTML`. Any HTML in the response, or a compromised backend, executes in the site's origin. This also violates the project rule to render API text as text.
- **Work:** Use `textContent`. Build the author line with `createElement('i')` and `textContent` instead of a template string. Do the same for the "waking up" and error messages if they stop being static.

### 6. GitHub repo data is rendered with `innerHTML`
- **Issue:** `displayProjects` (script.js:125-130) interpolates `repo.name`, `language`, `description` and `html_url` into HTML. Descriptions are free text, and `html_url` goes straight into `href`.
- **Work:** Build each card with `createElement` and `textContent`. Set the link `href` only if the URL starts with `https://github.com/`.

### 7. `spotify.html` renders API data and raw input as HTML
- **Issue:** `data.name`, artist names and the unsanitized `trackId` go into `innerHTML` and the embed URL. `res.json()` is called before checking `res.ok`. The page asks visitors to paste an access token into a plain text field. It is not linked from anywhere.
- **Work:** This page is not part of the main website. Move it to `test-page/`.

## Robustness and compatibility

### 8. GitHub API response is not validated
- **Issue:** If the response is not an array (e.g. a rate-limit object), `repos.forEach` throws. Unauthenticated requests are limited to 60 per hour per IP, so shared networks will hit it. The list also includes forks and `hmezer.github.io` itself.
- **Work:** Guard with `Array.isArray`, show the existing error message otherwise, and optionally cache results in `sessionStorage`. Filter out forks and the site repo (`repo.fork`, `repo.name`), then slice to 6. Fetch a larger `per_page` so the filter still leaves enough.

### 9. Quote backend has no timeout, retry or fallback
- **Issue:** The Render free-tier backend can take up to 60 seconds to wake. There is no timeout, retry, or static fallback quote. On failure the message says to refresh, but nothing offers a retry.
- **Work:** Add an `AbortController` timeout, one automatic retry, and a small hardcoded fallback quote list. Optionally add a "Try again" button in the error state.

### 10. No URL state
- **Issue:** Navigation is JS-only, so reloading always returns to Home, Back leaves the site, and individual sections, PDFs and videos cannot be linked.
- **Work:** Add hash routes (e.g. `#about`, `#library/arab-revolt`, `#television/dr-moreau`). Read the hash on load and on `hashchange`, and update it from the nav and list handlers.

### 11. `transition: background-image` has no effect
- **Issue:** `background-image` is not animatable, so the intended 0.5s fade never happens (style.css:41).
- **Work:** Implement a real crossfade (e.g. two stacked background layers fading opacity). Or otherwise, another method which fits the site rules, and makes the fading effect work without breaking anything.

### 12. PDF iframe is unreliable on mobile and uses an invalid attribute
- **Issue:** iOS Safari and many Android browsers show only the first page or nothing in an iframe. `type="application/pdf"` is not a valid `<iframe>` attribute (script.js:239).
- **Work:** Remove the `type` attribute. Keep the download link, and consider making it more prominent on narrow viewports (or hiding the iframe there). Add a `title` to the iframe.

### 13. Mobile layout problems (900px and below)
- **Issue:**
  - `.container` is `height: 100vh` in a column layout, so the sidebar, list panel and content share one screen height and the content area is cramped. `100vh` also misbehaves with mobile browser toolbars.
  - The TV screen overlay uses `vw`/`px` offsets while the frame image scales by percentage, so the video can drift out of alignment with the frame.
  - The desktop quote widget is `position: absolute` and can overlap the heading on short windows.
- **Work:**
  - Use `min-height: 100dvh` (with a `100vh` fallback) and let the page scroll on mobile.
  - Use the same percentage offsets for the overlay at all widths.
  - Give `.main-content` bottom padding on desktop, or place the quote in the flow, so it cannot cover headings.
  - Verify in a browser at several widths.

### 14. Deprecated attributes, tracking parameters, missing favicon and description
- **Issue:** `frameborder` (YouTube iframes in script.js:9,14 and the Spotify iframe) and `allowtransparency` are deprecated. The YouTube embeds carry `si=` tracking parameters. There is no favicon, so `/favicon.ico` returns 404. There is no meta description.
- **Work:** Replace `frameborder` with CSS (`border: 0`) and drop `allowtransparency`. Remove `si=` parameters. Add a favicon `<link>` (a file under `media/`) and a `<meta name="description">`.

## Accessibility

### 15. Navigation and list items are not keyboard-operable
- **Issue:** The sidebar (index.html:15-19) and the Library/Television lists (script.js:228, 272) use `<li>` with click handlers, with no `tabindex`, role, button or link. Keyboard and screen-reader users cannot navigate the site.
- **Work:** Use `<button>` (or `<a href="#...">`, ideally with item 10) inside each `<li>`. Mark the current item with `aria-current="page"`. Verify with Tab/Enter/Space.

### 16. Active nav state is nearly invisible; no focus styles
- **Issue:** Hover/active background `#42392c` is almost identical to the sidebar `#423013` (style.css:18). There are no `:focus-visible` styles anywhere.
- **Work:** Pick a clearly different active/hover color from the existing brown/cream palette, add a left border or bold marker for the active item, and add visible `:focus-visible` outlines to nav and list items.

### 17. Text contrast depends on the background image
- **Issue:** Body text is `#eee` and the fallback background is `#f8f9fa` (style.css:4, 34), so text is unreadable if an image fails to load. Over the photo backgrounds, contrast is not guaranteed.
- **Work:** Set a dark fallback `background-color` on `.main-content` (e.g. `#423013`). Add a semi-transparent overlay or text panel over the images, and check contrast ratios (WCAG AA, 4.5:1).

### 18. Missing landmarks, iframe titles and decorative alt text
- **Issue:** There is no `<main>` element and `<nav>` has no label. The PDF iframes have no `title`. The TV frame overlay has descriptive `alt` text although it is purely decorative.
- **Work:** Change the content `div` to `<main id="main-content">`, add `aria-label="Primary"` to `<nav>`, add `title` to the PDF iframes, and set `alt=""` on the decorative overlay (keep meaningful alt text elsewhere).

## Repository hygiene

### 19. About 7 MB of unused media
- **Issue:** Only `beach-of-pale.jpg`, `bikini-bottom-background.png` (1.7 MB), `white-noise.gif` and `old-television-frame-169.png` are referenced. These are deployed but unused: `old-television-frame.png`, `vintage-tv-frame.png`, `retro-1960s-television-frame-with-transparent-background.jpg`, `fresque-vector.png`, `holy-column-vector.png`, `scale-vector.png`, `war-elephant-vector.png`, `rocky-wall.png`, `excitatory-synapse-dennis-kunkel.jpg`. `bikini-bottom-background.png` is also large for a background.
- **Work:** Confirm nothing in `legacy/` or `test-page/` needs them, then delete or move them out of the deployed tree. Compress `bikini-bottom-background.png`, or convert it to JPEG/WebP.

### 20. Dev leftovers are publicly deployed
- **Issue:** `log.txt`, both `note.txt` files, `test-page/` (including `api-test.html`, which calls the backend) and `legacy/` are all served and indexable. `style.css` has stray comments ("ADD THIS LINE", "I slightly reduced this…", "STARTS HERE/ENDS HERE").
- **Work:** Remove `log.txt` and the `note.txt` files, or move the notes outside the published tree. Decide whether `test-page/` and `legacy/` stay public; if not, delete them (git history preserves them). Clean up the CSS comments.

### 21. `README.md` is stale
- **Issue:** It claims no libraries or external services and says each project has a live demo and source link. The site now depends on a Render backend and the GitHub API, and the Workbench section does not match that description.
- **Work:** Update the README to describe the current structure (home quote API, GitHub projects feed, Library, Television), the external dependencies, and the no-build setup.

### 22. Email address is in plain text in `script.js`
- **Issue:** The address in the About section is trivially scraped for spam.
- **Work:** Optional. Keep it if intended, or replace it with a contact form/link, or lightly obfuscate it (e.g. assemble it in JS on click).

### 23. `CLAUDE.md` is untracked
- **Issue:** It is the only entry in `git status`, so the project guidance is not versioned.
- **Work:** Decide whether to commit it. Do not stage or commit unless explicitly requested.

## Suggested order

1. Items 5-6 (render API data as text)
2. Item 1 (fix the PDF path)
3. Item 15 (accessible navigation)
4. Item 2 (list the orphaned PDFs)
5. Items 19-21 (cleanup)
6. The rest by priority
