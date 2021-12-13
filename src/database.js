const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.mqydl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function main(){
    await client.connect();
    await client.db().createCollection("accounts", function(error, collection){if(error){console.log("Collection accounts already exists. Not creating it...");}});
    await client.db().createCollection("deposits", function(error, collection){if(error){console.log("Collection deposits already exists. Not creating it...");}});
    console.log("Collections for the database have been completely created.");
}

module.exports = {
    startDB: main,
    db: client
};