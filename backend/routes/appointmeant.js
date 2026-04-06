import express from "express";
import Appointment from "../models/appointMeantSchema.js";
import auth from "../auth/middleWare.js";

const router = express.Router();

router.post("/createAppointment", auth(), async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;
    if (!doctor || !date || !reason) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const newAppointment = new Appointment({
      user: req.user.id,
      doctor: doctor,
      date,
      reason,
    });
    await newAppointment.save();
    res
      .status(201)
      .json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/myAppointments", auth(), async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).populate(
      "doctor",
      "name specialty",
    );
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/deleteAppointments/:id", auth(), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this appointment" });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
