const { ObjectId } = require('mongodb');
const mongo = require('../connection');

async function update(id, product) {
  try {
    const db = await mongo.connection();
    const { value: updatedProduct } = await db.collection('sales').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: product },
      { returnDocument: 'after' },
    );
    return updatedProduct;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = update;
