const { MongoClient } = require("mongodb");
let database = null;

const URI =
 process.env.MONGO_URL || "mongodb+srv://iipl:iipl&123456789@nayagaadi-dev.ibjvrvp.mongodb.net/?retryWrites=true&w=majority";
//process.env.MONGO_URL || "mongodb://192.168.1.78:27017/?directConnection=true";

//mongodb://192.168.1.78:27017

exports.connect = async function () {
  if (database) {
    return database;
  }
  var client = new MongoClient(URI);

  await client.connect();
  //happi-qa
  database = client.db(process.env.MONGO_DB || "nayagadi2database");
  // const collection = database.collection(collectionName);

  return database;
};
