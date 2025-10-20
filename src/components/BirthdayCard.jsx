import dayjs from "dayjs";
import "dayjs/locale/id";
import { useTheme } from "../contexts/ThemeContext";

dayjs.locale("id");

export default function BirthdayCard({ data }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const { name, birthdate, img } = data;
  const formattedDate = dayjs(birthdate).format("DD MMMM");

  return (
    <div className={`flex items-center gap-4 rounded-xl p-3 shadow-sm ${
      isDark
        ? 'bg-gradient-to-r from-gray-700 to-gray-200'
        : 'bg-gradient-to-r from-blue-100 to-pink-100 border border-gray-200'
    }`}>
      <img
        src={img}
        alt={name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{name}</h4>
        <p className="text-sm text-red-600">🎂 {formattedDate}</p>
      </div>
    </div>
  );
}
