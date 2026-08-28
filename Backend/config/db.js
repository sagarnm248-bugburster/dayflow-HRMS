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
    
    // Use MONGO_DB_NAME if specified, else use the database specified in MONGO_URI
    db = process.env.MONGO_DB_NAME ? client.db(process.env.MONGO_DB_NAME) : client.db();
    console.log(`✅ MongoDB connected successfully to database: "${db.databaseName}"`);

    // ✅ Ensure at least one valid HR Admin test account with bcrypt password exists
    try {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const adminDoc = {
        user_id: 'ADM001',
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'hr',
        name: 'NMIT HR Admin',
        department: 'Human Resources',
        designation: 'HR Manager',
        status: 'Active'
      };

      // Upsert in primary database
      await db.collection('users').updateOne(
        { user_id: 'ADM001' },
        { $set: adminDoc },
        { upsert: true }
      );

      // Also upsert in 'Attendance' collection if dbName differs
      if (db.databaseName !== 'Attendance') {
        try {
          await client.db('Attendance').collection('users').updateOne(
            { user_id: 'ADM001' },
            { $set: adminDoc },
            { upsert: true }
          );
        } catch (e) {}
      }

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
