//You can edit ALL of the code here

const filmCard = document.createElement("section");

const title = document.createElement("h1");
const director = document.createElement("p");
director.textContent = film.director;
title.textContent = film.title;
filmCard.appendChild(title);
filmCard.appendChild(director);

document.body.appendChild(filmCard);