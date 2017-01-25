SELECT * FROM AddressBook ORDER BY accountId LIMIT 10;

SELECT 
    Account.id,
    Account.email,
    AddressBook.name
FROM Account
    JOIN AddressBook ON Account.id = AddressBook.accountId;
--outputs 10 rows

--# of addressbooks to each account
SELECT 
    Account.id,
    Account.email,
COUNT(*) AS `Num of AddressBooks`
FROM Account
    JOIN AddressBook ON Account.id = AddressBook.accountId
    GROUP BY Account.id;
    
    
--just output id and emails
SELECT
    id,
    email
FROM Account;