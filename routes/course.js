const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { courseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  try {
    await purchaseModel.create({
      userId,
      courseId,
    });
    res.json({ message: "Purchase Succeeded" });
  } catch (error) {
    console.error("Error during purchase:", error);
    res.status(400).json({ message: "Purchase Failed", error: error.message });
  }
});

courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});

  res.json({courses});
});

module.exports = {
  courseRouter,
};
