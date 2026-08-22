const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./auth.env" });

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/Attendance";
const dbName = "Attendance";

async function seed() {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    console.log("Connected to MongoDB for seeding...");
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const adminUser = {
      user_id: "ADM001",
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin",
      name: "System Admin",
      department: "Management",
      createdAt: new Date()
    };

    const empUser = {
      user_id: "EMP001",
      username: "employee",
      email: "emp@example.com",
      password: hashedPassword,
      role: "Employee",
      name: "John Doe",
      department: "Engineering",
      createdAt: new Date()
    };

    await usersCollection.updateOne(
      { user_id: adminUser.user_id },
      { $setOnInsert: adminUser },
      { upsert: true }
    );

    await usersCollection.updateOne(
      { user_id: empUser.user_id },
      { $setOnInsert: empUser },
      { upsert: true }
    );

    console.log("✅ Seed data inserted/verified successfully!");
    console.log("Credentials:");
    console.log("1. Admin: ID=ADM001, Username=admin, Password=123456");
    console.log("2. Employee: ID=EMP001, Username=employee, Password=123456");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();
