// Variable to store data after the initial fetch (Requirement 3)
let allEpisodesCache = [];

async function setup() {
  const rootElement = document.getElementById("root");
  const searchBox = document.getElementById("episode-search-input");

  // Requirement 4: Show loading state
  rootElement.innerHTML = `
    <div style="text-align:center; margin-top: 50px;">
      <p style="font-size: 1.5rem; color: #555;">Loading episodes...</p>
    </div>
  `;

  try {
    // Requirement 2: Fetch data from TVMaze API
    const apiResponse = await fetch("https://api.tvmaze.com/shows/82/episodes");

    // Check if the network request was successful
    if (!apiResponse.ok) {
      throw new Error(`Failed to load data (Status: ${apiResponse.status})`);
    }

    allEpisodesCache = await apiResponse.json();

    // Initial render
    renderEpisodes(allEpisodesCache);
    updateSearchCount(allEpisodesCache.length, allEpisodesCache.length);

  } catch (err) {
    // Requirement 5: Display error notification to the user
    rootElement.innerHTML = `
      <div style="text-align:center; margin-top: 50px; padding: 20px; border: 2px dashed red; background-color: #ffe6e6; border-radius: 10px;">
        <h2 style="color: darkred;">Error Loading Episodes</h2>
        <p>${err.message}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; border-radius: 5px; border: 1px solid #333;">Try Again</button>
      </div>
    `;
    return; // Exit setup if fetch fails
  }

  // Live Search Listener
  searchBox.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredEpisodes = allEpisodesCache.filter((episode) => {
      const episodeName = (episode.name || "").toLowerCase();
      const episodeSummary = (episode.summary || "").toLowerCase();

      return episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm);
    });

    renderEpisodes(filteredEpisodes);
    updateSearchCount(filteredEpisodes.length, allEpisodesCache.length);
  });
}

function updateSearchCount(matchCount, totalCount) {
  const countDisplay = document.getElementById("search-count-display");
  countDisplay.innerText = `Displaying ${matchCount} / ${totalCount} episodes`;
}

function renderEpisodes(episodesToDisplay) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";

  // Layout styling
  rootElement.style.display = "flex";
  rootElement.style.flexWrap = "wrap";
  rootElement.style.gap = "20px";
  rootElement.style.padding = "20px";
  rootElement.style.justifyContent = "center";

  // Handle case where search has zero matches
  if (episodesToDisplay.length === 0) {
    rootElement.innerHTML = "<p>No episodes match your current search. Wait for data to be uploaded</p>";
  }

  episodesToDisplay.forEach((episode) => {
    const seasonPadded = String(episode.season).padStart(2, "0");
    const numberPadded = String(episode.number).padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${numberPadded}`;

    const episodeCard = document.createElement("div");
    episodeCard.style.width = "250px";
    episodeCard.style.background = "#fff";
    episodeCard.style.padding = "10px";
    episodeCard.style.border = "1px solid #ccc";
    episodeCard.style.borderRadius = "8px";
    episodeCard.style.color = "black";

    // Use optional chaining for images in case they are missing
    const imageUrl = episode.image ? episode.image.medium : "https://via.placeholder.com/210x295?text=No+Image";

    episodeCard.innerHTML = `
      <div style="background:#eaeaea; padding:8px; border-radius:6px; font-weight:bold; text-align:center; margin-bottom:10px;">
        ${episodeCode} — ${episode.name}
      </div>
      <img src="${imageUrl}" alt="${episode.name}" style="width:100%; border-radius:6px;">
      <p>${episode.summary || "No summary available."}</p>
      <p><a href="${episode.url}" target="_blank">View on TVMaze</a></p>
    `;

    rootElement.appendChild(episodeCard);
  });

  const footerAttribution = document.createElement("p");
  footerAttribution.style.width = "100%";
  footerAttribution.style.textAlign = "center";
  footerAttribution.innerHTML = `Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>.`;
  rootElement.appendChild(footerAttribution);
}

window.onload = setup;