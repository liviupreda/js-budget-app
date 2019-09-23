// -- BUDGET DATA CONTROLLER
const dataController = (function() {})();

// -- UI CONTROLLER
const UIController = (function() {
  // code
})();

// -- GLOBAL APP CONTROLLER
const appController = (function(dataCtrl, UICtrl) {
  const appAddItem = function() {
    // 1. Get field input data
    // 2. Add item to dataController
    // 3. Add item to UI
    // 4. Calculate budget
    // 5. Display budget in UI

    console.log('ok');
  };

  document.querySelector('.add__btn').addEventListener('click', appAddItem);

  // Return key pressed event added to global document
  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      appAddItem();
    }
  });
})(dataController, UIController);
// ^passed as arguments in case we want to change the module names
