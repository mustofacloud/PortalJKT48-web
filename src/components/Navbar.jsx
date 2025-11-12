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
  const [open, setOpen] = useState(false); // keep for legacy but not used on mobile
  const [openMore, setOpenMore] = useState(false);
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
      {/* Mobile: Bottom navigation (shows 4 items + More) */}
      <nav className={`md:hidden fixed w-full z-30 bottom-0 left-0 rounded-t-3xl transition-colors duration-300 ${isDark ? 'bg-slate-900/95' : 'bg-white/95 shadow-md'}`}>
        <div className="container mx-auto flex items-center justify-between px-3 py-2">
          {/* first 4 links */}
          <div className="w-full flex items-center justify-between">
            {navLinks.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpenMore(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 text-xs px-2 py-1 rounded-md transition-colors duration-150 w-1/5 ${
                    isActive
                      ? 'text-red-400'
                      : isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'
                  }`
                }
              >
                {item.icon}
                <span className="text-[10px] mt-1 hidden sm:block">{item.label}</span>
              </NavLink>
            ))}

            {/* More button */}
            <button
              onClick={() => setOpenMore((s) => !s)}
              aria-label={openMore ? "Tutup menu lainnya" : "Buka menu lainnya"}
              aria-expanded={openMore}
              className={`flex flex-col items-center justify-center gap-1 text-xs px-2 py-1 rounded-md transition-colors duration-150 w-1/5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <span style={iconStyle} className="leading-none">{openMore ? '✕' : '☰'}</span>
              <span className="text-[10px] mt-1 hidden sm:block">Lainnya</span>
            </button>
          </div>

          {/* Popover for remaining links */}
          <div className={`absolute left-0 right-0 bottom-16 flex justify-center pointer-events-none`}> 
            <div
              className={`pointer-events-auto w-[90%] rounded-xl shadow-lg transition-all duration-200 ease-in-out ${isDark ? 'bg-slate-900/95 text-gray-300' : 'bg-white/95 text-gray-700'} ${openMore ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 origin-bottom'}`}
            >
              <ul className="flex flex-col divide-y">
                {navLinks.slice(4).map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setOpenMore(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                          isActive ? 'text-red-400' : ''
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}

                {/* Theme toggle inside More */}
                <li>
                  <button
                    onClick={() => { toggleTheme(); setOpenMore(false); }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    <span>Toggle Theme</span>
                  </button>
                </li>
              </ul>
            </div>
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
