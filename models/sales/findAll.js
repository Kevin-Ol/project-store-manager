const mongo = require('../connection');

async function findAll() {
  try {
    const db = await mongo.connection();
    const sales = await db.collection('sales').find().toArray();
    return sales;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = findAll;
