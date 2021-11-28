const mongo = require('../connection');

async function create(product) {
  try {
    const db = await mongo.connection();
    await db.collection('products').insertOne(product);
    return product;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = create;
