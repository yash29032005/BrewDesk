import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiCoffeeCup } from "react-icons/ci";
import { MdOutlineDarkMode, MdDarkMode } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import LoginModal from "./LoginPage/LoginModal";
import RegisterModal from "./LoginPage/RegisterModal";
import ProfileModal from "./LoginPage/ProfileModal";

const NavBar = () => {
  const { user } = useContext(UserContext);
  const [dark, setDark] = useState(document.body.classList.contains("dark"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const location = useLocation();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  function openLogin() {
    setOpenLoginModal(true);
    setOpenRegisterModal(false);
  }

  function openRegister() {
    setOpenLoginModal(false);
    setOpenRegisterModal(true);
  }

  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("dark");
      setDark(false);
    } else {
      document.body.classList.add("dark");
      setDark(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  return (
    <nav
      className="bg-lightprimary dark:bg-darkprimary px-2 md:px-5 h-[60px] flex justify-between 
    items-center w-full"
    >
      {/* Left Section */}
      <div className="flex items-center">
        <CiCoffeeCup className="text-2xl md:text-4xl -me-1 md:-me-2 dark:text-white" />
        {location.pathname === "/employee" ? (
          <>
            <Link
              to={"/employee"}
              className="text-lg md:text-3xl font-bold dark:text-white"
            >
              BrewDesk
            </Link>
          </>
        ) : location.pathname === "/manager" ||
          location.pathname === "/manager/dashboard" ? (
          <>
            <Link
              to={"/manager"}
              className="text-lg md:text-3xl font-bold dark:text-white"
            >
              BrewDesk
            </Link>
            <Link
              to={"/manager/dashboard"}
              className="ms-3 px-4 py-2 rounded-4xl text-sm bg-lightsecondary
            dark:bg-darksecondary text-black dark:text-white"
            >
              Manager Dashboard
            </Link>
          </>
        ) : location.pathname === "/admin" ||
          location.pathname === "/admin/dashboard" ? (
          <>
            <Link
              to={"/admin"}
              className="text-lg md:text-3xl font-bold dark:text-white"
            >
              BrewDesk
            </Link>
            <Link
              to={"/admin/dashboard"}
              className="ms-3 px-4 py-2 rounded-4xl text-sm bg-lightsecondary
            dark:bg-darksecondary text-black dark:text-white"
            >
              Admin Dashboard
            </Link>
          </>
        ) : (
          <Link
            to={"/loginpage"}
            className="text-lg md:text-3xl font-bold dark:text-white"
          >
            BrewDesk
          </Link>
        )}
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center">
        <button
          onClick={toggleTheme}
          className="px-3 py-3 me-3 rounded-full bg-lightsecondary dark:bg-darksecondary
             text-black dark:text-white"
        >
          {dark ? <MdDarkMode /> : <MdOutlineDarkMode />}
        </button>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpenProfileModal((prev) => !prev)}
              className="px-4 py-2 rounded-md hover:opacity-90 transition text-black
        dark:text-white bg-lightsecondary dark:bg-darksecondary"
            >
              <span className="font-bold">{user.emp_name}</span>
              <span className="text-lg">⌄</span>
            </button>

            {/* Dropdown */}
            {openProfileModal && <ProfileModal />}
          </div>
        ) : (
          <Link
            onClick={openLogin}
            className="px-4 py-2 rounded-md hover:opacity-90 transition text-black
      dark:text-white bg-lightsecondary dark:bg-darksecondary"
          >
            Login
          </Link>
        )}
        {openLoginModal ? (
          <LoginModal
            onClose={() => setOpenLoginModal(false)}
            openRegister={openRegister}
          />
        ) : openRegisterModal ? (
          <RegisterModal
            onClose={() => setOpenRegisterModal(false)}
            openLogin={openLogin}
          />
        ) : null}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl dark:text-white"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="absolute top-[60px] left-0 w-full bg-lightprimary
         dark:bg-darkprimary flex flex-col items-center gap-3 py-4 shadow-md md:hidden z-50"
        >
          <button
            onClick={toggleTheme}
            className="px-3 py-3 rounded-full bg-lightsecondary dark:bg-darksecondary
             text-black dark:text-white"
          >
            {dark ? <MdDarkMode /> : <MdOutlineDarkMode />}
          </button>
          {user ? (
            <div className="relative">
              <Link
                onClick={() => setOpenProfileModal((prev) => !prev)}
                className="px-4 py-2 rounded-md hover:opacity-90 transition text-black
              dark:text-white bg-lightsecondary da
              rk:bg-darksecondary"
                style={{ height: "calc(100vh - 100px)" }}
              >
                {user.name}
              </Link>
              {openProfileModal && (
                <ProfileModal onClose={() => setOpenProfileModal(false)} />
              )}
            </div>
          ) : (
            <Link
              onClick={openLogin}
              className="px-4 py-2 rounded-md hover:opacity-90 transition text-black
        dark:text-white bg-lightsecondary dark:bg-darksecondary"
            >
              Login
            </Link>
          )}

          {openLoginModal ? (
            <LoginModal
              onClose={() => setOpenLoginModal(false)}
              openRegister={openRegister}
            />
          ) : openRegisterModal ? (
            <RegisterModal
              onClose={() => setOpenRegisterModal(false)}
              openLogin={openLogin}
            />
          ) : null}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
