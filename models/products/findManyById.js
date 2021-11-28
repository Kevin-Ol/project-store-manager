const { ObjectId } = require('mongodb');
const mongo = require('../connection');

async function findManyById(ids) {
  try {
    const db = await mongo.connection();
    const objectIds = ids.map((id) => new ObjectId(id));
    const products = await db.collection('products').find({ _id: { $in: objectIds } }).toArray();
    return products;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findManyById;
