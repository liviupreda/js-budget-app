// -- BUDGET DATA CONTROLLER
const dataController = (function() {
  // Store inc and exp in two arrays, part of the allItems object
  let data = {
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

  return {
    dataAddItem: function(type, description, value) {
      let dataNewItem, id;

      // we want the new item id to be the id of the last
      // element in the array + 1 (e.g. In case we delete items)
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else id = 0;

      // Type exp => new Expense, else new Income
      if (type === 'exp') {
        dataNewItem = new Expense(id, description, value);
      } else if (type === 'inc') {
        dataNewItem = new Income(id, description, value);
      }

      // Push item based on type in the data structure
      // (select either exp or inc array based on [type])
      data.allItems[type].push(dataNewItem);
      return dataNewItem;
    },

    test: function() {
      console.log(data);
    }
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
    let appInput, appNewItem;
    // 1. Get field input data
    appInput = UICtrl.getInput();

    // 2. Add item to dataController
    appNewItem = dataCtrl.dataAddItem(
      appInput.type,
      appInput.description,
      appInput.value
    );
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
