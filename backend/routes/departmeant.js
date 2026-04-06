import express from "express";
import Department from "../models/departmeantSchema.js";
import auth from "../auth/middleWare.js";
import multer from "multer";

const router = express.Router();

// ─── Multer Storage ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// ─── GET All Departments ──────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── POST Add Department (Admin Only) ────────────────────────────
router.post(
  "/addDepartments",
  auth("admin"),
  upload.single("Image"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const newDepartment = await Department.create({
        name,
        description,
        Image: req.file?.filename || null,
      });

      res.status(201).json(newDepartment);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

export default router;
