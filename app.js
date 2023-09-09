"use strict";
const btn = document.querySelector(".btn-whereami");
const container = document.querySelector(".container");
const countries = document.querySelector(".countries");
const loader = document.querySelector(".loader");
btn.addEventListener("click", whereami);

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).catch((err) => console.error(err));
}

function whereami() {
  loader.style.display = "block";
  btn.style.display = "none";
  getPosition()
    .then((position) => {
      console.log(position);
      if (!position) {
        throw new Error(`Problem with getting location data!`);
      }
      const { latitude, longitude } = position.coords;

      return fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=262a1338319f4760aa26233b1773e815`
      )
        .then((response) => {
          return response.json();
        })
        .then((a) => getCountryData(a.features[0].properties.country));
    })
    .catch((err) => {
      container.append(err);
      loader.style.display = "none";
    });
}

async function getCountryData(pos) {
  try {
    const data = await fetch(`https://restcountries.com/v3.1/name/${pos}`);
    const dataj = await data.json();
    renderCountry(dataj);
  } catch (err) {
    console.log(err);
  }
}

function renderCountry(country) {
  const html = `<div class="country">
  <img class="country__img" src="${country[0].flags.png}"/>
  <div class="country_data">
      <h3 class="country_name">${country[0].name.official}</h2>
      <h3 class="country_region">${country[0].region}</h2>
    <p class="country_row"><span>👫</span>${(
      country[0].population / 1000000
    ).toFixed(1)} M people</h3>
    <p class="country_row"><span>💬</span>${Object.values(
      country[0].languages
    )} </h3>
    <p class="country_row"><span>💰</span>${
      Object.values(country[0].currencies)[0].name
    }</h3>
    </div>
    </div>`;
  countries.insertAdjacentHTML("beforeend", html);
  loader.style.display = "none";
  countries.style.opacity = 1;
}
