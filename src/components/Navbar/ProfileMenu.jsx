import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ setIsProfileOpen }) => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('authToken'); // Assuming user is logged in if this exists

  const handleClick = (route) => {
    setIsProfileOpen(false);
    navigate(route);
  };

  const logout = () => {
    localStorage.clear(); // Clear user data
    document.cookie = 'yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-10">
      <ul>
        {userToken ? (
          <>
            <li
              className="hover:bg-gray-200 cursor-pointer text-black px-4 py-2"
              onClick={() => handleClick('/account-summary')}
            >
              Profile
            </li>
            <li
              className="hover:bg-gray-200 cursor-pointer text-black px-4 py-2"
              onClick={logout}
            >
              Log Out
            </li>
          </>
        ) : (
          <>
            <li
              className="hover:bg-gray-200 cursor-pointer text-black px-4 py-2"
              onClick={() => handleClick('/login')}
            >
              Login
            </li>
            <li
              className="hover:bg-gray-200 cursor-pointer text-black px-4 py-2"
              onClick={() => handleClick('/register')}
            >
              Register
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfileMenu;
