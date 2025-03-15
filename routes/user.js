// const express = require("express");
// const userRouter = express.Router();

const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcrypt"); 
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const userRouter = Router();

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

userRouter.post("/signup", async function (req, res) {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Incorrect data format",
      error: validation.error.message,
    });
  }

  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 4);

  try {
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({ message: "Signup Succeeded" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(400).json({ message: "Signup Failed", error: error.message });
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_CODE);

    res.json({ message: "Login Succeeded", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: "Login Failed", error: error.message });
  }
});

userRouter.get("/purchases", function (req, res) {});

module.exports = {
  userRouter,
};
