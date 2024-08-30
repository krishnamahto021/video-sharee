import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";
import passportJwtStrategy from "./config/passwordJwtStrategy";
import path from "path";

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

/*---------------------DEPLOYMENT-----------------------*/

// Get the directory name
const __dirname1 = path.resolve();

if ((process.env.NODE_ENV as string) === "production") {
  console.log("Serving static files for production");

  // Adjust the path to go up one level from backend to reach the frontend folder
  app.use(express.static(path.join(__dirname1, "..", "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "..", "frontend", "dist", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Running in development mode");
  });
}

/*---------------------DEPLOYMENT-----------------------*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
