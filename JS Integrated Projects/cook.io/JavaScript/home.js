"use strict";

/*
 * Import
 */

import { fetchData } from "../JavaScript/api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

/* Home Page Search */

const $searchField = document.querySelector("[data-search-field]");
const $searchBtn = document.querySelector("[data-search-btn]");

$searchBtn.addEventListener("click", function () {
  if ($searchField.value)
    window.location = `../HTML/recipes.html?q=${$searchField.value}`;
});

$searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $searchBtn.click();
});

/* Tab Panel Navigation */

const $tabBtns = document.querySelectorAll("[data-tab-btn]");
const $tabPanels = document.querySelectorAll("[data-tab-panel]");

let [$lastActiveTabPanel] = $tabPanels;
let [$lastActiveTabBtn] = $tabBtns;

addEventOnElements($tabBtns, "click", function () {
  $lastActiveTabPanel.setAttribute("hidden", "");
  $lastActiveTabBtn.setAttribute("aria-selected", false);
  $lastActiveTabBtn.setAttribute("tabindex", -1);
  const $currentTabPanel = document.querySelector(
    `#${this.getAttribute("aria-controls")}`
  );
  $currentTabPanel.removeAttribute("hidden");
  this.setAttribute("aria-selected", true);
  this.setAttribute("tabindex", 0);
  $lastActiveTabPanel = $currentTabPanel;
  $lastActiveTabBtn = this;

  addTabContent(this, $currentTabPanel);
});

/* Navigate Tab with Arrow keys */

addEventOnElements($tabBtns, "keydown", function (e) {
  const $nextElement = this.nextElementSibling;
  const $previousElement = this.previousElementSibling;

  if (e.key === "ArrowRight" && $nextElement) {
    this.setAttribute("tabindex", -1);
    $nextElement.setAttribute("tabindex", 0);
    $nextElement.focus();
  } else if (e.key === "ArrowLeft" && $previousElement) {
    this.setAttribute("tabindex", -1);
    $previousElement.setAttribute("tabindex", 0);
    $previousElement.focus();
  } else if (e.key === "Tab") {
    this.setAttribute("tabindex", -1);
    $lastActiveTabBtn.setAttribute("tabindex", 0);
  }
});

// WORK WITH API

/*
 * fetch data for tab content
 */

const addTabContent = ($currentTabBtn, $currentTabPanel) => {
  const $gridList = document.createElement("div");
  $gridList.classList.add("grid-list");

  $currentTabPanel.innerHTML = `
    <div class="grid-list">
      ${$skeletonCard.repeat(12)}
    </div>
  `;

  fetchData(
    [
      ["mealType", $currentTabBtn.textContent.trim().toLowerCase()],
      ...cardQueries,
    ],
    function (data) {
      console.log(data);
      $currentTabPanel.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = data.hits[i];

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

        const $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * i}ms`;

        $card.innerHTML = `
        <figure class="card-media img-holder">
          <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
        </figure>
                                
        <div class="card-body">
          <h3 class="title-small">
            <a href="../HTML/detail.html?recipe=${recipeId}" class="card-link">${
          title ?? "Untitled"
        }</a>
          </h3>

          <div class="meta-wrapper">
            <div class="meta-item">
              <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
              <span class="label-medium">${getTime(cookingTime).time || "<1"} ${
          getTime(cookingTime).timeUnit
        }</span>
            </div>

            <button class="icon-btn has-state ${
              isSaved ? "saved" : "removed"
            }" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">                                 
              <span class="material-symbols-outlined bookmark-add" aria-hidden="true">              
                bookmark_add                
              </span>              
              <span class="material-symbols-outlined bookmark" aria-hidden="true">                     
                bookmark              
              </span>                         
            </button>
          </div>
        </div>
      `;

        $gridList.appendChild($card);
      }

      $currentTabPanel.appendChild($gridList);
      $currentTabPanel.innerHTML += `
        <a href="../HTML/recipes.html?mealType=${$currentTabBtn.textContent
          .trim()
          .toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
      `;
    }
  );
};
addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

/*
 * fetch data for slider card
 */

let cuisineType = ["Asian", "French"];
const $sliderSections = document.querySelectorAll("[data-slider-section]");

for (const [index, $sliderSection] of $sliderSections.entries()) {
  $sliderSection.innerHTML = `
    <div class="container">
      <h2 class="section-title headline-small" id="slider-label-1">Latest ${
        cuisineType[index]
      } Recipes</h2>

      <div class="slider">
        <ul class="slider-wrapper" data-slider-wrapper>
          ${`<li class="slider-item">${$skeletonCard}</li>`.repeat(10)}
        </ul>
      </div>
    </div>
  `;
  const $sliderWrapper = $sliderSection.querySelector("[data-slider-wrapper]");

  fetchData(
    [...cardQueries, ["cuisineType", cuisineType[index]]],
    function (data) {
      $sliderWrapper.innerHTML = "";
      data.hits.map((item) => {
        const {
          recipe: { image, label: title, totalTime: cookingTime, uri },
        } = item;

        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);
        const $sliderItem = document.createElement("li");

        $sliderItem.classList.add("slider-item");
        $sliderItem.innerHTML=`
          <div class="card">
            <figure class="card-media img-holder">
              <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
            </figure>
                                  
          <div class="card-body">
            <h3 class="title-small">
              <a href="../HTML/detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
            </h3>

            <div class="meta-wrapper">
              <div class="meta-item">
                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
              </div>

              <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">                                 
                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">              
                  bookmark_add                
                </span>              
                <span class="material-symbols-outlined bookmark" aria-hidden="true">                     
                  bookmark              
                </span>                         
              </button>
            </div>
          </div>
        </div>
        `;
        $sliderWrapper.appendChild($sliderItem);
      });
      $sliderWrapper.innerHTML+=`
        <li class="slider-item" data-slider-item>
          <a href="../HTML/recipes.html?cuisineType=${cuisineType[index].toLocaleLowerCase()}" class="load-more-card has-state">
            <span class="label-large">Show more</span>
            <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
          </a>
        </li>
      `;
    }
  );
}
