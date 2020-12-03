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
    var errorModal = document.querySelector('.modal')
    var instances = M.Modal.init(errorModal);
    var instance = M.Modal.getInstance(errorModal);
    instance.open();

    var modalTextEl = document.querySelector('.modal-content');
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
        columnEl.classList.add('col', 's12', 'm4');
        recipeCont.appendChild(columnEl);
    
        var cardEl = document.createElement('div');
        cardEl.classList.add('card');
        columnEl.appendChild(cardEl);

        var imgEl = document.createElement('div');
        imgEl.classList.add('card-image');
        cardEl.appendChild(imgEl);
    
        var recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', recipes[i].image);
        recipeImg.setAttribute('alt', recipes[i].title);
        imgEl.appendChild(recipeImg);

        var recipeTitle = document.createElement('span');
        recipeTitle.classList.add('card-title');   
        recipeTitle.textContent = recipes[i].title;
        imgEl.appendChild(recipeTitle);

        var cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.innerHTML = `<p>Recipe found at <a href="${recipes[i].sourceUrl}" target="_blank">${recipes[i].creditsText}</a></p>`;
        cardEl.appendChild(cardContent);
    }
}

searchBtn.addEventListener('click', getInput);