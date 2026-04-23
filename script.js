const showCache = {};
let allShows = [];
let currentEpisodes = [];

async function setup() {
  const root = document.getElementById("root");
  const showSearch = document.getElementById("show-search-input");
  const epSearch = document.getElementById("episode-search-input");
  const showSelector = document.getElementById("show-selector");
  const backBtn = document.getElementById("back-to-shows");

  // --- Add Footer (Requirement 1) ---
  const footer = document.createElement("footer");
  footer.innerHTML = `Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>`;
  document.body.appendChild(footer);

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    allShows = await response.json();
    allShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    populateShowSelector(); // Initially populates with shows
    renderShows(allShows);
  } catch (err) {
    root.innerHTML = `<p>Error loading: ${err.message}</p>`;
  }

  showSearch.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allShows.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.genres.some(g => g.toLowerCase().includes(term)) ||
      s.summary.toLowerCase().includes(term)
    );
    renderShows(filtered);
    updateCount(filtered.length, allShows.length, "shows");
  });

  backBtn.addEventListener("click", () => {
    populateShowSelector(); // Switch selector back to shows
    renderShows(allShows);
  });

  // --- Updated Selector Logic (Requirement 2) ---
  showSelector.addEventListener("change", (e) => {
    const selectedId = e.target.value;
    const isEpisodeView = document.getElementById("episode-controls-wrapper").style.display === "block";

    if (isEpisodeView) {
      // If in episode view, the selector behaves as an episode scroller
      const selectedEp = currentEpisodes.filter(ep => ep.id == selectedId);
      renderEpisodes(selectedEp);
    } else {
      // If in show view, it loads the selected show's episodes
      loadEpisodes(selectedId);
    }
  });

  epSearch.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = currentEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(term) || ep.summary.toLowerCase().includes(term)
    );
    renderEpisodes(filtered);
    updateCount(filtered.length, currentEpisodes.length, "episodes");
  });
}

function renderShows(shows) {
  const root = document.getElementById("root");
  toggleView("shows");
  root.innerHTML = "";

  shows.forEach(show => {
    const card = document.createElement("section");
    card.className = "show-card";
    const img = show.image ? show.image.medium : "https://via.placeholder.com/210x295";

    card.innerHTML = `
      <img src="${img}" alt="${show.name}">
      <div class="show-content">
        <h2 class="show-title" style="cursor:pointer; color:blue; text-decoration:underline;">${show.name}</h2>
        <div class="summary">${show.summary}</div>
      </div>
      <div class="show-info-panel">
        <p><strong>Rating:</strong> ${show.rating.average || 'N/A'}</p>
        <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
        <p><strong>Status:</strong> ${show.status}</p>
        <p><strong>Runtime:</strong> ${show.runtime} min</p>
      </div>
    `;
    card.querySelector(".show-title").addEventListener("click", () => loadEpisodes(show.id));
    root.appendChild(card);
  });
  updateCount(shows.length, allShows.length, "shows");
}

async function loadEpisodes(showId) {
  if (!showId) return;
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;

  toggleView("episodes");

  if (showCache[url]) {
    currentEpisodes = showCache[url];
  } else {
    document.getElementById("root").innerHTML = "Loading...";
    const res = await fetch(url);
    const data = await res.json();
    showCache[url] = data;
    currentEpisodes = data;
  }

  populateEpisodeSelector(currentEpisodes); // Update dropdown to show episodes
  renderEpisodes(currentEpisodes);
}

function renderEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = "";
  episodes.forEach(ep => {
    const code = `S${String(ep.season).padStart(2, '0')}E${String(ep.number).padStart(2, '0')}`;
    const card = document.createElement("div");
    card.className = "show-card";
    card.innerHTML = `
      <img src="${ep.image ? ep.image.medium : ''}">
      <div class="show-content">
        <h3>${ep.name} - ${code}</h3>
        <div>${ep.summary || ''}</div>
      </div>
    `;
    root.appendChild(card);
  });
  updateCount(episodes.length, currentEpisodes.length, "episodes");
}

function toggleView(view) {
  const showWrap = document.getElementById("show-search-wrapper");
  const epWrap = document.getElementById("episode-controls-wrapper");
  const backBtn = document.getElementById("back-to-shows");

  if (view === "shows") {
    showWrap.style.display = "block";
    epWrap.style.display = "none";
    backBtn.style.display = "none";
  } else {
    showWrap.style.display = "none";
    epWrap.style.display = "block";
    backBtn.style.display = "inline-block";
  }
}

// Requirement 2: Populates selector with shows
function populateShowSelector() {
  const selector = document.getElementById("show-selector");
  selector.innerHTML = '<option value="">Select a Show...</option>';
  allShows.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    selector.appendChild(opt);
  });
}

// Requirement 2: Populates selector with episodes when in episode view
function populateEpisodeSelector(episodes) {
  const selector = document.getElementById("show-selector");
  selector.innerHTML = '<option value="">All Episodes</option>';
  episodes.forEach(ep => {
    const code = `S${String(ep.season).padStart(2, '0')}E${String(ep.number).padStart(2, '0')}`;
    const opt = document.createElement("option");
    opt.value = ep.id;
    opt.textContent = `${code} - ${ep.name}`;
    selector.appendChild(opt);
  });
}

function updateCount(found, total, type) {
  document.getElementById("search-count-display").innerText = `Found ${found}/${total} ${type}`;
}

window.onload = setup;