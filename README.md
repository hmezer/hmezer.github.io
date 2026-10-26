# hmezer.github.io

My personal website, hosted with **GitHub Pages** and built with **plain HTML, CSS, and JavaScript**. There is no framework, package manager, or build step: edit a file, refresh the browser.

### [***Click here to go to the website.***](https://hmezer.github.io)

## Sections

Navigation uses hash routes, so every section can be linked and the Back button works.

| Route | Section | What it shows |
|---|---|---|
| `#home` | Home | Welcome message and a random quote from the backend API |
| `#about` | About | Short bio and contact details |
| `#workbench` | Workbench | My six most recently updated GitHub repositories (forks and this site's repo are skipped) |
| `#library`, `#library/<id>` | Library | PDFs from `publishings/`, listed in `pdfFiles` in `script.js` |
| `#television`, `#television/<id>` | Television | YouTube videos on a retro TV frame, listed in `videoFiles` in `script.js` |

## Structure

- `index.html` - page shell: sidebar navigation, list panels and the `<main>` content region.
- `style.css` - shared theme and components (brown/cream palette, responsive layout around the 900px breakpoint).
- `script.js` - content, hash routing, API calls and rendering.
- `media/` - site imagery (backgrounds, TV frame, favicon) and the standalone `stalkers-lament.html` page.
- `publishings/` - published PDFs (`humanities/`, `statistics/`) and a standalone PDF article page.
- `test-page/` and `legacy/` - drafts, experiments and historical pages. They are not part of the live site.

## External services

- **Quote backend** - `https://github-pages-backend.onrender.com/random-quote`, hosted on Render's free tier. It can take up to a minute to wake up, so the request has a timeout and one retry, and falls back to a small built-in list of quotes with a "Try again" button.
- **GitHub REST API** - `https://api.github.com/users/hmezer/repos`, called without authentication (60 requests per hour per IP). Results are cached in `sessionStorage` for the browser session.
- **YouTube embeds** - the Television section embeds videos with iframes.

API text is always rendered as text, never as HTML.

## Working on the site

There is nothing to install. To preview locally, serve the folder with any static server, for example `python -m http.server`, and open `http://localhost:8000`. Check the browser console and test at desktop and narrow widths.

- New Library entry: add a PDF under `publishings/` and an `{ id, name, url }` item to `pdfFiles`.
- New video: add an item to `videoFiles` and, if needed, matching text to `videoExtraContent`.
- New regular section: add it to `contentMap`, a link in the sidebar, and a case in `route()`.

## Why Plain HTML/CSS/JS?

- **Performance:** a lightweight site loads fast.
- **Learning:** working without frameworks deepens my understanding of the web's core technologies.
- **Portability:** it can be hosted or reused anywhere.

## Contact

Questions or feedback are welcome through an [issue](https://github.com/hmezer/hmezer.github.io/issues) or my GitHub profile.
