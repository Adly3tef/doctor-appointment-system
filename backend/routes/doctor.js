import express from "express";
import Doctor from "../models/doctorSchema.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/addDoctors", upload.single("Image"),async (req, res) => {
    try {
    const { name, specialty, description, experience } = req.body;
    const Image = req.file ? req.file.path : null;
    if (!name || !specialty || !description || !experience || !Image) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newDoctor = new Doctor({
      name,
      specialty,
      description,
      experience,
      Image: req.file?.filename || null,
    });
    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
}catch (error) {res.status(500).json({ message: "Server error", error: error.message });}
});


router.get("/getDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ doctors });
}catch (error) {res.status(500).json({ message: "Server error", error: error.message })}});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
