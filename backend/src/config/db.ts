import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`Successfully connnect to the database`);
  } catch (error) {
    console.log(`Error in connecting to the database ${error}`);
  }
};

export default connectDB;
