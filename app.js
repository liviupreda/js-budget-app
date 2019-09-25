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
    },
    // Total budget is income - expenses for the current month
    totalBudget: 0,
    // % of the income that is spent; initialize with -1, an invalid value
    // in case we have no values for inc, exp, budget
    percentage: -1
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

  // Calculate total income and expenses
  let totalAmounts = function(type) {
    let sum = 0;
    // type is either exp or inc
    data.allItems[type].forEach(element => {
      sum += element.value;
    });
    // store result in the totalAmounts object
    data.totalAmounts[type] = sum;
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
    // Calculate total budget
    dataTotalBudget: function() {
      // Calculate total income and expenses
      totalAmounts('inc');
      totalAmounts('exp');
      // Calculate budget: income - expenses
      data.totalBudget = data.totalAmounts.inc - data.totalAmounts.exp;
      // Calculate % of income that was spent this month
      // If income is 0 but we have expenses, we divide by zero and get
      // % = Infinity; so we calculate % only if income > 0
      if (data.totalAmounts.inc > 0) {
        data.percentage = Math.round(
          (data.totalAmounts.exp / data.totalAmounts.inc) * 100
        );
      } else {
        data.percentage = -1;
      }
    },
    // Returns the total inc, exp, budget and percentage for the app controller
    getBudget: function() {
      return {
        budget: data.totalBudget,
        totalInc: data.totalAmounts.inc,
        totalExp: data.totalAmounts.exp,
        percentage: data.percentage
      };
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
    inputSubmitButton: document.querySelector('.add__btn'),
    listIncomes: document.querySelector('.income__list'),
    listExpenses: document.querySelector('.expenses__list')
  };
  return {
    getInput: function() {
      return {
        // type is either inc or exp
        type: Selectors.inputType.value,
        description: Selectors.inputDescription.value,
        // returns a string so we use parseFloat to get the value
        value: parseFloat(Selectors.inputValue.value)
      };
    },
    // object = item to insert
    uiAddListItem: function(object, type) {
      let uiHtml;
      // Create HTML string with placeholder text, based on type
      // only if description and value fields are not blank;
      // as we used parsefloat, we need to check that object.value is !NaN
      // -- ?? how to use JSON.parse and stringify to check for empty string
      if (
        object.description !== '' &&
        !isNaN(object.value) &&
        object.value > 0
      ) {
        if (type === 'inc') {
          uiHtml = `
            <div class="item clearfix" id="income-${object.id}">
              <div class="item__description">${object.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${object.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline">
                        </i></button>
                    </div>
                </div>
            </div>
            `;
          // insert uiHtml in the DOM
          Selectors.listIncomes.insertAdjacentHTML('beforeend', uiHtml);
        } else if (type === 'exp') {
          uiHtml = `
            <div class="item clearfix" id="expense-${object.id}">
              <div class="item__description">${object.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${object.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline">
                    </i></button>
                    </div>
                </div>
            </div>
            `;
          // insert uiHtml into the DOM
          Selectors.listExpenses.insertAdjacentHTML('beforeend', uiHtml);
        }
      } else console.log('Please fill out all fields');
    },
    uiClearInput: function() {
      Selectors.inputDescription.value = '';
      Selectors.inputValue.value = '';
      // Focus on the description field to easily add another item
      Selectors.inputDescription.focus();
    },
    uiGetSelectors: function() {
      return Selectors;
    }
  };
})();

// -- GLOBAL APP CONTROLLER
const appController = (function(dataCtrl, UICtrl) {
  const addEventListeners = function() {
    const UISelectors = UICtrl.uiGetSelectors();
    UISelectors.inputSubmitButton.addEventListener('click', appAddItem);

    // Return key pressed event in global document
    document.addEventListener('keyup', function(e) {
      if (e.keyCode === 13 || e.which === 13) appAddItem();
    });
  };

  const appTotalBudget = function() {
    // Calculate total budget
    dataCtrl.dataTotalBudget();
    // Get budget from data ctrl
    let budget = dataCtrl.getBudget();
    // Display total budget in UI
    console.log(budget);
  };

  const appAddItem = function() {
    let appInput, appNewItem;
    // Get field input data
    appInput = UICtrl.getInput();

    // Add item to Data Controller
    // appNewItem will be passed to the uiAddListItem method
    appNewItem = dataCtrl.dataAddItem(
      appInput.type,
      appInput.description,
      appInput.value
    );
    // Add item to UI
    UICtrl.uiAddListItem(appNewItem, appInput.type);
    // Clear input
    UICtrl.uiClearInput();
    // Calculate and update budget for every new item entered
    appTotalBudget();
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
