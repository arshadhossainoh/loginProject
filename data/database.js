const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
//mongodb://127.0.0.1:27017
let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin123:admin123@arshadcluster.koaiuqi.mongodb.net/blog?retryWrites=true&w=majority"
  );
  database = client.db("auth-demo");
}

function getDb() {
  if (!database) {
    throw { message: "You must connect first!" };
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
