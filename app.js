// -- BUDGET DATA CONTROLLER
const dataController = (function() {})();

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
  const UISelectors = UICtrl.getSelectors();

  const appAddItem = function() {
    // 1. Get field input data
    let input = UICtrl.getInput();
    console.log(input);

    // 2. Add item to dataController
    // 3. Add item to UI
    // 4. Calculate budget
    // 5. Display budget in UI
  };

  UISelectors.inputSubmitButton.addEventListener('click', appAddItem);

  // Return key pressed event in global document
  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      appAddItem();
    }
  });
})(dataController, UIController);
// ^passed as arguments in case we want to change the module names
