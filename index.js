const express = require("express");

require("dotenv").config();

const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Database connected`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
}
   
main();   
