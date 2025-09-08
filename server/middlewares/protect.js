import jwt from "jsonwebtoken";

// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
export const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if(!token || !token.startsWith("Bearer ")){ // <-- ตรวจสอบว่า Token มีหรือไม่มี และ Token มีหน้าตาของตัว Token หรือไม่
    return res.status(401).json({ 
        message: "Token has invalid format" 
    });
  }

  const tokenWithoutBearer = token.split(" ")[1]; // <-- นำ Token ออกจากหัวข้อที่อยู่ก่อนหน้า Bearer

  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => { // <-- ตรวจสอบ token ถูกต้องและยังไม่หมดอายุหรือไม่
    if(err){
      return res.status(401).json({ 
        message: "Token is invalid" }); // <-- ถ้า token ไม่ถูกต้องจะ return 401
    }
    req.user = payload; // <-- นำข้อมูลผู้ใช้ที่แนบมากับ Token ใส่ลงไปใน Property user ของ Object req เพื่อที่จะนำไปใช้ต่อใน Controller Function ได้
    next();
  });

};