var inquirer = require('inquirer');
var mysql      = require('mysql');
const cTable = require('console.table');
var connection = mysql.createConnection({
    
  host     : 'localhost',
  user     : 'root',
  password : 'ichiro51',
  database : 'bamazon'
});
 
connection.connect();

connection.query('SELECT * FROM bamazon.products;', function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    inquirer
  .prompt([
    {
        type: 'number',
        name: 'productID',
        message: 'Enter the ID of the product you want to buy:',
      },
      {
        type: 'number',
        name: 'purchaseQuantity',
        message: 'Enter the number of units you wish to buy:',
        default: 1
      },
  ])

  .then(answers => {
    // Use user feedback for... whatever!!
    console.log(answers);
    var product = null;
    for (i = 0; i < results.length; i++) {
        if (results[i].item_id == answers.productID) {
            product = results[i];
            break;
        }
    }
    //console.log(product);
    if (!product) {
        console.log("No product with ID ", answers.productID);
        return; 
    }

    if (answers.purchaseQuantity > product.stock_quantity) {
        console.log("Insufficient quantity!");
    }else{
        connection.query(`UPDATE products SET stock_quantity=${product.stock_quantity - answers.purchaseQuantity} WHERE item_id=${answers.productID}`, function (error, results, fields) {
            if (error) throw error;
            console.log("Your total price is: $", (product.price * answers.purchaseQuantity).toFixed(2));        
            connection.end();
        })
    }


  });
  });
   
  //connection.end();

