const mongo = require('../connection');

async function updateQuantity(id, product) {
  try {
    const db = await mongo.connection();
    const { value: updatedProduct } = await db.collection('products').findOneAndUpdate(
      { _id: id },
      { $set: product },
      { returnDocument: 'after' },
    );
    return updatedProduct;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = updateQuantity;
