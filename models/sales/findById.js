const { ObjectId } = require('mongodb');
const mongo = require('../connection');

async function findById(id) {
  try {
    const db = await mongo.connection();
    const sale = await db.collection('sales').findOne(new ObjectId(id));
    return sale;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findById;
