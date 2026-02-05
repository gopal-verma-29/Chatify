import generateToken from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const jwtSecret = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        //Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        //Check if user has valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Here you would typically check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // 123456 => $jfnoggndfogn203i40293 (password hashing)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email, 
                password: newUser.password,
            });

        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 