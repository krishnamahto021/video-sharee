import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";
import passportJwtStrategy from "./config/passwordJwtStrategy";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

connectDB();
app.use(passportJwtStrategy.initialize());

// for parsing the data from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router configuration
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
