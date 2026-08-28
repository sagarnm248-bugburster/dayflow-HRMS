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

    // ✅ Ensure valid HR Admin & Employee test accounts with bcrypt passwords exist
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

      const empDoc = {
        user_id: 'EMP001',
        username: 'employee',
        email: 'employee@example.com',
        password: hashedPassword,
        role: 'employee',
        name: 'John Doe',
        department: 'Engineering',
        designation: 'Software Engineer',
        status: 'Active'
      };

      // Upsert in primary database
      await db.collection('users').updateOne({ user_id: 'ADM001' }, { $set: adminDoc }, { upsert: true });
      await db.collection('users').updateOne({ user_id: 'EMP001' }, { $set: empDoc }, { upsert: true });

      // Also upsert in 'Attendance' collection if dbName differs
      if (db.databaseName !== 'Attendance') {
        try {
          await client.db('Attendance').collection('users').updateOne({ user_id: 'ADM001' }, { $set: adminDoc }, { upsert: true });
          await client.db('Attendance').collection('users').updateOne({ user_id: 'EMP001' }, { $set: empDoc }, { upsert: true });
        } catch (e) {}
      }

      console.log('✅ HR Admin & Employee test accounts upserted with bcrypt passwords');
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
