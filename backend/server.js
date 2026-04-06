import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import doctorRoutes from "./routes/doctor.js";
import appointmeantRoutes from "./routes/appointmeant.js";
import departmentRoutes from "./routes/departmeant.js"
import fs from "fs";

// بعد الـ imports
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const app = express();


app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointmeants", appointmeantRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/uploads", express.static("uploads"));
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
