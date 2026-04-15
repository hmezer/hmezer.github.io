const pdfFiles = [
  { name: "Arab Revolt of 1916", url: "publishings/path-to-arab-revolt.pdf" }
];

const videoFiles = [
  {
    id: "stalkers-lament",
    name: "Stalker's Lament [video essay]",
    embed: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/59oIyGsPCT8?si=ryKwxBnnqDZo4kSw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen></iframe>`
  },
  {
    id: "dr-moreau",
    name: "The most profound passage from The Island of Dr. Moreau [audiobook]",
    embed: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/bAg6YJ0LT5Y?si=Z-LNAPqIxLjVRpu4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen></iframe>`
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

let cachedQuote = null;

async function fetchQuote() {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");

  if (cachedQuote) {
    displayQuote(cachedQuote);
    return;
  }

  if (textEl && authorEl) {
    textEl.innerHTML = "<em>Waking up the server... (This can take up to 60 seconds on the first visit!)</em>";
    authorEl.innerHTML = "";
  }

  try {
    const response = await fetch("https://github-pages-backend.onrender.com/random-quote");
    if (!response.ok) throw new Error("Server error");
    
    const data = await response.json();
    cachedQuote = data; 
    
    displayQuote(data);
  } catch (error) {
    console.error("The API failed:", error);
    const freshTextEl = document.getElementById("quote-text");
    if (freshTextEl) {
      freshTextEl.innerHTML = "<em>(The archives are currently resting. Please try refreshing in a moment...)</em>";
    }
  }
}

function displayQuote(data) {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");
  
  if (textEl && authorEl) {
    textEl.innerHTML = `"${data["quote-text"] || data.quote}"`;
    authorEl.innerHTML = `<i>- ${data["quote-author"] || data.author}</i>`;
  }
}

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
    <p>Email: ezerhuseyinmert@gmail.com</p>`
};

const navMap = {
  "nav-home": () => showContent('home'),
  "nav-about": () => showContent('about'),
  "nav-pdf": showPdfSection,
  "nav-video": showVideoSection
};

Object.keys(navMap).forEach(id => {
  document.getElementById(id).addEventListener("click", () => {
    setActiveNav(id);
    navMap[id]();
  });
});

function setActiveNav(activeId) {
  document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
}

function hidePanels() {
  document.getElementById('pdf-list-panel').style.display = 'none';
  document.getElementById('video-list-panel').style.display = 'none';
}

function setBackgroundImage(section) {
  const mainContent = document.getElementById('main-content');
  if (section === 'home') {
    mainContent.style.backgroundImage = 'url("media/beach-of-pale.jpg")';
  } else {
    mainContent.style.backgroundImage = 'url("media/bikini-bottom-background.png")';
  }
}

function showContent(section) {
  document.getElementById('main-content').innerHTML = contentMap[section];
  setBackgroundImage(section);
  hidePanels();
  
  if (section === 'home') {
    fetchQuote();
  }
}

function showPdfSection() {
  document.getElementById('main-content').innerHTML = `<h1>Library</h1>
    <p>Select a publishing from the list to view it.</p>`;
  setBackgroundImage('pdf');
  hidePanels();
  document.getElementById('pdf-list-panel').style.display = 'block';
  renderPdfList();
}

function renderPdfList() {
  const pdfList = document.getElementById('pdf-files-list');
  pdfList.innerHTML = '';
  pdfFiles.forEach((pdf, idx) => {
    const li = document.createElement('li');
    li.textContent = pdf.name;
    li.onclick = () => loadPdf(pdf, idx);
    pdfList.appendChild(li);
  });
  document.querySelectorAll('#pdf-files-list li').forEach(li => li.classList.remove('active'));
}

function loadPdf(pdf, idx) {
  document.querySelectorAll('#pdf-files-list li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('#pdf-files-list li')[idx].classList.add('active');
  document.getElementById('main-content').innerHTML = `
    <h2>${pdf.name}</h2>
    <iframe class="pdf-viewer" src="${pdf.url}" type="application/pdf"></iframe>
    <p><a href="${pdf.url}" target="_blank" rel="noopener">Download PDF</a></p>
  `;
  setBackgroundImage('pdf');
  hidePanels();
  document.getElementById('pdf-list-panel').style.display = 'block';
}

function showVideoSection() {
  document.getElementById('main-content').innerHTML = `
    <h1>Welcome to the Television!</h1>
    <p>Select a video from the list to watch it in our retro TV!</p>
    <div class="tv-frame-container">
      <div class="tv-frame-image">
        <div class="tv-screen-white-noise">
          <img src="media/white-noise.gif" alt="White Noise" />
        </div>
        <img src="media/old-television-frame-169.png"
             class="tv-frame-overlay"
             alt="Retro TV Frame Overlay" />
      </div>
    </div>
  `;
  setBackgroundImage('video');
  hidePanels();
  document.getElementById('video-list-panel').style.display = 'block';
  renderVideoList();
}

function renderVideoList() {
  const videoList = document.getElementById('video-files-list');
  videoList.innerHTML = '';
  videoFiles.forEach((video, idx) => {
    const li = document.createElement('li');
    li.textContent = video.name;
    li.onclick = () => loadVideo(video);
    videoList.appendChild(li);
  });
  document.querySelectorAll('#video-files-list li').forEach(li => li.classList.remove('active'));
}

function loadVideo(video) {
  const idx = videoFiles.findIndex(v => v.id === video.id);
  document.querySelectorAll('#video-files-list li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('#video-files-list li')[idx].classList.add('active');
  const extraText = videoExtraContent[video.id] || '';
  document.getElementById('main-content').innerHTML = `
    <h2>${video.name}</h2>
    <div class="tv-frame-container">
      <div class="tv-frame-image">
        <div class="tv-screen-embed">
          ${video.embed}
        </div>
        <img src="media/old-television-frame-169.png"
             class="tv-frame-overlay"
             alt="Retro TV Frame Overlay" />
      </div>
    </div>
    ${extraText}
  `;
  setBackgroundImage('video');
  hidePanels();
  document.getElementById('video-list-panel').style.display = 'block';
}

// On page load, show home and set active nav
setActiveNav("nav-home");
showContent('home');
