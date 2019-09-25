// -- BUDGET DATA CONTROLLER
// !! -- Note to self: arrow fct expressions do not have their own .this;
// therefore they are NOT suited for method functions
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
    this.percentage = -1;
  };

  // Add calculate percentages method to Expense prototype
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  // Get percentage method to Expense proto
  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    // Delete Item
    dataDeleteItem: function(type, id) {
      // Loop over all elements in the inc/ exp array
      let ids = data.allItems[type].map(element => {
        return element.id;
      });
      // Find the index of the element we want to delete
      let index = ids.indexOf(id); // index = -1 if the element is not found

      if (index !== -1) {
        // Use splice to delete the element from the array
        data.allItems[type].splice(index, 1);
      }
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
    dataCalculatePercentages: function() {
      data.allItems.exp.forEach(element => {
        element.calcPercentage(data.totalAmounts.inc);
      });
    },
    dataGetPercentages: function() {
      let expPercentages = data.allItems.exp.map(element => {
        return element.getPercentage();
      });
      return expPercentages;
    },
    // Returns the total inc, exp, budget and percentage for the app controller
    getBudget: function() {
      return {
        totalBudget: data.totalBudget,
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
    inputTypeClass: '.add__type',
    inputDescriptionClass: '.add__description',
    inputValueClass: '.add__value',
    inputSubmitButton: document.querySelector('.add__btn'),
    listIncomes: document.querySelector('.income__list'),
    listExpenses: document.querySelector('.expenses__list'),
    topBudget: document.querySelector('.budget__value'),
    topIncome: document.querySelector('.budget__income--value'),
    topExpenses: document.querySelector('.budget__expenses--value'),
    topPercentage: document.querySelector('.budget__expenses--percentage'),
    bottomContainer: document.querySelector('.container'),
    bottomItemPercs: '.item__percentage',
    topCurrentDate: document.querySelector('.budget__title--month')
  };

  // Number formatting: -- prepend '+' to incs and '-' to exps
  // -- append '.' + exactly 2 decimals
  // -- comma separator between thousands
  const uiFormatNumber = function(number, type) {
    let numberSplit, integer, decimals;
    // get absolute value of the number
    number = Math.abs(number);
    // set 2 decimals, including .00 if no decimals;
    // toFixed is a method of the Number prototype, returns a String
    number = number.toFixed(2);
    // split the number string to decimals and integer
    numberSplit = number.split('.');
    integer = numberSplit[0];
    // add comma separator between thousand, if the case
    if (integer.length > 3) {
      // The arguments of substring() represent the starting and ending indexes
      //  the arguments of substr() represent the starting index and the number
      // of characters to include in the returned string.
      integer =
        integer.substr(0, integer.length - 3) +
        ',' +
        integer.substr(integer.length - 3, 3);
    }

    decimals = numberSplit[1];
    // prepend '+' to incs and '-' to exps

    return (type === 'exp' ? '-' : '+') + ' ' + integer + '.' + decimals;
  };

  const nodeListForEach = function(list, callback) {
    for (let i = 0; i < list.length; i++) {
      // call the callback function in the nodeListForEach function
      callback(list[i], i);
    }
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
      if (type === 'inc') {
        uiHtml = `
            <div class="item clearfix" id="inc-${object.id}">
              <div class="item__description">${object.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${uiFormatNumber(
                      object.value,
                      type
                    )}</div>
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
            <div class="item clearfix" id="exp-${object.id}">
              <div class="item__description">${object.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${uiFormatNumber(
                      object.value,
                      type
                    )}</div>
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
    },
    // id = inc-x/ exp-y
    uiDeleteListItem: function(id) {
      // we cannot delete an item directly, so we move to parent
      // and then removeChild
      let item = document.getElementById(id);
      item.parentNode.removeChild(item);
    },
    uiClearInput: function() {
      Selectors.inputDescription.value = '';
      Selectors.inputValue.value = '';
      // Focus on the description field to easily add another item
      Selectors.inputDescription.focus();
    },
    // Display total budget, inc, exp & % in the UI
    displayBudget: function(object) {
      let type;
      // Prepend + or - on the total budget if > or respectively < 0
      object.totalBudget >= 0 ? (type = 'inc') : (type = 'exp');
      Selectors.topBudget.textContent = uiFormatNumber(
        object.totalBudget,
        type
      );
      Selectors.topIncome.textContent = uiFormatNumber(object.totalInc, 'inc');
      Selectors.topExpenses.textContent = uiFormatNumber(
        object.totalExp,
        'exp'
      );
      // only display percentage if > 0 (i.e. incomes added)
      // otherwise display '---'
      if (object.percentage > 0) {
        Selectors.topPercentage.textContent = object.percentage + '%';
      } else {
        Selectors.topPercentage.textContent = '---';
      }
    },
    uiDisplayPercentages: function(percs) {
      // returns a node list
      let percFields = document.querySelectorAll(Selectors.bottomItemPercs);
      // loop through nodes and change the textContent for each
      // instead of converting the node list to an array, we shall
      // write a nodeListForEach function to do this
      // const nodeListForEach = function(list, callback) {
      //   for (let i = 0; i < list.length; i++) {
      //     // call the callback function in the nodeListForEach function
      //     callback(list[i], i);
      //   }
      // };

      nodeListForEach(percFields, function(element, index) {
        // Make sure to not display negative or 0%
        if (percs[index] > 0) {
          element.textContent = percs[index] + '%';
        } else {
          element.textContent = '---';
        }
      });
    },
    uiDisplayDate: function() {
      let currTime, currYear, currMonth;
      // use the Date constructor to display the current time
      // return the current month
      let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      currTime = new Date();
      currMonth = currTime.getMonth();
      currYear = currTime.getFullYear();
      Selectors.topCurrentDate.textContent = months[currMonth] + ' ' + currYear;
    },
    uiSwitchType: function() {
      let allInputs = document.querySelectorAll(
        Selectors.inputTypeClass +
          ',' +
          Selectors.inputDescriptionClass +
          ',' +
          Selectors.inputValueClass
      );

      nodeListForEach(allInputs, function(element) {
        // whenever the type changes, class will be toggled
        element.classList.toggle('red-focus');
        Selectors.inputSubmitButton.classList.toggle('red');
      });
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
    // Add event handler for .container; this will be used with event delegation
    // to determine when the delete button is pressed for both inc and exp
    UISelectors.bottomContainer.addEventListener('click', appDeleteItem);

    // Add change event handler for dropdown; this will be used to change
    // the input focus color and submit button color based on amount type
    UISelectors.inputType.addEventListener('change', UICtrl.uiSwitchType);
  };

  const appTotalBudget = function() {
    // Calculate total budget
    dataCtrl.dataTotalBudget();
    // Get budget from data ctrl
    let budget = dataCtrl.getBudget();
    // Display total budget in UI
    UICtrl.displayBudget(budget);
  };

  const appUpdatePercentages = function() {
    // calculate %'s
    dataCtrl.dataCalculatePercentages();
    // read %'s from dataController
    let percentages = dataCtrl.dataGetPercentages();
    // update UI with new %'s
    UICtrl.uiDisplayPercentages(percentages);
  };

  const appAddItem = function() {
    let appInput, appNewItem;
    // Get field input data
    appInput = UICtrl.getInput();

    // only if description and value fields are not blank;
    // as we used parsefloat, we need to check that object.value is !NaN
    // -- ?? how to use JSON.parse and stringify to check for empty string ??
    if (
      appInput.description !== '' &&
      !isNaN(appInput.value) &&
      appInput.value > 0
    ) {
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
      // Calculate and update %'s
      appUpdatePercentages();
    } else console.log('Please fill out all fields');
  };

  const appDeleteItem = function(e) {
    // move up from the delete 4 times to target the div .item,
    // which added when each item is added (uiAddListItem())
    let itemId, splitId, type, id;
    itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      // inc-x ; exp-y
      splitId = itemId.split('-');
      type = splitId[0];
      id = parseInt(splitId[1]); //string converted to number  as arg for dataDeleteItem()

      // Delete item from data structure
      dataCtrl.dataDeleteItem(type, id);
      // Delete item from the UI
      UICtrl.uiDeleteListItem(itemId);
      // Update and display new total budget, inc, exps & percentages
      appTotalBudget();
    }
  };

  return {
    appInit: function() {
      console.log('App running...');
      // Show current date
      UICtrl.uiDisplayDate();
      // Once app is initialized, display budget, inc, exp and % initial values (0)
      UICtrl.displayBudget({
        totalBudget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      addEventListeners();
    }
  };
})(dataController, UIController);
// ^passed as arguments in case we want to change the module names

appController.appInit();
