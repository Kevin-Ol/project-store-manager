const { ObjectId } = require('mongodb');
const mongo = require('../connection');

async function findById(id) {
  try {
    const db = await mongo.connection();
    const product = await db.collection('products').findOne(new ObjectId(id));
    return product;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findById;
