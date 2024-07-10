const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const API_KEY = "56928d514d0242f5be34a7615b58eba6";

// Function to fetch recipes based on search query
const fetchData = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    // Check if the search results are already in local storage
    const storedSearchResults = localStorage.getItem(
      `recipeSearchResults_${query}`
    );
    if (storedSearchResults) {
      const recipes = JSON.parse(storedSearchResults);
      displayRecipes(recipes);
      return;
    }

    const data = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
    );

    // Check if the response is OK
    if (!data.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const response = await data.json();
    console.log(response);

    // Store the response in local storage
    localStorage.setItem(
      `recipeSearchResults_${query}`,
      JSON.stringify(response.results)
    );

    recipeContainer.innerHTML = "";
    if (response.results.length === 0) {
      recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
      return;
    }

    displayRecipes(response.results);
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in fetching recipes...</h2>";
    console.error(error);
  }
};

// Function to fetch random recipes
const fetchRandomRecipes = async () => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(
      `https://api.spoonacular.com/recipes/random?number=20&apiKey=${API_KEY}`
    );

    if (!data.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const response = await data.json();
    console.log(response);

    recipeContainer.innerHTML = "";
    if (response.recipes.length === 0) {
      recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
      return;
    }

    displayRecipes(response.recipes);
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in fetching recipes...</h2>";
    console.error(error);
  }
};

// Function to display recipes
const displayRecipes = (recipes) => {
  recipeContainer.innerHTML = ""; // Clear previous content
  recipes.forEach((recipe) => {
    const { id, title, image } = recipe;
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <a href="recipe.html?id=${id}">
        <img style="width: 100%; height: 200px;" src="${image}" alt="${title}" />
        <h4>${title}</h4>
      </a>
      `;
    const button = document.createElement("button");
    button.textContent = "View Recipe";
    card.appendChild(button);
    button.addEventListener("click", () => {
      openRecipePopup(id);
    });
    recipeContainer.appendChild(card);
  });
};

// Function to fetch recipe details
const fetchRecipeDetails = async (recipeId) => {
  const data = await fetch(
    `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
  );
  const response = await data.json();
  return response;
};

// Function to open recipe popup
const openRecipePopup = async (recipeId) => {
  const recipeDetails = await fetchRecipeDetails(recipeId);

  let ingredientsList = "";
  recipeDetails.extendedIngredients.forEach((ingredient) => {
    ingredientsList += `<li>${ingredient.original}</li>`;
  });

  let instructions = "";
  recipeDetails.analyzedInstructions[0].steps.forEach((step) => {
    instructions += `<li>${step.step}</li>`;
  });

  recipeDetailsContent.innerHTML = `
    <h2 class="recipe-title">${recipeDetails.title}</h2>
    <img class="recipe-image" src="${recipeDetails.image}" alt="${recipeDetails.title}"/>
    <h3>Ingredients:</h3>
    <ul class="recipe-ingredients">${ingredientsList}</ul>
    <h3>Instructions:</h3>
    <ol class="recipe-instructions">${instructions}</ol>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

// Close recipe popup
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Search button event listener
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchData(searchInput);
  } else {
    fetchRandomRecipes();
  }
});

// Always fetch random recipes on page load
window.addEventListener("load", () => {
  fetchRandomRecipes();
});
