const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");
const { getDB } = require("../../config/db");
// const { ObjectId } = require("mongodb");

exports.uploadProfilePic = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    if (!req.file || !user_id) {
      return res.status(400).json({ message: "Missing file or user ID" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_pictures" },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary Upload Error:", err);
          return res.status(500).json({ message: "Cloudinary upload failed", error: err.message });
        }

        const db = getDB();
        const update = await db.collection("users").updateOne(
          { $or: [{ user_id: user_id }, { id: user_id }] },
          { $set: { profilePic: result.secure_url } }
        );

        if (update.modifiedCount >= 1 || update.matchedCount >= 1) {
          res.json({ message: "✅ Image uploaded successfully", imageUrl: result.secure_url });
        } else {
          res.status(404).json({ message: "❌ User not found in database" });
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("❌ Profile Pic Upload Error:", error);
    res.status(500).json({ message: "Internal server error during upload" });
  }
};
