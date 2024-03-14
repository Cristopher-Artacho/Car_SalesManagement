// //FROM DRIVER
// const {MongoClient} = require('mongodb')

// let dbConnection

// module.exports = {
//     //INITIALLY CONNECTING TO A DATABASE
//     connectToDb: (cb) => {
//         MongoClient.connect('mongodb://localhost:6969/CarSales')
//         .then((client) => {
//             dbConnection = client.db()
//             return cb
//         })
//         .catch(err => {
//             console.log(err)
//             return cb(err)
//         })
//     },

//     //RETURN DATABASE CONNECTION
//     getDB: () => dbConnection
// }

const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    // INITIALLY CONNECTING TO A DATABASE
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:6969/CarSales')
            .then((client) => {
                dbConnection = client.db();
                cb(null); // Invoke the callback with null to indicate success
            })
            .catch(err => {
                console.error(err);
                cb(err); // Invoke the callback with the error if connection fails
            });
    },

    // RETURN DATABASE CONNECTION
    getDB: () => dbConnection
};



