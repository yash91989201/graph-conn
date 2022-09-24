import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/graph_conn";

const connectDB = async () => {
  const conn = await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDb at PORT:${conn.connection.port}`.bgGreen);
};

export default connectDB;
