import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";
import { client } from "./utils/db.js";
import authRouter from "./apps/auth.js";
import dotenv from "dotenv";

async function init() {
  dotenv.config(); // <-- ติดตั้ง dotenv
  
  const app = express(); // <-- สร้าง express app
  const port = 4000;

  await client.connect(); // <-- เชื่อมต่อกับ MongoDB

  app.use(cors()); // <-- ใช้ cors
  app.use(bodyParser.json()); // <-- ใช้ bodyParser
  app.use("/posts", postRouter); // <-- ใช้ postRouter
  app.use("/auth", authRouter); // <-- ใช้ authRouter

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
