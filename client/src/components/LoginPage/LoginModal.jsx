import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, openRegister }) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const loggedInUser = result.data.user;

      setUser(loggedInUser);
      setEmail("");
      setPassword("");
      toast.success(result.data.message);
      onClose();

      // Navigate based on role
      if (loggedInUser.emp_role === "employee") navigate("/employee");
      else if (loggedInUser.emp_role === "manager") navigate("/manager");
      else if (loggedInUser.emp_role === "admin") navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-70 backdrop-blur-xs flex items-center justify-center 
      z-50 transition-opacity duration-300"
        onClick={onClose}
      >
        <div
          className="bg-lightprimary dark:bg-darkprimary rounded-2xl p-4 w-11/12 md:w-5/12 shadow-2xl transform transition-all 
        duration-300 scale-100 hover:scale-[1.01]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-black dark:text-white">
                Login
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition duration-200 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="email" className="text-sm ms-1 font-bold">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter email"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
            />
          </div>
          <div className="mt-5 text-lightgrey dark:text-darkgrey flex flex-col">
            <label htmlFor="password" className="text-sm ms-1 font-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
              required
              className="w-full p-2 rounded-lg bg-lightsecondary dark:bg-darksecondary text-black dark:text-white text-sm"
            />
          </div>

          <div className="mt-2 text-lightgrey dark:text-darkgrey flex flex-col">
            <label className="text-sm ms-1 font-bold">
              Don't have an account?{" "}
              <span className="text-blue-600" onClick={openRegister}>
                Register
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full px-5 py-2 bg-gradient-to-b from-lightternary to-lightprimary 
                dark:from-darkternary dark:to-darkprimary rounded-lg text-black dark:text-white
                hover:opacity-90"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
