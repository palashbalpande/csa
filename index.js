const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;   

app.use("/api/v1/user", userRouter);    
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {  
  try {  
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Database connected`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
}   
  
main();    