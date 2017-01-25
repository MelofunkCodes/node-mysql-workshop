/*
Exercise 2: Getting back our data

1) Write a program that fetches the first 5 accounts in the addressbook database

2) For each account, console.log a line with the account’s ID and email, like this: #1:email@domain.com

3) Use the colors NPM module with the .bold option to achieve this effect
*/

var mysql = require('promise-mysql');
var colors = require('colors');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'myeoh27',
    password: '',
    database: 'addressbook',
    connectionLimit: 10
});



//===========FUNCTION DECLARATION===============
function firstFiveAccounts(){
    return connection.query("SELECT id, email FROM Account LIMIT 5;");
}

//===========CALLING FUNCTION===================
firstFiveAccounts()
.then(function(result){
    
    result.forEach(function(eachAccount){
        //console.log("eachAccount.id: ", eachAccount.id, typeof eachAccount.id);
        console.log("#".rainbow.bold + eachAccount.id.toString().rainbow.bold + ": ".rainbow.bold + eachAccount.email);
    });
    
    connection.end();
})
.catch(function(error){
    console.log("Error happened.", error);
    
    connection.end();
});