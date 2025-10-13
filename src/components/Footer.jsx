const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-10 py-4 text-center text-sm text-gray-600">
      <p>
        © {new Date().getFullYear()} Portal JKT48 — Built with ❤️ using{" "}
        <a
          href="https://tailwindcss.com/docs"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          TailwindCSS v4
        </a>
      </p>
      <p>
        Made by MasThopa
      </p>
    </footer>
  );
};

export default Footer;
