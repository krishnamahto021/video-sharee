import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

connectDB();
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
