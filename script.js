const allEpisodes = getAllEpisodes();

function setup() {
  renderEpisodes(allEpisodes);
  renderAttribution();
}

function renderEpisodes(episodes) {
  const rootEl = document.getElementById("root");
  rootEl.textContent = "";

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

function renderAttribution() {
  const rootEl = document.getElementById("root");

  const attributionEl = document.createElement("p");
  attributionEl.className = "attribution";
  attributionEl.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>.';

  rootEl.appendChild(attributionEl);
}

window.addEventListener("load", setup);