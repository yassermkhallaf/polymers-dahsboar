import mongoose from "mongoose";
let connected = false;

const connectDB = async (url = undefined) => {
  mongoose.set("strictQuery", true);

  //If the database is already connected, don't connect again
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }
  //connect to Mongodb
  try {
    await mongoose.connect(url || process.env.DATABASE_URL, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // How long to try connecting before timing out
      socketTimeoutMS: 45000, // How long to wait for operations before timing out
      retryWrites: true,
      connectTimeoutMS: 10000, // How long to wait for initial connection
    });
    connected = true;
    console.log("MongoDB connected..");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
