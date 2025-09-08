import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();

  const login = async (data) => { // <-- รับ parameter data ข้อมูลที่ส่งมาจะมี username และ password
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    const result = await axios.post("http://localhost:4000/auth/login", data) // <-- ส่ง request ไปที่ API POST /login
    const token = result.data.token // <-- เก็บ token จาก response
    localStorage.setItem("token", token) // <-- เก็บ token ไว้ใน Local Storage
    const userDataFromToken = jwtDecode(token); // <-- เก็บ userDataFromToken จาก token
    setState({ ...state, user: userDataFromToken }) // <-- เก็บ userDataFromToken ไว้ใน state
    navigate("/");
  };

  const register = async (data) => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    await axios.post(`http://localhost:4000/auth/register`, data);
    navigate("/login");
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token"); // <-- ลบ token ออกจาก Local Storage
    setState({ ...state, user: null }); // <-- ลบ user ออกจาก state
  };

  const isAuthenticated = Boolean(localStorage.getItem("token")); // <-- ตรวจสอบว่า token มีอยู่ใน Local Storage หรือไม่

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
