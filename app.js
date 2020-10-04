var budgetController = (function (){
       var Expense = function (id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
         this.percent = -1;
       };
       Expense.prototype.calcPercent = function (totalIncome){
           if (totalIncome > 0){
               this.percent= Math.round((this.value / totalIncome)*100);
           }else {
            this.percent = -1;
           }
           
       };
       Expense.prototype.getPercent = function(){
           return this.percent;
       };

       var Income = function (id, description, value){
           this.id = id;
           this.description = description;
           this.value = value;
       };

       var calculateTotal = function (type){
        var sum = 0;
        data.allItems[type].forEach(function(el){
            console.log(el.value)
            sum += el.value;
        });
        
            data.totals[type] = sum;
         
    };

       var data = {
           allItems: {
               inc: [],
               exp: []
           },
           totals : {
               inc: 0,
               exp: 0
           }, 
           budget : 0,
           percentage: -1
       };

       return {
           addItem: function (type, desc, val){
               var item, ID;
               if (data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
               }else {
                   ID = 0;
               }
               if (type === 'inc'){
                   item = new Income(ID, desc, +val);
               }else if (type === 'exp') {
                   item = new Expense(ID, desc, +val);
               }
                data.allItems[type].push(item);
                return item;
           },
           calculateBudget: function (){
               calculateTotal('inc');
               calculateTotal('exp');
               if (data.totals['inc'] > 0 || data.totals['exp'] > 0){
                data.budget = data.totals['inc'] - data.totals['exp'];
               }else {
                   data.budget = 0;
               }
               if (data.budget == 0){
                data.percentage = -1;
               }else {
                data.percentage = Math.round(((data.totals['exp'] / data.totals['inc']) * 100));
               }
               
           },
           getBudget: function(){
               return {
                   budget: data.budget,
                   totalInc: data.totals['inc'],
                   totalExp: data.totals['exp'],
                   percentage: data.percentage
           };
        },
         deleteItem: function (type, id){
             var ids, index;
            // data.allItems[type] = data.allItems[type].map(function(curr){
            //          if (curr.id !== +id){
            //              return curr;
            //          };
            // });
            // data.allItems[type].forEach(function(curr, index){
            //     if (curr === undefined){
            //         data.allItems[type].splice(1, index);
            //     }
            // });
            // ids = data.allItems[type].map(function(curr){
            //              return curr.id;
            //     });
            // index = ids.indexOf(id);
            // if (index !== -1){
            //     data.allItems[type].splice(index, 1);
            // }
            // console.log(data.allItems[type]);
            var element = data.allItems[type].find(function(curr, ind){
                if (curr.id === +id){
                    return ind;
                }
            });
            index = data.allItems[type].indexOf(element);

            if (index !== -1){
                    data.allItems[type].splice(index, 1);
                }
                console.log(data.allItems[type]);
         },
         calculatePercentages: function (){
           data.allItems['exp'].forEach(function(curr){
                  curr.calcPercent(data.totals.inc);
           });
        },
        getPercentages: function(){
            var allpercnt = data.allItems['exp'].map(function(curr){
                return curr.getPercent();
         });
         return allpercnt;
        }
       }

})();

var uiController = (function () {
    const DOMValues = {
        addtype: '.add__type',
        adddescp: '.add__description',
        addval: '.add__value',
        addbtn: '.add__btn',
        incomeCls: '.income__list',
        expenseCls: '.expenses__list',
        budgVal: '.budget__value',
        budgInc: '.budget__income--value',
        budgExp: '.budget__expenses--value',
        budgExpperc: '.budget__expenses--percentage',
        itemPerc: '.item__percentage',
        budgMonth: '.budget__title--month',
        contain: '.container'
    };
    formatNumber = function(num, type){
        var numSplit, int, dec;
       num = Math.abs(num);
       num = num.toFixed(2);
       numSplit = num.split('.');
       int = numSplit[0];
       if ( int.length > 3 ){
           int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
       }
       dec= numSplit[1];

       return (type === 'exp'? '-' : '+') + ' ' + int + '.' + dec;
       
    };
    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    
    return {
             getDOMStrings: function(){
                 return DOMValues;
             },
             getInput: function () {
                 return {
                   sel: document.querySelector(DOMValues.addtype).value,
                   descrip: document.querySelector(DOMValues.adddescp).value,
                   value: parseFloat(document.querySelector(DOMValues.addval).value)
                 }
                   
             },
             addListItem: function (item, type){
                 var frag, newHtml, parent;
                 if (type === 'inc'){
                    frag = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    parent = document.querySelector(DOMValues.incomeCls); 
                } else if (type === 'exp'){
                     frag = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                     parent = document.querySelector(DOMValues.expenseCls);
                }
                
                 newHtml = frag.replace('%id%', item.id);
                 newHtml = newHtml.replace("%desc%", item.description);
                 newHtml = newHtml.replace("%val%", formatNumber(item.value, type));
                 
                 parent.insertAdjacentHTML('beforeend', newHtml);
                 
             },
             deleteListItem: function(itemID){
                 var el = document.getElementById(itemID);
                 el.parentNode.removeChild(el);
                    // document.getElementById(itemID).remove();
             },

             clearFields: function(){
                 var newArray;
                var elements = document.querySelectorAll(DOMValues.adddescp +','+ DOMValues.addval)
                 newArray = Array.prototype.slice.call(elements);
                 newArray.forEach(function(el){
                        el.value = "";
                 });
                
                newArray[0].focus();

             },
             displayBudget: function(budget, income, expenses, percent){
                 budget > 0 ? type = 'inc' : type = 'exp';
                document.querySelector(DOMValues.budgVal).textContent = formatNumber(budget, type);
                
                document.querySelector(DOMValues.budgInc).textContent = formatNumber(income, 'inc');
                document.querySelector(DOMValues.budgExp).textContent = formatNumber(expenses, 'exp');

                if (percent > 0){
                    document.querySelector(DOMValues.budgExpperc).textContent = percent + '%';
                }else {
                    document.querySelector(DOMValues.budgExpperc).textContent = '---';
                }
               
             },
             displayPercentages: function (perc){
               var fields = document.querySelectorAll(DOMValues.itemPerc);

               nodeListForEach(fields, function(curr, index){
                   if (perc[index] > 0){
                    curr.textContent = perc[index] + '%';
                   }else {
                    curr.textContent = '---';
                   }   
               });
             },
             displayMonth: function (){
                 months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                 document.querySelector(DOMValues.budgMonth).textContent = months[(new Date()).getMonth()] + ',' + (new Date()).getFullYear();
             },
             changedType: function(){
                 var fields = document.querySelectorAll(DOMValues.addtype + ',' + DOMValues.adddescp + ',' + DOMValues.addval);
                nodeListForEach(fields, function(curr){
                    curr.classList.toggle('red-focus');
                });
                document.querySelector(DOMValues.addbtn).classList.toggle('red');
                }
            }
})();

var appController = (function (budgCtrl, uiCtrl){

    var setupevenListener = function() {
        var DOMTypes = uiCtrl.getDOMStrings();
        document.querySelector(DOMTypes.addbtn).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (ev) {
            
            // if (ev.keyCode == 13 || ev.which == 13)
            if (ev.code == "Enter"){
                ctrlAddItem();
            }
        }); 
        document.querySelector(DOMTypes.contain).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOMTypes.addtype).addEventListener("change", uiCtrl.changedType);
    }; 
    
    function ctrlAddItem() {
        var data, finalVal;
         data = uiCtrl.getInput();
         console.log(data);
        if (data.descrip !== "" && data.value > 0){
            finalVal = budgCtrl.addItem(data.sel, data.descrip, data.value);
            console.log(finalVal);
   
            uiCtrl.addListItem(finalVal, data.sel);
   
            uiCtrl.clearFields();
   
            updateBudget();
            updatePercentages();
        }

    };
    var ctrlDeleteItem = function (event){
        var itemID, newData, type, ID;
           itemID = (event.target.parentNode.parentNode.parentNode.parentNode).id;
           if (itemID){
            newData = itemID.split("-");
            type = newData[0].slice(0,3);
            ID = newData[1];
            budgCtrl.deleteItem(type, +ID);

            uiCtrl.deleteListItem(itemID);

            updateBudget();
            updatePercentages();
           }
           
    };
    var updatePercentages = function (){
          budgCtrl.calculatePercentages();
          var percentages = budgCtrl.getPercentages();
          console.log("perc" + percentages);
          uiCtrl.displayPercentages(percentages);
    };
    var updateBudget = function(){
        budgCtrl.calculateBudget();
        var budgetVal = budgCtrl.getBudget();
        console.log(budgetVal);
        uiCtrl.displayBudget(budgetVal.budget, budgetVal.totalInc, budgetVal.totalExp, budgetVal.percentage);
    }
    return {
        init: function(){
            console.log("appstarted");
            uiCtrl.displayMonth();
            setupevenListener();
            uiCtrl.displayBudget(0, 0, 0, -1);
        }
    }
})(budgetController, uiController);

appController.init();