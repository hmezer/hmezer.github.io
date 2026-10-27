const pdfFiles = [
  { id: "arab-revolt", name: "Arab Revolt of 1916", url: "publishings/humanities/path-to-arab-revolt.pdf" },
  { id: "computer-experiments", name: "Computer Experiments Report", url: "publishings/statistics/cs-computer-experiments-report.pdf" },
  { id: "spotify-data-analysis", name: "Spotify Data Analysis Report", url: "publishings/statistics/cs-spotify-data-analysis-report.pdf" }
];

const videoFiles = [
  {
    id: "stalkers-lament",
    name: "Stalker's Lament [video essay]",
    embed: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/59oIyGsPCT8" title="Stalker's Lament [video essay]" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },
  {
    id: "dr-moreau",
    name: "The most profound passage from The Island of Dr. Moreau [audiobook]",
    embed: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/bAg6YJ0LT5Y" title="The most profound passage from The Island of Dr. Moreau [audiobook]" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  }
];

const videoExtraContent = {
  "stalkers-lament": `
    <div class="video-extra-content">
      Stalker is less a film than a pilgrimage through mist and silence, where the so-called “Zone” becomes a mirror of the soul. The journey is not about reaching a room that grants wishes, but about crossing the trembling frontier between faith, despair, and the fragile architecture of hope. Tarkovsky paints with slowness, with rain and rust, making each puddle a scripture and each silence a cathedral. The Zone does not promise answers—it reveals the abyss within the seeker.<br><br>
      While this work had been a topic of never ending discussions, speculations and commentaries, the thoughts I share in this video are those that have emerged from my observations. I invite you to consider these speculations and elevate upon them.<br><br>
      <em>Voiceover generated with <a href="https://github.com/hmezer/TorToiSe-TTS-RVC-Voice-Generation" target="_blank" rel="noopener">TorToiSe-RVC pipeline</a>.</em>
    </div>
  `,
  "dr-moreau": `
    <div class="video-extra-content">
      <strong>Chapter XIV, “Dr. Moreau Explains,”</strong> is the black heart of Wells’s novel, the chamber where terror sheds its mask and becomes philosophy. Up until this point, both Prendick and the reader are trapped in a labyrinth of fear—of pain, of monstrosity, of the unknown. But here, in a room thick with morphia and the stench of the vivisected, the curtain lifts.<br><br>
      Here, at last, Moreau speaks. Not as a sadistic butcher, but as a priest of science, cold and fervent, intoxicated by the very malleability of life. For him, the cries of the Beast Folk are no more than the creaking of wood as he carves new forms from flesh—evolution under a scalpel.<br><br>
      The chapter detonates the novel’s deepest themes like thunderclaps:<br><br>
      <strong>The Ethics of Science:</strong> the razor’s edge between discovery and desecration—can ambition sanctify cruelty?<br>
      <strong>The Nature of Humanity:</strong> Moreau’s Beast Folk erode the border between man and animal, showing “civilization” itself as a fragile costume, stitched from instinct and habit.<br>
      <strong>The Problem of Pain:</strong> by declaring suffering a mere biological whisper, Moreau strips morality of its altar, leaving us face to face with the abyss of scientific nihilism.<br><br>
      This moment transforms the tale from jungle-horror to philosophical furnace, compelling us to reckon with questions as old as Genesis and as raw as the scalpel: what is man, what is beast, and what, in the end, is the soul?<br><br>
      <em>Voiceover generated with <a href="https://github.com/hmezer/TorToiSe-TTS-RVC-Voice-Generation" target="_blank" rel="noopener">TorToiSe-RVC pipeline</a>.</em>
    </div>
  `
};

// --- Shared helpers ---
const SITE_TITLE = "hmezer.github.io";
const HOME_TITLE = "Mert welcomes you to his inn! - hmezer.github.io";

// Fetches JSON with an abort timeout and optional retries.
async function fetchJson(url, { timeoutMs = 15000, retries = 0 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

function readSessionCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeSessionCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage may be unavailable (private mode); the in-memory cache still works.
  }
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

// --- Quote Fetching Logic ---
// Served from this site, so there is no backend to wake up.
const QUOTE_URL = "data/zarathustra.json";
const QUOTE_AUTHOR = "Nietzsche";

const fallbackQuotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "One cannot step twice in the same river.", author: "Heraclitus" },
  { text: "I think, therefore I am.", author: "René Descartes" },
  { text: "Man is condemned to be free.", author: "Jean-Paul Sartre" }
];

let cachedQuote = null;
let quoteRequest = null;

function setQuoteMessage(message) {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");
  if (!textEl || !authorEl) return;

  const em = document.createElement("em");
  em.textContent = message;
  textEl.replaceChildren(em);
  authorEl.replaceChildren();
}

function displayQuote(quote) {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");
  if (!textEl || !authorEl) return;

  textEl.textContent = `"${quote.text}"`;
  const italic = document.createElement("i");
  italic.textContent = `- ${quote.author}`;
  authorEl.replaceChildren(italic);
}

function displayFallbackQuote() {
  const authorEl = document.getElementById("quote-author");
  if (!authorEl) return;

  displayQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);

  const note = document.createElement("div");
  note.className = "quote-note";
  note.textContent = "(The archives are resting, so here is one from the shelf.)";
  authorEl.append(note, createButton("Try again", "retry-button", fetchQuote));
}

// Picks the same quote for everyone on a given (local) calendar day.
function pickDailyQuote(data) {
  const quotes = data && data.nietzsche && data.nietzsche.quotes;
  if (!Array.isArray(quotes) || quotes.length === 0) return null;

  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const text = quotes[dayNumber % quotes.length];
  if (typeof text !== "string" || !text) return null;
  return { text, author: QUOTE_AUTHOR };
}

async function fetchQuote() {
  if (cachedQuote) {
    displayQuote(cachedQuote);
    return;
  }

  setQuoteMessage("Consulting the archives for today's thought...");

  try {
    if (!quoteRequest) {
      quoteRequest = fetchJson(QUOTE_URL).finally(() => { quoteRequest = null; });
    }
    const quote = pickDailyQuote(await quoteRequest);
    if (!quote) throw new Error("Unexpected quote response");

    cachedQuote = quote;
    displayQuote(quote);
  } catch (error) {
    console.error("The API failed:", error);
    displayFallbackQuote();
  }
}

// --- GitHub Fetching Logic ---
const PROJECTS_URL = "https://api.github.com/users/hmezer/repos?sort=updated&per_page=30";
const PROJECTS_CACHE_KEY = "github-projects-v1";
const SITE_REPO_NAME = "hmezer.github.io";
const MAX_PROJECTS = 6;
const GITHUB_URL_PREFIX = "https://github.com/";

let cachedProjects = null;

function setProjectsMessage(message) {
  const container = document.getElementById("projects-container");
  if (!container) return; // The user may have navigated away

  const em = document.createElement("em");
  em.textContent = message;
  container.replaceChildren(em);
}

function pickProjects(repos) {
  return repos
    .filter(repo => repo && !repo.fork && repo.name !== SITE_REPO_NAME)
    .slice(0, MAX_PROJECTS)
    .map(({ name, language, description, html_url }) => ({ name, language, description, html_url }));
}

async function fetchProjects() {
  if (!cachedProjects) cachedProjects = readSessionCache(PROJECTS_CACHE_KEY);
  if (Array.isArray(cachedProjects)) {
    displayProjects(cachedProjects);
    return;
  }

  try {
    const data = await fetchJson(PROJECTS_URL);
    if (!Array.isArray(data)) throw new Error("Unexpected GitHub API response");

    cachedProjects = pickProjects(data);
    writeSessionCache(PROJECTS_CACHE_KEY, cachedProjects);
    displayProjects(cachedProjects);
  } catch (error) {
    console.error("API Error:", error);
    setProjectsMessage("(The workbench is currently locked. Could not load projects.)");
  }
}

function displayProjects(repos) {
  const container = document.getElementById("projects-container");
  if (!container) return; // Prevent errors if the user clicked away

  if (repos.length === 0) {
    setProjectsMessage("(The workbench is empty for now.)");
    return;
  }

  const cards = repos.map(repo => {
    const card = document.createElement("div");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = repo.name;

    const meta = document.createElement("div");
    meta.className = "project-meta";
    meta.textContent = `Language: ${repo.language || "Mixed/Unknown"}`;

    const description = document.createElement("p");
    description.textContent = repo.description || "No description provided.";

    card.append(title, meta, description);

    if (typeof repo.html_url === "string" && repo.html_url.startsWith(GITHUB_URL_PREFIX)) {
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "project-link";
      link.textContent = "Open Archive";
      card.append(link);
    }

    return card;
  });

  container.replaceChildren(...cards);
}

// --- Content Mapping ---
const contentMap = {
  home: `<h1><em>Welcome! Willkommen! Hoşgeldiniz!</em></h1>
    <div class="quote-widget" id="quote-widget">
      <div class="quote-text" id="quote-text">Consulting the archives for today's thought...</div>
      <div class="quote-author" id="quote-author"></div>
    </div>`,
  about: `<h1>About Me</h1>
    <p>I hold dual Bachelor’s degrees in Economics and International Relations from Koç University, where my love for history and philosophy also found a home. Currently, I’m pursuing a Master of Science in Econometrics at TU Dortmund, blending analytical rigor with curiosity about how the world ticks. Beyond the classroom, you’ll often find me strumming the guitar or saz, or tinkering with new technologies—whether it’s generative AI, digital tools, or hands-on creations. I thrive on learning, experimenting, and building—both in code and in craft.</p>
    <br>
    <h1>Contact</h1>
    <p>Hüseyin Mert Ezer</p>
    <p>Email: ezerhuseyinmert@gmail.com</p>`,
  projects: `<h1>The Workbench</h1>
    <p>A live feed of my latest projects and experiments from GitHub.</p>
    <div id="projects-container" class="project-grid">
      <em>Igniting the forge... (Fetching projects)</em>
    </div>`
};

// --- Page chrome: navigation state, panels, background ---
const BACKGROUND_HOME = "media/beach-of-pale.jpg";
const BACKGROUND_OTHER = "media/bikini-bottom-background.jpg";
const BACKGROUND_FADE_MS = 500;

const backgroundLayers = [
  document.getElementById("bg-a"),
  document.getElementById("bg-b")
];
let activeBackgroundLayer = 0;
let currentBackground = null;
let backgroundCleanupTimer = null;

// Crossfades by raising a second layer above the current one, then retiring the old layer.
function setBackgroundImage(section) {
  const url = section === "home" ? BACKGROUND_HOME : BACKGROUND_OTHER;
  if (url === currentBackground) return;
  currentBackground = url;

  const previous = backgroundLayers[activeBackgroundLayer];
  activeBackgroundLayer = 1 - activeBackgroundLayer;
  const next = backgroundLayers[activeBackgroundLayer];

  next.style.backgroundImage = `url("${url}")`;
  previous.classList.remove("is-top");
  next.classList.add("is-top", "is-visible");

  clearTimeout(backgroundCleanupTimer);
  backgroundCleanupTimer = setTimeout(() => previous.classList.remove("is-visible"), BACKGROUND_FADE_MS);
}

function setActiveNav(section) {
  document.querySelectorAll(".sidebar a").forEach(link => {
    if (link.id === `nav-${section}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.style.display = panel.id === panelId ? "block" : "none";
  });
}

function renderMain(html, section) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = html;
  mainContent.scrollTop = 0;
  setBackgroundImage(section);
}

function renderLinkList(listId, items, hrefFor, currentId) {
  const list = document.getElementById(listId);
  const entries = items.map(item => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = hrefFor(item);
    link.textContent = item.name;
    if (item.id === currentId) link.setAttribute("aria-current", "page");
    li.append(link);
    return li;
  });
  list.replaceChildren(...entries);
}

// --- Sections ---
function showContent(section) {
  renderMain(contentMap[section], section === "home" ? "home" : "other");
  showPanel(null);

  // Fetch specific APIs based on the active tab
  if (section === "home") {
    fetchQuote();
  } else if (section === "projects") {
    fetchProjects();
  }
}

function showPdfSection(currentId) {
  showPanel("pdf-list-panel");
  renderLinkList("pdf-files-list", pdfFiles, pdf => `#library/${pdf.id}`, currentId);
}

function showLibrary() {
  renderMain(`<h1>Library</h1>
    <p>Select a publishing from the list to view it.</p>`, "other");
  showPdfSection();
}

function loadPdf(pdf) {
  renderMain(`
    <h2>${pdf.name}</h2>
    <p class="pdf-download"><a class="download-button" href="${pdf.url}" target="_blank" rel="noopener">Download PDF</a></p>
    <iframe class="pdf-viewer" src="${pdf.url}" title="${pdf.name} (PDF)"></iframe>
  `, "other");
  showPdfSection(pdf.id);
}

// The frame overlay is purely decorative, so it has empty alt text.
function renderTv(screenHtml) {
  return `<div class="tv-frame-container">
      <div class="tv-frame-image">
        ${screenHtml}
        <img src="media/old-television-frame-169.png" class="tv-frame-overlay" alt="" />
      </div>
    </div>`;
}

function showVideoPanel(currentId) {
  showPanel("video-list-panel");
  renderLinkList("video-files-list", videoFiles, video => `#television/${video.id}`, currentId);
}

function showTelevision() {
  renderMain(`
    <h1>Welcome to the Television!</h1>
    <p>Select a video from the list to watch it in our retro TV!</p>
    ${renderTv(`<div class="tv-screen-white-noise"><img src="media/white-noise.gif" alt="" /></div>`)}
  `, "other");
  showVideoPanel();
}

function loadVideo(video) {
  const extraText = videoExtraContent[video.id] || "";
  renderMain(`
    <h2>${video.name}</h2>
    ${renderTv(`<div class="tv-screen-embed">${video.embed}</div>`)}
    ${extraText}
  `, "other");
  showVideoPanel(video.id);
}

// --- Hash routing ---
// #home, #about, #workbench, #library[/<pdf id>], #television[/<video id>]
function route() {
  const [name, param] = location.hash.slice(1).split("/");
  let section = name || "home";
  let title = SITE_TITLE;

  if (section === "about") {
    showContent("about");
    title = `About - ${SITE_TITLE}`;
  } else if (section === "workbench") {
    showContent("projects");
    title = `Workbench - ${SITE_TITLE}`;
  } else if (section === "library") {
    const pdf = pdfFiles.find(item => item.id === param);
    if (pdf) {
      loadPdf(pdf);
      title = `${pdf.name} - ${SITE_TITLE}`;
    } else {
      showLibrary();
      title = `Library - ${SITE_TITLE}`;
    }
  } else if (section === "television") {
    const video = videoFiles.find(item => item.id === param);
    if (video) {
      loadVideo(video);
      title = `${video.name} - ${SITE_TITLE}`;
    } else {
      showTelevision();
      title = `Television - ${SITE_TITLE}`;
    }
  } else {
    section = "home";
    showContent("home");
    title = HOME_TITLE;
  }

  document.title = title;
  setActiveNav(section);
}

window.addEventListener("hashchange", route);
route();
