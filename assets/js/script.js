const searchBtn = document.getElementById('search-btn');

var getInput = function(event) {
    event.preventDefault();
    
    var cuisineInput = document.getElementById('cuisine-menu').value;
    var proteinInput = document.getElementById('protein-menu').value;
    var dietInput = document.getElementById('diet-menu').value;

    var ingredientsInput = document.getElementById('ingredients').value.trim().toLowerCase();
    var ingredientsArr = ingredientsInput.replace(/,/g, '').split(' ');

    var restrictionsInput = document.querySelectorAll('input[name="restriction"]:checked');
    var restrictionsArr = [];

    restrictionsInput.forEach((checkbox) => {
        restrictionsArr.push(checkbox.value);
    });

};

searchBtn.addEventListener('click', getInput)