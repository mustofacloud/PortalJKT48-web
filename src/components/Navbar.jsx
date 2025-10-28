import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CalendarDays,
  Newspaper,
  PlayCircle,
  Info,
  Grid3X3,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import logoHeader from "../assets/logo_header.png";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const iconStyle = {
    fontSize: "24px"
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home style={iconStyle} /> },
    { to: "/member", label: "Member", icon: <Users style={iconStyle} /> },
    { to: "/jadwal", label: "Jadwal", icon: <CalendarDays style={iconStyle} /> },
    { to: "/news", label: "News", icon: <Newspaper style={iconStyle} /> },
    { to: "/recent-live", label: "Recent Live", icon: <PlayCircle style={iconStyle} /> },
    { to: "/multiroom", label: "Multiroom", icon: <Grid3X3 style={iconStyle} /> },
    { to: "/about", label: "About", icon: <Info style={iconStyle} /> },
  ];

  return (
    <>
      {/* Mobile: Original topbar navbar */}
      <nav className={`md:hidden fixed w-full z-20 top-0 left-0 rounded-b-3xl transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center p-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoHeader}
              alt="PortalJKT48"
              className="h-6 sm:h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            <ul
              className={`
                absolute rounded-xl
                w-[90%] mx-auto
                left-0 right-0 top-[64px] shadow-md
                transition-all duration-300 ease-in-out transform origin-top
                ${isDark ? 'bg-slate-900/90' : 'bg-white/90 shadow-lg'}
                ${open
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0"}
              `}
            >
              {navLinks.map((item) => (
                <li key={item.to} className="p-3 text-center relative group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-2 justify-center
                      font-medium transition-all duration-200
                      ${
                        isActive
                          ? "text-red-400"
                          : isDark ? "text-gray-300 hover:text-red-400" : "text-gray-700 hover:text-red-400"
                      }
                    `
                    }
                    onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>

                  <span
                    className={`
                      absolute bottom-0 left-0 w-0 h-[2px] bg-red-400 rounded-full
                      transition-all duration-300 ease-out
                      group-hover:w-full
                    `}
                  ></span>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleTheme}
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 cursor-pointer`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              onClick={() => setOpen(!open)}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop: Sidebar */}
      <nav
        className={`
          hidden md:flex md:flex-col md:h-screen md:w-16 xl:w-64 md:sticky md:top-0 p-0 transition-all duration-300 ease-in-out
          ${isDark ? 'bg-slate-900' : 'bg-white shadow-lg'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link to="/" className="flex place-content-center gap-2 mb-8">
            <img
              src="/logo.svg"
              alt="PortalJKT48"
              className="h-6 xl:h-8 w-auto object-contain"
            />
          </Link>

          {/* Nav Links */}
          <ul className="flex flex-col gap-4 flex-grow">
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-2 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-red-400 text-white"
                        : isDark ? "text-gray-300 hover:bg-red-600 hover:text-white" : "text-gray-700 hover:bg-red-600 hover:text-white"
                    }
                  `
                  }
                >
                  {item.icon}
                  <span className="xl:inline hidden">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Theme Toggle */}
          <div className="mt-auto">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg font-medium transition-all duration-200 w-full cursor-pointer ${
                isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
