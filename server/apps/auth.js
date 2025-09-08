import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
 
    const collection = db.collection("users");
    await collection.insertOne(user)
 
    return res.json({
      message: "User has been created successfully"
    })
  })

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
    // query หา user ตาม username
    const user = await db.collection("users").findOne({
      username: req.body.username
    })

   // conditional logic ถ้าไม่มี user จะ return 404
    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }
    
    // ตรวจสอบรหัสผ่าน โดยใช้ bcrypt.compare
    const isValidPassword = await bcrypt.compare(
        req.body.password, 
        user.password
    );
        
    // conditional logic ถ้าไม่ถูกต้องจะ return 401
    if (!isValidPassword) {
      return res.status(401).json({
        message: "password not valid"
      })
    }

    // สร้าง token
    const token = jwt.sign(
        {
            id: user._id, 
            firstName: user.firstName, 
            lastName: user.lastName
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "900000"
        }
    );

    // ส่ง response กลับไปหน้า client
    return res.json({
        message: "Login successful",
        token,
    })
  
  });

export default authRouter;
