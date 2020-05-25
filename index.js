

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// VARIABLES
const magicalUnderlines = Array.from(
    document.querySelectorAll(".name-underline"));
const squares = Array.from(document.querySelectorAll(".portfolio-item"));


const gradientAPI =
    "https://raw.githubusercontent.com/karthikvetrivel/karthikvetrivel.com/master/assets/gradient.json";



// 1. Get random number in range. Used to get random index from array.
const randNumInRange = max => Math.floor(Math.random() * (max));

// 2. Merge two separate array values at the same index to
// be the same value in new array.
const mergeArrays = (arrOne, arrTwo) =>
    arrOne.map((item, i) => `${item} ${arrTwo[i]}`).join(", ");

// 3. Curried function to add a background to array of elms
const addBackground = elms => color => {
    elms.forEach(el => {
        el.style.backgroundImage = color;
    });
};
// 4. Function to get data from API
const getData = async url => {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
};


// 5. Partial Application of addBackground to always apply
// background to the magicalUnderlines constant
const addBackgroundToUnderlines = addBackground(magicalUnderlines);
const addBackgroundToSquares = addBackground(squares);

// GRADIENT FUNCTIONS

// 1. Build CSS formatted linear-gradient from API data
const buildGradient = (obj) =>
    `linear-gradient(${"90deg"}, ${mergeArrays(
        obj.colors,
        obj.positions)
    })`;

const num2 = randNumInRange(3);
// 2. Get single gradient from data pulled in array and
// apply single gradient to a callback function
const applyGradient = async (url, callback) => {
    const data = await getData(url);
    const num = data[num2];
    const gradient = buildGradient(num);
    callback(gradient);
};

// RESULT
applyGradient(gradientAPI, addBackgroundToUnderlines);
applyGradient(gradientAPI, addBackgroundToSquares);