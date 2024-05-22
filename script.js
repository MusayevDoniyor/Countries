import { showSpinner, hideSpinner } from "./utils.js";

const main = document.querySelector(".container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageInfo = document.getElementById("page-info");
const searchInput = document.getElementById("search");

const countriesPerPage = 12;
let currentPage = 1;
let countries = [];
let filteredCountries = [];

async function fetchCountries() {
  showSpinner();

  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const result = await response.json();

    countries = result;
    filteredCountries = countries;
    displayCountries();
  } catch (error) {
    console.error("Error fetching countries", error);
  } finally {
    hideSpinner();
  }
}

function displayCountries() {
  main.innerHTML = "";
  const start = (currentPage - 1) * countriesPerPage;
  const end = start + countriesPerPage;
  const paginatedCountries = filteredCountries.slice(start, end);

  paginatedCountries.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("card");

    const countryImg = document.createElement("img");
    countryImg.src = country.flags.svg;
    countryImg.alt = country.flags.alt;

    const countryName = document.createElement("h2");
    countryName.textContent = country.name.common;

    const countryCapital = document.createElement("p");
    countryCapital.textContent = country.capital;

    countryCard.append(countryImg);
    countryCard.append(countryName);
    countryCard.append(countryCapital);
    main.append(countryCard);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(
    filteredCountries.length / countriesPerPage
  )}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled =
    currentPage === Math.ceil(filteredCountries.length / countriesPerPage);
}

searchInput.addEventListener("input", () => {
  showSpinner();
  const searchValue = searchInput.value.toLowerCase();
  filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );
  currentPage = 1;
  displayCountries();
  hideSpinner();
});

prevButton.addEventListener("click", () => {
  currentPage--;
  displayCountries();
});

nextButton.addEventListener("click", () => {
  currentPage++;
  displayCountries();
});

fetchCountries();
