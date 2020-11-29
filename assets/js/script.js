const searchTab = document.getElementById('search-tab');
const recipesTab = document.getElementById('recipes-tab');
const favoritesTab = document.getElementById('recipes-tab');
const formCont = document.getElementById('form-container');
const recipeCont = document.getElementById('recipe-container');
const searchBtn = document.getElementById('search-btn');
const apiKey = '';

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
                    errorMsg(`No recipes found!  Try using fewer search parameters.`)
                }
            });
        } else {
            errorMsg(`Error: ${response.statusText}`);
        }
    })
    .catch(function(error) {
        errorMsg('Unable to load recipes.  Please try again later.');
    });
};

var errorMsg = function(message) {
    var modalEl = document.querySelector('.modal');
    var modalTextEl = document.querySelector('.modal-content');
    var modalBg = document.querySelector('.modal-background');
    var modalBtn = document.getElementById('modal-btn'); 

    modalEl.classList.add('is-active');
    modalTextEl.textContent = message;

    closeModal = event => {
        event.preventDefault();
        modalEl.classList.remove('is-active')
    }

    modalBg.addEventListener('click', closeModal);
    modalBtn.addEventListener('click', closeModal);
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

searchBtn.addEventListener('click', getInput);