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




//===========FUNCTION DECLARATION===============
function getAccounts() {
    return connection.query("SELECT id, email FROM Account")
        .then(function(result) {
            var accounts = {};

            result.forEach(function(eachAccount) {
                accounts[eachAccount.id] = [eachAccount.id, eachAccount.email];
            });

            return accounts;
        });
}

function getAddressBooks() {
    return connection.query("SELECT Account.id, Account.email, AddressBook.name FROM Account LEFT JOIN AddressBook ON Account.id = AddressBook.accountId")
        .then(function(result) {

            var id = {};

            result.forEach(function(eachObject) {
                
                if (id[eachObject.id]) { 
                    id[eachObject.id].push(eachObject.name);
                }
                else { 
                    if (eachObject.name !== null) { 
                        id[eachObject.id] = [eachObject.name]; 
                    }
                    else {
                        id[eachObject.id] = ["--no address books--"];
                    }
                    
                }
            });

            for (var prop in id) {
                id[prop] = id[prop].join(", ");
            }

            return id;
        });
}

function showAddressBooks() {
    var accounts = getAccounts();
    var aBooks = getAddressBooks();

    return Promise
        .all([accounts, aBooks])
        .then(function(result) {
            accounts = result[0];
            aBooks = result[1];

            for (var prop in accounts) {

                    accounts[prop].push(aBooks[prop]);

            }

            var table = new Table({ 
                head: ['id', 'Email', 'Address Books'],
                colWidths: [5, 20, 70]
            });

            for (var prop in accounts) {
                table.push(accounts[prop]);
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
    })

