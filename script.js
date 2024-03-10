//CREATE REFERENCES TO MANIPULATE CORRESPONDING HTML ELEMENTS OR RETRIEVE THEIR PROPERTIES
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
// USED TO TRACK WHETHER AN ERROR HAS OCCURRED IN THE PROGRAM
let isError = false;

// REMOVES +/-/WHITESPACE FROM STRING
function cleanInputString(str) {
  //REGEX = REGULAR EXPRESSION OBJECT 
  const regex = /[+-\s]/g;
  //\s - WHITESPACE, \g - GLOBAL FLAG
  return str.replace(regex, '');
}

function isInvalidInput(str) {
  //i-MAKES MATCHING CASE-INSENSITIVE
  const regex = /\d+e\d+/i;
  //RETURN ARRAY
  return str.match(regex);
}

//HANDLE ADDING NEW ENTRIES TO THE CALORIE COUNTER BASED ON USER INPUT
function addEntry() {
  //HOOKING TO SPECIFIC INPUT SECTION, BY CONNECTING ID AND CLASS CONTAINER
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  //+1 BECAUSE WE WANT TO GET "Entry 1 Name", WITHOUT THAT WE WOULD GET "Entry 0 Name"
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  //INSERTS THE HTML CONTENT REPRESENTED BY 'HTMLString' INTO THE DOM, SPECIFICALLY JUST BEFORE THE END OF 'targetInputContainer'
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function calculateCalories(e) {
  //PREVENT THE DEFAULT ACTION ASSOCIATED WITH THE EVENT, OVERRIDING THE DEFAULT BEHAVIOR
  e.preventDefault();
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

//CALCULATE THE TOTAL CALORIES FROM A LIST OF INPUT VALUES
function getCaloriesFromInputs(list) {
  let calories = 0;
  //FOR .. OF LOOP
  for (const item of list) {
    //CLEANING THE VALUE AND STORING IN VARIABLE currVal
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);
    //IF invalidInputMatch IS TRUTHY
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
