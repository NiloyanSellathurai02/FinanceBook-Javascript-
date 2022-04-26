const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const db = await mongoose.connect(
      `mongodb+srv://Niloyan:${process.env.MONGODB_PASSWORD}@auto-pilot.tqatj.mongodb.net/NP_Finance?retryWrites=true&w=majority`
    );
    console.log("MONGODB Connected...");
  } catch (error) {
    console.log("MONGODB Erorr:", error.message);
    process.exit(1);
  }
};

module.exports = connectMongo();
