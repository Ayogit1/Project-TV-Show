//You can edit ALL of the code here

const filmCard = document.createElement("section");

const title = document.createElement("h1");
const director = document.createElement("p");
director.textContent = film.director;
title.textContent = film.title;
filmCard.appendChild(title);
filmCard.appendChild(director);

document.body.appendChild(filmCard);


////////////////////
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
