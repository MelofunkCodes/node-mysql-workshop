var mysql = require('promise-mysql');
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'myeoh27',
    password: '',
    database: 'addressbook',
    connectionLimit: 10
});


//===========FUNCTION DECLARATION===============
function getDatabases() {

    return connection.query("SHOW DATABASES")
        .then(function(result) {
            //console.log(result);
            var dbList = result.map(function(eachDatabase) {
                return [eachDatabase.Database]; //getting the names of each database inside each object, making each name its own array
            }); //dbList will be an array of arrays

            //console.log("dbList: ", dbList);

            var table = new Table({
                head: ['DATABASES'.blue.bold.underline],
                colWidths: [20]
            });

            dbList.forEach(function(eachArray) {
                table.push(eachArray);
            });

            return table.toString();

        });
}


//===========CALLING FUNCTION===================
getDatabases()
    .then(function(result) {
        console.log(result);

        connection.end();
    })
    .catch(function(error) {
        console.log("Error happened. ", error);
        
        connection.end();
    });
