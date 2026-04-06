import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    Image: String,
})

const Department = mongoose.model("Department", departmentSchema);

export default Department;