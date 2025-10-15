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
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-grow pt-20 container mx-auto px-4"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
