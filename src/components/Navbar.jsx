import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CalendarDays,
  Newspaper,
  PlayCircle,
  Info,
} from "lucide-react";
import logoHeader from "../assets/logo_header.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={16} /> },
    { to: "/member", label: "Member", icon: <Users size={16} /> },
    { to: "/jadwal", label: "Jadwal", icon: <CalendarDays size={16} /> },
    { to: "/news", label: "News", icon: <Newspaper size={16} /> },
    { to: "/recent-live", label: "Recent Live", icon: <PlayCircle size={16} /> },
    { to: "/about", label: "About", icon: <Info size={16} /> },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0 rounded-b-3xl">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* 🔻 Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoHeader}
            alt="PortalJKT48"
            className="h-6 sm:h-8 w-auto object-contain"
          />
        </Link>

        {/* 🔻 Tombol toggle mobile */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* 🔻 Menu navigasi */}
        <ul
          className={`
            md:flex md:items-center md:gap-2.5
            absolute md:static bg-white 
            w-[90%] md:w-auto mx-auto md:mx-0
            left-0 right-0 top-[64px] md:top-auto 
            rounded-3xl shadow-md md:shadow-none 
            transition-all duration-300 ease-in-out transform origin-top 
            ${open
              ? "scale-y-100 opacity-100"
              : "scale-y-0 opacity-0 md:opacity-100 md:scale-y-100"}
          `}
        >
          {navLinks.map((item) => (
            <li key={item.to} className="p-3 md:p-0 text-center relative group">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `
                  flex items-center gap-2 justify-center md:justify-start
                  font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }
                `
                }
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>

              {/* 🔻 Underline animasi */}
              <span
                className={`
                  absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 rounded-full 
                  transition-all duration-300 ease-out 
                  group-hover:w-full
                `}
              ></span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
