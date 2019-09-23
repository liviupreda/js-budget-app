// -- BUDGET DATA CONTROLLER
const dataController = (function() {
  let x = 23;
  const add = function(a) {
    return x + a;
  };

  return {
    publicTest: function(y) {
      return add(y);
    }
  };
})();

// -- UI CONTROLLER
const UIController = (function() {
  // code
})();

// -- APP CONTROLLER
const appController = (function(dataCtrl, UICtrl) {
  let z = dataCtrl.publicTest(5);
  return {
    publicTestTwo: function() {
      console.log(z);
    }
  };
  // passed as arguments in case we want to change the module names
})(dataController, UIController);
