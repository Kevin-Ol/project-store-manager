const { ObjectId } = require('mongodb');
const mongo = require('../connection');

async function remove(id) {
  try {
    const db = await mongo.connection();
    const { value: deletedProduct } = await db.collection('sales').findOneAndDelete(
      { _id: new ObjectId(id) },
    );
    return deletedProduct;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = remove;
