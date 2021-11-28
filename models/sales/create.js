const mongo = require('../connection');

async function create(sale) {
  try {
    const db = await mongo.connection();
    await db.collection('sales').insertOne(sale);
    return sale;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = create;
