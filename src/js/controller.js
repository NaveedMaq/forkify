import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update the search results
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1 Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2 Load Search Results
    await model.loadSearchResults(query);

    // 3) Render Search Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥 💥 💥 💥 `);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW Search Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  // ADD or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // Upload new recipe data
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥 ', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddbookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
