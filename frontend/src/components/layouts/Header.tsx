import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Menu, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DirectEdLogo from "../../assets/image.webp";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick}: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 shadow-md bg-gradient-to-r from-white to-amber-100 dark:bg-gray-900">
      {/* Left: Logo + Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg text-gray-800 dark:text-gray-100"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="bg-black/20 rounded-lg inline-block">
          <img 
            src={DirectEdLogo} 
            alt="DirectEd Logo" 
            className="w-32 p-2" 
          />
        </div>
        
      </div>

      {/* Middle: Search */}
      <div className="hidden md:block flex-1 mx-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-4 py-2 border dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-gray-800 dark:text-gray-100"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white">
                <User size={18} />
                <span>{user.name}</span>
              </button>

              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-lg w-40">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>

                //Show only Logout if logged in
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Logout
                </button>
                
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 bg-transparent text-black dark:text-white border-black dark:border-white border-2 w-full text-left rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 bg-amber-700 text-black dark:text-white w-full text-left"
              >
                Signup
              </Link>
            </>
            
          )
        }
      </div>
    </header>
  );
};
