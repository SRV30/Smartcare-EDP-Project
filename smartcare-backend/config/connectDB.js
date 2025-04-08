import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(
     "mongodb+srv://edp:edp3107@cluster0.jrqwowo.mongodb.net/smartcare?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log("connect DB");
  } catch (error) {
    console.log("Mongodb connect error", error);
    process.exit(1);
  }
}

export default connectDB;
