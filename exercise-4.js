var mysql = require('promise-mysql');
var colors = require('colors');
var Table = require('cli-table');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'myeoh27',
    password: '',
    database: 'addressbook',
    connectionLimit: 10
});


/*
LOGIC
0. Copied over code from exercise-3.js. Just changed query in line 43 to LEFT JOIN
and added conditions in line 58-63 to mention if account id has no address books.

-----------
1. Loop through ARRAY, create empty arrays for each id (like WHEEL OF FORTUNE exercise from ARRAY METHODS WORKSHOP)
2. Push Addressbooks, property "name", into the arrays specific to each id
3. Turn each array into a string and assign it to var aBooks
4. Create an array for each id where first element is id, second is email, and third is aBooks
5. table.push( arrId1, arrId2, arrId3, etc...)
6. return table.toString();
*/


//===========FUNCTION DECLARATION===============
function getAccounts() {
    return connection.query("SELECT id, email FROM Account")
        .then(function(result) {
            var accounts = {};

            result.forEach(function(eachAccount) {
                accounts[eachAccount.id] = [eachAccount.id, eachAccount.email];
            });

            //console.log("accounts: ", accounts);

            return accounts;
        });
}

function getAddressBooks() {
    return connection.query("SELECT Account.id, Account.email, AddressBook.name FROM Account LEFT JOIN AddressBook ON Account.id = AddressBook.accountId")
        .then(function(result) {
            //console.log("Query result: ", result);
            var id = {};

            //steps 1 and 2
            result.forEach(function(eachObject) {
                
                if (id[eachObject.id]) { //if property of account id already exists inside object "id", push the next addressbook in
                    id[eachObject.id].push(eachObject.name);
                }
                else { //else if it doesn't exist, initate the array. But if the account id does not have any addressbooks, mention it
                    
                    if (eachObject.name !== null) { //have to check for the "name" directly vs what I did originally id[eachObject.id]
                        id[eachObject.id] = [eachObject.name]; //initate the array
                    }
                    else {
                        id[eachObject.id] = ["--no address books--"];
                    }
                    
             
                    // console.log("Account id: ", eachObject.id);
                    // console.log("Address Books: ", id[eachObject.id]);
                    // console.log("Object: ", id);
                
                }
            });
            
            //console.log("id[5]: ", id[5], typeof id[5]);//outputs out [null], object

            //step 3
            for (var prop in id) {
                id[prop] = id[prop].join(", ");
            }

            //console.log("typeof id[5]: ", typeof id[5]); //it's a string
            return id;
        });
}

function showAddressBooks() {
    var accounts = getAccounts();
    var aBooks = getAddressBooks();

    //console.log("accounts: ", accounts); //willoutput undefined as Promises haven't been called yet
    //console.log("aBooks: ", aBooks);

    return Promise
        .all([accounts, aBooks])
        .then(function(result) {
            accounts = result[0];
            aBooks = result[1];

            // console.log("accounts: ", accounts);
            // console.log("aBooks: ", aBooks);

            //step 4
            for (var prop in accounts) {
                //console.log("accounts[prop]: ", accounts[prop]);
                //console.log("aBooks[prop]:", aBooks[prop], typeof aBooks[prop]);

                //if (typeof aBooks[prop] !== "undefined") {
                    accounts[prop].push(aBooks[prop]);
                //}
                // else {
                //     accounts[prop].push("--no address bookz--");
                // }
            }

            //console.log("accounts: ", accounts);
            return accounts;
        })
        .then(function(result) {
            var table = new Table({
                head: ['id', 'Email', 'Address Books'],
                colWidths: [5, 20, 70]
            });

            for (var prop in result) {
                table.push(result[prop]);
            }

            return table.toString();
        });


}

//===========CALLING FUNCTION===================
showAddressBooks()
    .then(function(result) {
        console.log(result);

        connection.end();
    })
    .catch(function(error) {
        console.log("Error happened.", error);

        connection.end();
    });
