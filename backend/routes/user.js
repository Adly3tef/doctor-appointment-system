import express from "express";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password , role="user"} = req.body;
 if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const  userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  let token = jwt.sign({email,id:user._id,role:user.role}, process.env.SECRET_KEY,{expiresIn:"1h"});
  res.status(201).json({ message: "User registered successfully", token, user:{id:user._id, name:user.name, email:user.email, role:user.role} });  
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" }); 
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password is not correct" });
  }
  const token = jwt.sign({ email,id:user._id,role:user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
  res.status(200).json({ message: "User logged in successfully", token, user:{id:user._id, name:user.name, email:user.email, role:user.role} });
});
    
export default router;