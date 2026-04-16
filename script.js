let allEpisodes = [];
let allShows = [];
const episodeCache = {};

function setup() {
  setupFiltering();
  setupShowSelector();
  loadShows();
}

function setupFiltering() {
  const searchInput = document.getElementById("search-input");
  const episodeSelect = document.getElementById("episode-select");

  searchInput.addEventListener("input", handleFilterChange);
  episodeSelect.addEventListener("change", handleFilterChange);
}

function setupShowSelector() {
  const showSelect = document.getElementById("show-select");
  showSelect.addEventListener("change", handleShowChange);
}

async function loadShows() {
  try {
    allShows = await fetchShows();
    populateShowSelector(allShows);
  } catch (error) {
    console.error("Failed to load shows", error);
  }
}

async function fetchShows() {
  const response = await fetch("https://api.tvmaze.com/shows");

  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }

  const shows = await response.json();

  return shows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

async function fetchEpisodesForShow(showId) {
  if (episodeCache[showId]) {
    return episodeCache[showId];
  }

  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);

  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }

  const episodes = await response.json();
  episodeCache[showId] = episodes;

  return episodes;
}

function populateShowSelector(shows) {
  const showSelect = document.getElementById("show-select");
  showSelect.innerHTML = '<option value="">Select a show</option>';

  shows.forEach((show) => {
    const optionEl = document.createElement("option");
    optionEl.value = show.id;
    optionEl.textContent = show.name;
    showSelect.appendChild(optionEl);
  });
}

async function handleShowChange() {
  const showSelect = document.getElementById("show-select");
  const episodeSelect = document.getElementById("episode-select");
  const searchInput = document.getElementById("search-input");

  const showId = showSelect.value;

  if (!showId) {
    allEpisodes = [];
    searchInput.value = "";
    episodeSelect.innerHTML = '<option value="all">All Episodes</option>';
    renderEpisodes([]);
    return;
  }

  try {
    allEpisodes = await fetchEpisodesForShow(showId);

    searchInput.value = "";
    episodeSelect.innerHTML = '<option value="all">All Episodes</option>';

    populateEpisodeSelector(allEpisodes);
    renderEpisodes(allEpisodes);
  } catch (error) {
    console.error("Failed to load episodes", error);
  }
}

function handleFilterChange() {
  const searchInput = document.getElementById("search-input");
  const episodeSelect = document.getElementById("episode-select");

  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedEpisodeCode = episodeSelect.value;

  let filteredEpisodes = allEpisodes;

  if (selectedEpisodeCode !== "all") {
    filteredEpisodes = filteredEpisodes.filter((episode) => {
      return getEpisodeCode(episode) === selectedEpisodeCode;
    });
  }

  if (searchTerm !== "") {
    filteredEpisodes = filteredEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = stripHtmlTags(episode.summary || "")
        .toLowerCase()
        .includes(searchTerm);

      return nameMatch || summaryMatch;
    });
  }

  renderEpisodes(filteredEpisodes);
}

function populateEpisodeSelector(episodes) {
  const episodeSelect = document.getElementById("episode-select");

  episodes.forEach((episode) => {
    const optionEl = document.createElement("option");
    optionEl.value = getEpisodeCode(episode);
    optionEl.textContent = `${getEpisodeCode(episode)} - ${episode.name}`;
    episodeSelect.appendChild(optionEl);
  });
}

function renderEpisodes(episodes) {
  const rootEl = document.getElementById("root");
  const episodeCountEl = document.getElementById("episode-count");

  rootEl.textContent = "";
  episodeCountEl.textContent = `Displaying ${episodes.length} / ${allEpisodes.length} episodes`;

  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    rootEl.appendChild(episodeCard);
  });
}

function createEpisodeCard(episode) {
  const episodeCode = getEpisodeCode(episode);

  const cardEl = document.createElement("div");
  cardEl.className = "episode-card";

  const titleEl = document.createElement("h3");
  titleEl.className = "episode-title";
  titleEl.textContent = `${episodeCode} - ${episode.name}`;

  const imageEl = document.createElement("img");
  imageEl.className = "episode-image";
  imageEl.src = episode.image?.medium || "";
  imageEl.alt = episode.name;

  const summaryEl = document.createElement("p");
  summaryEl.className = "episode-summary";
  summaryEl.innerHTML = episode.summary;

  const linkEl = document.createElement("a");
  linkEl.className = "episode-link";
  linkEl.href = episode.url;
  linkEl.target = "_blank";
  linkEl.rel = "noopener noreferrer";
  linkEl.textContent = "View on TVMaze";

  cardEl.appendChild(titleEl);
  cardEl.appendChild(imageEl);
  cardEl.appendChild(summaryEl);
  cardEl.appendChild(linkEl);

  return cardEl;
}

function getEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function stripHtmlTags(htmlString) {
  const tempEl = document.createElement("div");
  tempEl.innerHTML = htmlString;
  return tempEl.textContent || "";
}

window.addEventListener("load", setup);