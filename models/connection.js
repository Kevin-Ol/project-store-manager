const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_DB_URL = 'mongodb://localhost:27017/StoreManager';
const DB_NAME = 'StoreManager';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_DB_URL, options);

let db = null;

async function connect() {
  try {
    db = (await client.connect()).db(DB_NAME);
    return db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const connection = async () => (db || connect());

module.exports = { connection };
