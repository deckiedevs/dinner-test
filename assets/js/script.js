const searchTab = document.getElementById('search-tab');
const recipesTab = document.getElementById('recipes-tab');
const favoritesTab = document.getElementById('recipes-tab');
const formCont = document.getElementById('form-container');
const recipeCont = document.getElementById('recipe-container');
const searchBtn = document.getElementById('search-btn');
const favBtn = document.getElementById('fav-btn');
const favIcon = document.getElementById('fav-icon');
let favRecipes = [];
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

    var apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=9`
    var paraName = ['cuisine', 'diet', 'includeIngredients', 'intolerances'];
    var paraValue = [cuisine, diet, ingr, restr];

    // concatenates search parameters
    for (let i = 0; i < paraValue.length; i++) {
        if (paraValue[i].length > 0) {
            apiUrl += `&${paraName[i]}=${paraValue[i]}`;
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
            errorMsg(`Error: ${response.status}`);
        }
    })
    .catch(function(error) {
        errorMsg('Unable to load recipes.  Please try again later.');
    });
};

var errorMsg = function(message) {
    var errorModal = document.getElementById('error-modal')
    var instances = M.Modal.init(errorModal);
    var instance = M.Modal.getInstance(errorModal);
    instance.open();

    var modalTextEl = document.getElementById('error-message');
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
            });
        };
    });
};

var displayRecipes = function(recipes) {
    formCont.classList.add('hide');
    recipeCont.classList.remove('hide');

    for (let i = 0; i < recipes.length; i++) {
        // creates displayed cards
        var modalTrigger = document.createElement('a');
        modalTrigger.classList.add('recipe-link', 'modal-trigger')
        modalTrigger.setAttribute('href', `#recipe-modal`);
        recipeCont.appendChild(modalTrigger); 

        var columnEl = document.createElement('div');
        columnEl.classList.add('col', 's12', 'm4');
        modalTrigger.appendChild(columnEl);
    
        var cardEl = document.createElement('div');
        cardEl.classList.add('card', 'recipe-card');
        cardEl.setAttribute('id', `card-${i}`);
        columnEl.appendChild(cardEl);

        var imgEl = document.createElement('div');
        imgEl.classList.add('card-image');
        cardEl.appendChild(imgEl);
    
        var recipeImg = document.createElement('img');
        recipeImg.setAttribute('src', recipes[i].image);
        recipeImg.setAttribute('alt', recipes[i].title);
        imgEl.appendChild(recipeImg);

        var recipeTitle = document.createElement('div');
        recipeTitle.classList.add('card-content');   
        recipeTitle.textContent = recipes[i].title;
        cardEl.appendChild(recipeTitle);

    }

    fullRecipe(recipes);
}

var fullRecipe = function(details) {
    var recipeHeader = document.getElementById('recipe-header');
    var recipeInfoEl = document.getElementById('recipe-info');
    var recipeCards = document.querySelectorAll('.recipe-card');
    var colOne = document.getElementById('recipes-col-1');
    var colTwo = document.getElementById('recipes-col-2');
    var instructions = document.getElementById('instructions');
    var wineHeader = document.getElementById('wine-header')
    var winePairingEl = document.getElementById('wine-pairing');

    for (var i = 0; i < recipeCards.length; i++) {
        recipeCards[i].addEventListener('click', function(event) {

            // clears previous recipe from modal
            colOne.textContent = '';
            colTwo.textContent = '';

            // gets index of clicked card
            var index = this.getAttribute('id').replace('card-', '');

            // header information
            recipeHeader.textContent = details[index].title;
            var readyTime = details[index].readyInMinutes;
            var servings = details[index].servings;
            var sourceSite = details[index].sourceName;
            var sourceUrl = details[index].sourceUrl;

            recipeInfoEl.innerHTML = `Prep Time: ${readyTime} | Servings: ${servings} | Recipe From: <a href="${sourceUrl}" target="_blank">${sourceSite}</a>`

            // favorite button status
            if (favRecipes.indexOf(details[index].id) === -1) {
                console.log(details[index].id)
                console.log(favRecipes.indexOf(details[index].id))
                favIcon.textContent = 'favorite_border';
            } else {
                favIcon.textContent = 'favorite';
            }

            // sets recipe ID as data value for save feature
            favBtn.setAttribute('data-id', details[index].id);

            // grabs all ingredients from data
            var ingrList = details[index].extendedIngredients;

            for (var j = 0; j < ingrList.length; j++) {
                var ingrQty = ingrList[j].measures.us.amount;
                var ingrUnit = ingrList[j].measures.us.unitShort;
                var ingrName = ingrList[j].name;

                // converts decimals into fractions
                if (!Number.isInteger(ingrQty)) {
                    ingrQty = convertFraction(ingrQty).trim();
                }

                var ingrItem = document.createElement('p');
                ingrItem.textContent = `${ingrQty} ${ingrUnit} - ${ingrName}`;

                // alternates columns for ingredients
                if (j % 2 === 0) {
                    colOne.appendChild(ingrItem);
                } else {
                    colTwo.appendChild(ingrItem);
                }

                // recipe instructions
                instructions.innerHTML = details[index].instructions;

                // suggested wine pairing
                var winePairing = details[index].winePairing.pairingText;

                if (winePairing) { 
                    wineHeader.classList.remove('hide');
                    winePairingEl.textContent = winePairing;
                }
            }
        })
    }
}

convertFraction = num => {
    var fractionObj = math.fraction(num);
    var numerator = fractionObj.n;
    var denominator = fractionObj.d;
    var wholeNum = '';

    // converts improper fraction to mixed fraction
    if (numerator > denominator) {
        wholeNum = `${Math.floor(numerator / denominator)} `;
        numerator %= denominator
    }

    // identifies when the fraction is a third
    if (numerator === 333) {
        numerator = 1;
        denominator = 3;
    } else if (numerator === 666) {
        numerator = 2;
        denominator = 3;
    }
    
    return `${wholeNum}${numerator}/${denominator}`
};

var saveFavorite = function(event) {

    var recipeId = this.getAttribute('data-id');

    // if recipe is not already a favorite, add to favorites
    if (favRecipes.indexOf(recipeId) === -1) {
        favRecipes.push(recipeId);
        favIcon.textContent = "favorite";

        localStorage.setItem('favorites', JSON.stringify(favRecipes));
    } 
    // recipe is already a favorite, remove from favorites
    else {
        favRecipes.splice(favRecipes.indexOf(recipeId), 1);
        favIcon.textContent = "favorite_border";
        
        localStorage.setItem('favorites', JSON.stringify(favRecipes));
    };
};

loadFavorites = () => {
    favRecipes = JSON.parse(localStorage.getItem('favorites'));

    if (!favRecipes) { 
        favRecipes = [];
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems);

    var selectElems = document.querySelectorAll('select');
    var selectInstances = M.FormSelect.init(selectElems);
});

loadFavorites();

searchBtn.addEventListener('click', getInput);
favBtn.addEventListener('click', saveFavorite);