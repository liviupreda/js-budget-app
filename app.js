// -- BUDGET DATA CONTROLLER
const dataController = (function() {
  // Store inc and exp in two arrays, part of the allItems object
  let allData = {
    allItems: {
      exp: [],
      inc: []
    },
    // Total inc and exp amounts, shown at the top of the page
    totalAmounts: {
      exp: 0,
      inc: 0
    }
  };

  // Expense function constructor
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income function constructor
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
})();

// -- UI CONTROLLER
const UIController = (function() {
  // -- Selectors
  const Selectors = {
    inputType: document.querySelector('.add__type'),
    inputDescription: document.querySelector('.add__description'),
    inputValue: document.querySelector('.add__value'),
    inputSubmitButton: document.querySelector('.add__btn')
  };
  return {
    getInput: function() {
      return {
        // type is either inc or exp
        type: Selectors.inputType.value,
        description: Selectors.inputDescription.value,
        value: Selectors.inputValue.value
      };
    },

    getSelectors: function() {
      return Selectors;
    }
  };
})();

// -- GLOBAL APP CONTROLLER
const appController = (function(dataCtrl, UICtrl) {
  const addEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    UISelectors.inputSubmitButton.addEventListener('click', appAddItem);

    // Return key pressed event in global document
    document.addEventListener('keyup', function(e) {
      if (e.keyCode === 13 || e.which === 13) appAddItem();
    });
  };

  const appAddItem = function() {
    // 1. Get field input data
    let input = UICtrl.getInput();

    // 2. Add item to dataController
    // 3. Add item to UI
    // 4. Calculate budget
    // 5. Display budget in UI
  };

  return {
    appInit: function() {
      console.log('App running...');
      addEventListeners();
    }
  };
})(dataController, UIController);
// ^passed as arguments in case we want to change the module names

appController.appInit();
