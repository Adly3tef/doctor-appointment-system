import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
  name: String,
  specialty: String,
  Image: String,
  description: String,
  experience: Number,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
