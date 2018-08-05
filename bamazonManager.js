var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bronco45",
    database: "bamazon_db"
});
var retrieve = ("SELECT * FROM products");

//starts the connection as well as the selections
connection.connect(function (err) {
    if (err) throw err;
    start();
});

//inquirer will prompt what the manager actions can do. Selecting an action will trigger a related function
function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add New Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function (answer) {
        // switch case to filter throught the selections and call the related functions
        switch (answer.action) {
            case "View Products for Sale":
                listProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add New Inventory":
                newInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Exit":
                exit();
                break
        };
    });
};

// function that will terminate the connection
function exit() {
    connection.end()
};

// function that will list all products in the database 
function listProducts() {
    connection.query(retrieve, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("=======================================")

            console.log(res[i].item_id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
        }
    });
    console.log("\nUse the arrow keys to make another selection.")
    start();
};

// function that will loop through the inventory to check to see what is low
function lowInventory() {
    connection.query(retrieve, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("\n=======================================")
                console.log(res[i].item_id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
                console.log("To add more stock select New Inventory.")
            };
        };
    });
    console.log("\nUse the arrow keys to make another selection.")
    start();
};

// this function will add a new item to the database
function newProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What would you like to add? (Product Name)"
        },
        {
            name: "departmentName",
            type: "input",
            message: "What department?"
        },
        {
            name: "price",
            type: "input",
            message: "How much does it cost?"
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How much stock is there?"
        }
    ]).then(function (answer) {
        var sql = "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [[answer.productName, answer.departmentName, answer.price, answer.stockQuantity]];
        connection.query(sql, [values], function (err, res) {
            if (err) throw err;
            console.log("\n=======================================\n")

            console.log(res.affectedRows + "new product added! \n");
        });
        console.log("\nUse the arrow keys to make another selection.")
        start();
    });
};

function newInventory() {
    inquirer.prompt([
        {
            name: "idSelect",
            type: "input",
            message: "Select an ID of the stock you want to change."
        },
        {
            name: "quantityChange",
            type: "input",
            message: "How many items are in the stock now ?"
        }
    ]).then(function (answer) {
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query,
            [
                {
                    stock_quantity: answer.quantityChange
                },
                {
                    item_id: answer.idSelect
                }
            ],
            function (err, res) {
                console.log("\n=======================================\n")

                console.log(res.affectedRows + " products updated!\n");
            }
        );
        console.log("\nUse the arrow keys to make another selection.")
        start();
    });
};