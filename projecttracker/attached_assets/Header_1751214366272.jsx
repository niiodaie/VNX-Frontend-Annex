import React from "react";

const Header = () => {
  const isLoggedIn = true; // mock for now

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Nexus Tracker</h1>
      <div>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, User</span>
            <img
              src="https://ui-avatars.com/api/?name=User"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
        ) : (
          <div className="flex gap-4">
            <button className="text-blue-600">Sign In</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
