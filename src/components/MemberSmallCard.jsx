import { useTheme } from "../contexts/ThemeContext";

export default function MemberSmallCard({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const { name, img } = data;

  return (
    <div className={`flex flex-col items-center border rounded-xl p-2 shadow-sm hover:shadow-md transition ${
      isDark
        ? 'bg-slate-900 border-slate-700'
        : 'bg-white border-gray-300'
    }`}>
      <div className={`w-full aspect-[3/4] rounded-lg overflow-hidden ${
        isDark ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className={`mt-2 text-xs font-medium text-center truncate ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        {name}
      </p>
    </div>
  );
}
