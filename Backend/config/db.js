const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
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

    // ✅ Ensure at least one valid HR Admin test account with bcrypt password exists
    try {
      const usersCol = db.collection('users');
      const hashedPassword = await bcrypt.hash('123456', 10);

      await usersCol.updateOne(
        { user_id: 'ADM001' },
        {
          $set: {
            user_id: 'ADM001',
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'hr',
            name: 'NMIT HR Admin',
            department: 'Human Resources',
            designation: 'HR Manager',
            status: 'Active'
          }
        },
        { upsert: true }
      );

      console.log('✅ HR Admin test account upserted (ADM001 / admin / password: 123456)');
    } catch (seedError) {
      console.warn('⚠️ Auto-seed check warning:', seedError.message);
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

const getDB = () => db;

module.exports = { connectToMongoDB, getDB };
