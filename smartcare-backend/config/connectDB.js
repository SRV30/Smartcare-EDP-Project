import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// if (!process.env.MONGODB_URL) {
//   throw new Error("Please provide MONGODB_URL");
// }

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://atlas-sample-dataset-load-67f2c4664b4c9b7ca929b95d:12345678@cluster0.jrqwowo.mongodb.net/edp?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connect DB");
  } catch (error) {
    console.log("Mongodb connect error", error);
    process.exit(1);
  }
}

export default connectDB;
