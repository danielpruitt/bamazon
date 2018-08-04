var sql = require('mysql');
var inquirer = require('inquirer');
var retrieve = ("SELECT * FROM products");

var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bronco45",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    
    queryDB();
});

//displays the items that are in the database
function queryDB() {
    connection.query(retrieve, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
        }
    });
    buy();
}
//starts the buying feature
function buy() {
    //this prompts the user as to which item to buy, the item ID is what is used for the rest of the function to know what it is pulled from the database
    inquirer.prompt({
        name: "chosenItem",
        type: "input",
        message: "Which item would you like to buy?"
    }).then(function (answer) {
        console.log(answer.chosenItem);
        var wantToBuy = answer.chosenItem;
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?"
        connection.query(query, { item_id: wantToBuy }, function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                console.log("\n Item ID: " + res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price + "\n");
                //this prompt asks if the user is sure they want to buy this item
                inquirer.prompt({
                    name: "purchase",
                    type: "rawlist",
                    message: "Are you sure you want to buy this item?",
                    choices: ["Yes", "No"]
                }).then(function (answer) {
                    connection.query(query, { item_id: wantToBuy }, function (err, res) {
                
                        console.log(answer.purchase);
                        console.log(wantToBuy);
                        for (var i = 0; i < res.length; i++) {
                            // if the user selects "no", the function will run again so they can select an item they do want
                            if (answer.purchase === "No"){
                                return buy();
                            } else {
                                console.log("We have " + res[i].product_name + " in stock. There is " + res[i].stock_quantity + " left in stock.");
                            };
                        };
                        // this prompt allows the quantity to be selected 
                        inquirer.prompt({
                            name: "quantityAmount",
                            type: "number",
                            message: "Please enter the how many you want to purchase."
                        }).then(function (answer) {

                            connection.query(query, { item_id: wantToBuy }, function (err, res) {
                                for (var i = 0; i < res.length; i++) {
                                    var wantedQuantity = answer.quantityAmount;
                                    var subtractedQuantity = res[i].stock_quantity - wantedQuantity;
                                    
                                    //this will check if the the user's amount is within the amount that Bamazon has.
                                    if (answer.quantityAmount > res[i].stock_quantity){
                                        console.log("I'm sorry, we do not have that much. Please select another amount");
                                        return buy();
                                    } else 
                                    var originalCost = res[i].price;
                                    var totalPrice = originalCost * wantedQuantity;
                                    console.log("That will cost: " + totalPrice);
                                    function update() {
                                        var update = connection.query("UPDATE products SET ? WHERE ?",
                                            [
                                                { stock_quantity: subtractedQuantity },
                                                { item_id: wantToBuy }
                                            ], function (err, res) {
                                                
                                                    console.log("Products updated! \n");
                                                
                                            }

                                        );
                                        console.log("Thank you for your purchase!");
                                    };
                                    update();
                                    connection.end();
                                };
                            })

                        })
                    });
                });
            };
            console.log("\n");
        });
    });
};
