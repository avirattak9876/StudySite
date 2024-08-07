import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import courseRouter from "./src/routes/courseRoute.js";
import userRouter from "./src/routes/userRoute.js";
import profileRouter from "./src/routes/profileRoute.js";
import paymentRouter from "./src/routes/paymentRoute.js";
import connectDB from "./src/connection/dbconnection.js";
import { connectionCloud } from "./src/connection/cloudinary.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);


app.use("/api/v1/auth", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Function to initialize the server
async function startServer() {
  try {
    await connectDB(); 
    await connectionCloud(); 

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); 
  }
}


startServer();
