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

// For parsing the data from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router configuration
app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
