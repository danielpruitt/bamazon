# Bamazon

https://danielpruitt.github.io/bamazon/


How it works: 
-Bamazon is a client line input Node app that utilizes Sql and Inquirer to provide data and input to the user. 
-The logic is stored in bamazonCustomer.js and the products are stored in the database bamazon_db. The schema and seeds are attached to the repository. 
-To run the Bamazon app node must be available and the dependencies "mysql" and "inquirer" need to be installed. 

Below is a link of Bamazon in use. 
https://drive.google.com/file/d/19yUr-_anmPtLrnFIQGbhT2-whWylWzMB/view

Images:
This is the inital response upon opening Bamazon, the user will then user the ID to make a selction.
![Image](initial.JPG);

Following the selection, user is prompted if they are sure they want that product. If yes, Bamazon continues to ask for the quantity.
![Image](purchased.JPG)

The Stock Quantity of the purchase is decremented from the purchase and when Bamazon is loaded another time the new Stock Quantity is updated. 
![Image](decrementQuantityNotsSure.JPG)

If ther is not enough stock for the selection the user will be prompted and asked to make a smaller/another selection.
![Image](NotEnoughStock.JPG)