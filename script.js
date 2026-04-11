function setup() {
  const episodes = getAllEpisodes();
  renderEpisodes(episodes);
}

function renderEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  // Layout styling (no CSS file needed)
  root.style.display = "flex";
  root.style.flexWrap = "wrap";
  root.style.gap = "20px";
  root.style.padding = "20px";
  root.style.color = "black"; // make all text black

  episodes.forEach(ep => {
    const season = String(ep.season).padStart(2, "0");
    const number = String(ep.number).padStart(2, "0");
    const code = `S${season}E${number}`;

    const card = document.createElement("div");
    card.style.width = "250px";
    card.style.background = "#fff";
    card.style.padding = "10px";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    card.style.color = "black";

    card.innerHTML = `
  <div style="
    background:#eaeaea;
    padding:8px;
    border-radius:6px;
    font-weight:bold;
    text-align:center;
    margin-bottom:10px;
  ">
    ${code} — ${ep.name}
  </div>

  <img src="${ep.image?.medium}" alt="${ep.name}" style="width:100%; border-radius:6px;">
  <p>${ep.summary}</p>
  <p><a href="${ep.url}" target="_blank">View on TVMaze</a></p>
`;

    root.appendChild(card);
  });

  const attribution = document.createElement("p");
  attribution.innerHTML = `
    Data originally from 
    <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>.
  `;
  root.appendChild(attribution);
}

window.onload = setup;
