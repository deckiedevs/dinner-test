const searchBtn = document.getElementById('search-btn');
const searchTab = document.getElementById('search-tab');
const recipesTab = document.getElementById('recipes-tab');
const favoritesTab = document.getElementById('recipes-tab');
const formCont = document.getElementById('form-container');
const recipeCont = document.getElementById('recipe-container');
const apiKey = ''

var getInput = function(event) {
    event.preventDefault();
    
    var cuisineInput = document.getElementById('cuisine-menu').value;
    var dietInput = document.getElementById('diet-menu').value;

    var ingrInput = document.getElementById('ingredients')
        .value
        .trim()
        .toLowerCase();
    var ingrArr = [];
    if (ingrInput) {
        ingrArr.push(ingrInput.replace(/,/g, '').split(' '));
    };

    var restrInput = document.querySelectorAll('input[name="restriction"]:checked');
    var restrArr = [];
    restrInput.forEach((checkbox) => {
        restrArr.push(checkbox.value);
    });

    getData(cuisineInput, dietInput, ingrArr, restrArr);
};

var getData = function(cuisine, diet, ingr, restr) {

    var apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`
    var paraName = ['cuisine', 'diet', 'includeIngredients', 'intolerances'];
    var paraValue = [cuisine, diet, ingr, restr];

    // concatenates search parameters
    for (let i = 0; i < paraValue.length; i++) {
        if (paraValue[i].length > 0) {
            apiUrl += `&${paraName[i]}=${paraValue[i]}`
        }
    }

    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {

                if (data.results.length > 0) {
                    getRecipe(data);
                } else {
                    alert(`No recipes found!`) // switch to modals, enter fewer search parameters
                }
            });
        } else {
            alert(`Error: ${response.statusText}`) // switch to modals later
        }
    })
    .catch(function(error) {
        alert('Unable to load recipes.'); // switch to modals later
    });
};

var getRecipe = function(recipe) {

    var idArr = [];
    for (i = 0; i < recipe.results.length; i++) {
        idArr.push(recipe.results[i].id);
    };

    var recipeUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${apiKey}&ids=${idArr.join()}`;    
    fetch(recipeUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                displayRecipes(data);
            })
        } 
    })
}

var displayRecipes = function(recipes) {
    searchTab.classList.remove('is-active', 'active-tab');
    favoritesTab.classList.remove('is-active', 'active-tab');
    recipesTab.classList.add('is-active', 'active-tab');

    formCont.classList.add('hide');
    recipeCont.classList.remove('hide');
}

searchBtn.addEventListener('click', getInput)