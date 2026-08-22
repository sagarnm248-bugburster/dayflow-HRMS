const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./auth.env" });
require("dotenv").config(); // Fallback for standard .env

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/Attendance";
const dbName = process.env.MONGO_DB_NAME || "Attendance";

let db;
let client;

const connectToMongoDB = async () => {
  try {
    if (!mongoURI) {
      console.warn("⚠️ MONGO_URI is not set. Database connection skipped.");
      return;
    }
    client = new MongoClient(mongoURI);
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ MongoDB connected successfully to database: "${dbName}"`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

const getDB = () => db;

module.exports = { connectToMongoDB, getDB };
