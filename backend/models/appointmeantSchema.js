import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    doctor: {
        type:mongoose.Schema.Types.ObjectId,ref:"Doctor"
    },
    date: Date,
    reason: String,
})

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;