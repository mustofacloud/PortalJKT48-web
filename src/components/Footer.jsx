import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`shadow-inner py-4 text-center text-sm border-t ${
      isDark
        ? 'bg-slate-900 text-gray-400 border-slate-700'
        : 'bg-gray-100 text-gray-600 border-gray-300'
    }`}>
      <p>
        © {new Date().getFullYear()} Portal JKT48 — Made by MasThopa
      </p>
    </footer>
  );
};

export default Footer;
