import express from "express"
import {ENV} from "./lib/env.js";
import path from "path";


import authRoutes from "./Routes/auth.route.js";
import messageRoutes from "./Routes/message.route.js";
import connectDB from "./lib/db.js";


const app = express()
const __dirname = path.resolve();

const PORT = ENV.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


//Make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html"))
  })
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  connectDB();
});