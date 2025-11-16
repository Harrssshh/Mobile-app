// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // keep id compatibility: store original numeric/string id in legacyId (optional)
  legacyId: { type: String, index: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
}, { timestamps: true });

export default mongoose.models?.User || mongoose.model("User", userSchema);
