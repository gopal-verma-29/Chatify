import express from "express"
import dotenv from "dotenv"


import authRoutes from "./Routes/auth.route.js";
import messageRoutes from "./Routes/message.route.js";

dotenv.config();

const app = express()

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
}) ;