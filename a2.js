// Get references to HTML elements
const searchinput = document.getElementById("bar");
const searchbutton = document.getElementById("searchbutton");
const recipescontainer = document.getElementById("recipescontainer");

// Get references to modal elements
const recipeDetailsModal = document.getElementById('recipeDetailsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalDetails = document.getElementById('modalDetails');


// Event listener for the search button
searchbutton.addEventListener('click', () => {
    const searchTerm = searchinput.value;
    searchrecipes(searchTerm);
});


// Function to fetch recipes from the main search API
async function fetchrecipes(query) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return null;
    }
}


// Function to fetch details for a single recipe
async function fetchRecipeDetails(mealId) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        return null;
    }
}


// Function to handle the search logic and display the results
async function searchrecipes(query) {
    recipescontainer.innerHTML = ''; // Clear container before new search

    if (query === '') {
        recipescontainer.innerHTML = '<h2>Please enter a search term.</h2>';
        return;
    }

    recipescontainer.innerHTML = '<h2>Loading recipes...</h2>';

    const recipes = await fetchrecipes(query);

    if (recipes) {
        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <div class="recipe-details">
                    <h3>${recipe.strMeal}</h3>
                    <button class="view-recipe-btn" data-mealid="${recipe.idMeal}">View Recipe</button>
                </div>
            `;
            recipescontainer.appendChild(card);
        });
    } else {
        recipescontainer.innerHTML = `<h2>No recipes found for "${query}".</h2>`;
    }
}


// Function to display the modal with recipe details
function displayModal(recipe) {
    modalDetails.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h2>${recipe.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredientsList(recipe)}
        </ul>
        <h3>Instructions:</h3>
        <p>${recipe.strInstructions}</p>
    `;
    recipeDetailsModal.style.display = 'flex'; // Show the modal
}


// Helper function to dynamically create the ingredients list
function getIngredientsList(recipe) {
    let list = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            list += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return list;
}


// Event listener for clicks inside the recipes container (Event Delegation)
recipescontainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('view-recipe-btn')) {
        const mealId = event.target.dataset.mealid;
        const recipe = await fetchRecipeDetails(mealId);
        if (recipe) {
            displayModal(recipe);
        }
    }
});


// Event listener for closing the modal
closeModalBtn.addEventListener('click', () => {
    recipeDetailsModal.style.display = 'none';
});


// Optional: Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === recipeDetailsModal) {
        recipeDetailsModal.style.display = 'none';
    }
});