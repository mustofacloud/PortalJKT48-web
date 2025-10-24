import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const Layout = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={`flex flex-col min-h-dvh transition-colors duration-500 ${isDark ? 'dark' : ''}`}>
      <div className="md:flex">
        <div className="md:w-16 xl:w-64 md:flex-shrink-0 transition-all duration-300 ease-in-out">
          <Navbar />
        </div>
        <div className="md:flex-1 md:px-4 md:mt-3 transition-all duration-300 ease-in-out">
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-grow pt-20 md:pt-8 container mx-auto"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
