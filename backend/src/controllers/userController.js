import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createUser = async (req, res) => {
    const { name, role, password } = req.body;
    const profileImage = req.file?.path;
    if (!name || !role || !password) {
      return res.status(400).json({ message: "Name, role and password are required" });
    }

    const existingUser = await User.findOne({ name, role });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, role, password: hashedPassword, profileImage });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully", user })

};

export const loginUser = async (req, res) => {
    const { name, password } = req.body;
console.log(req.body);
    if (!name || !password) {
      return res.status(400).json({ message: "name and password are required" });
    }
    const user = await User.findOne({ name});
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
     const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

    const token = jwt.sign( { id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" } );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: "Login successful", user });

};


