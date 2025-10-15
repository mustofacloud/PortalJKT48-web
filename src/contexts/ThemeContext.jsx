import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Selalu return true untuk dark mode
    return true;
  });

  // Terapkan tema ke <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark"); // Selalu tambahkan class dark
    localStorage.setItem("theme", JSON.stringify(true));
  }, []);

  // Sinkronisasi antar tab/browser
  useEffect(() => {
    const syncTheme = (e) => {
      if (e.key === "theme") {
        try {
          const newTheme = JSON.parse(e.newValue);
          setIsDark(newTheme);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
