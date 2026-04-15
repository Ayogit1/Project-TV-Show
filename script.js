const allEpisodes = getAllEpisodes();

function setup() {
  populateEpisodeSelector(allEpisodes);
  renderEpisodes(allEpisodes);
  setupFiltering();
}

function setupFiltering() {
  const searchInput = document.getElementById("search-input");
  const episodeSelect = document.getElementById("episode-select");

  searchInput.addEventListener("input", handleFilterChange);
  episodeSelect.addEventListener("change", handleFilterChange);
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