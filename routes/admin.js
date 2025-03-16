const { Router } = require("express");
const adminRouter = Router();

const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt"); // ✅ Change this to require
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

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

adminRouter.post("/signup", async function (req, res) {
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
    await adminModel.create({
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

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_CODE);

    res.json({ message: "Login Succeeded", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: "Login Failed", error: error.message });
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const creatorId = req.adminId;
  const { title, description, price, imageUrl } = req.body;
  const course = await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId,
  });
  res.json({ message: "Course created", courseId: course._id });
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const creatorId = req.adminId;
  const { title, description, price, imageUrl, courseId } = req.body;
  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId,
    },
    {
      title,
      description,
      price,
      imageUrl,
    }
  );
  res.json({ message: "Course updated", courseId: course._id });
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const creatorId = req.adminId;
  const myCourses = await courseModel.find({ creatorId });
  res.json({ message: "Courses retrieved", courses: myCourses });
});

module.exports = {
  adminRouter,
}; 
