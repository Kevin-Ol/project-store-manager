const mongo = require('../connection');

async function findAll() {
  try {
    const db = await mongo.connection();
    const products = await db.collection('products').find().toArray();
    return products;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findAll;
