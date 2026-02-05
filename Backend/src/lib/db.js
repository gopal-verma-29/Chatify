import mongoose from "mongoose";
import {ENV} from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${ENV.MONGO_URI}Chatify-app`)
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;