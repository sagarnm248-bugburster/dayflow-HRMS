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
      const adminUser = await usersCol.findOne({ $or: [{ user_id: 'ADM001' }, { username: 'admin' }] });

      const hashedPassword = await bcrypt.hash('123456', 10);

      if (!adminUser) {
        await usersCol.insertOne({
          user_id: 'ADM001',
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'hr',
          name: 'NMIT HR Admin',
          department: 'Human Resources',
          designation: 'HR Manager',
          status: 'Active',
          createdAt: new Date()
        });
        console.log('✅ Created default HR Admin test account (ADM001 / admin)');
      } else if (!adminUser.password || (!adminUser.password.startsWith('$2b$') && !adminUser.password.startsWith('$2a$'))) {
        await usersCol.updateOne(
          { _id: adminUser._id },
          { $set: { password: hashedPassword } }
        );
        console.log('✅ Updated HR Admin password with valid bcrypt hash');
      }
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
