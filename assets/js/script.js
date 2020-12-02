const searchTab = document.getElementById('search-tab');
const recipesTab = document.getElementById('recipes-tab');
const favoritesTab = document.getElementById('recipes-tab');
const formCont = document.getElementById('form-container');
const recipeCont = document.getElementById('recipe-container');
const searchBtn = document.getElementById('search-btn');
const recipeColumns = document.getElementById('recipe-columns');
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
    console.log(message)
    modalTextEl.textContent = message;
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
                console.log(data)
                displayRecipes(data);
            })
        } 
    })
}

var displayRecipes = function(recipes) {
    formCont.classList.add('hide');
    recipeCont.classList.remove('hide');

    // creates recipe card
    for (let i = 0; i < 9; i++) {
        var columnEl = document.createElement('div');
        columnEl.classList.add('column', 'is-one-third', 'is-flex');
        recipeColumns.appendChild(columnEl);
    
        var cardEl = document.createElement('div');
        cardEl.classList.add('card');
        columnEl.appendChild(cardEl);

        var figureEl = document.createElement('figure');
        figureEl.classList.add('card-image', 'image', 'is-4by3');
        cardEl.appendChild(figureEl);
    
        var recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', recipes[i].image);
        recipeImg.setAttribute('alt', recipes[i].title);
        figureEl.appendChild(recipeImg);

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardEl.appendChild(cardContent);

        var recipeTitle = document.createElement('div');
        recipeTitle.classList.add('title', 'is-4');   
        recipeTitle.innerHTML = `<p>${recipes[i].title}</p>`;
        cardContent.appendChild(recipeTitle);

        var recipeDesc = document.createElement('div');
        recipeDesc.classList.add('content');
        recipeDesc.innerHTML = `Recipe found at <a href="${recipes[i].sourceUrl}" target="_blank">${recipes[i].creditsText}</a>`;
        cardContent.appendChild(recipeDesc);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });

searchBtn.addEventListener('click', getInput);