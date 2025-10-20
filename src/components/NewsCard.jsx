import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

dayjs.locale("id");

export default function NewsCard({ data }) {
  const { isDark } = useTheme();
  const date = dayjs(data.date).format("DD MMMM YYYY");

  return (
    <Link
      to={`/news/${data.id}`}
      state={{ news: data }}
      className={`block border rounded-xl p-4 shadow-sm hover:shadow-md transition ${
        isDark
          ? 'bg-slate-900 border-gray-200 hover:border-red-500'
          : 'bg-white border-gray-300 hover:border-red-400'
      }`}
    >
      <div className="flex gap-3 items-start">
        <img
          src={`https://www.jkt48.com${data.label}`}
          alt="icon"
          className="w-8 h-8 object-contain"
        />
        <div>
          <h3 className={`font-semibold text-sm leading-snug line-clamp-2 ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            {data.title}
          </h3>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-500' : 'text-blackgray-600'
          }`}>{date}</p>
        </div>
      </div>
    </Link>
  );
}
