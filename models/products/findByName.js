const mongo = require('../connection');

async function findByName(name) {
  try {
    const db = await mongo.connection();
    const product = await db.collection('products').findOne({ name });
    return product;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findByName;
