import React, { useState, useRef, useEffect } from "react";
import NotificationBell from "../Navbar/NotificationBell";
import ProfileMenu from "../Navbar/ProfileMenu";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  ); 

  const profileMenuRef = useRef(null);
  const profilePicRef = useRef(null);

  //  Fetch Profile Picture from Database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setProfilePic(response.data.profilePic || profilePic);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfile();
  }, []);

  // Close Profile Menu When Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profilePicRef.current &&
        !profilePicRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false)
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]); 

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 z-40 shadow-lg backdrop-blur-md bg-opacity-80">
      {/*  Logo Section */}
      <div
        className="text-2xl font-extrabold cursor-pointer hover:text-gray-200 transition-all duration-300"
        onClick={() => navigate("/dashboard")}
      >
        Finance Manager
      </div>

      {/*  Notification & Profile */}
      <div className="flex items-center space-x-6 relative">
        <NotificationBell />
        <div className="relative">
          <img
            src={profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md hover:scale-110 transition-all duration-300"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            ref={profilePicRef}
          />
          {/*  Smooth Dropdown Animation */}
          {isProfileOpen && (
            <div ref={profileMenuRef} className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
              <ProfileMenu setIsProfileOpen={setIsProfileOpen} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
