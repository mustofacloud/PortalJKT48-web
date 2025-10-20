import dayjs from "dayjs";
import "dayjs/locale/id";
import { useTheme } from "../contexts/ThemeContext";

dayjs.locale("id");

export default function TheaterCard({ data, type }) {
  const { isDark } = useTheme();

  if (!data) return null;

  const { title, poster, member_count, date, seitansai } = data;
  const formattedDate = dayjs(date).format("DD MMM YYYY, HH:mm");

  return (
    <div className={`border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full ${
      isDark ? 'bg-slate-900 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <div className={`relative w-full aspect-[3/4] flex items-center justify-center overflow-hidden ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover object-center hover:scale-115 transition duration-250"
          loading="lazy"
        />

        {type === "upcoming" && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow">
            UPCOMING
          </span>
        )}
        {type === "recent" && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
            RECENT
          </span>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between p-3">
        <div>
          <h3 className={`font-semibold text-sm line-clamp-2 leading-tight min-h-[2.5rem] ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-white/70' : 'text-gray-600'
          }`}>{formattedDate}</p>
        </div>

        {seitansai && seitansai.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {seitansai.map((s, idx) => (
              <img
                key={idx}
                src={s.img}
                alt={s.name}
                title={s.name}
                className="w-6 h-6 rounded-full object-cover border border-pink-400 shrink-0"
              />
            ))}
            <span className="text-xs text-pink-600 font-medium whitespace-nowrap">
              🎂 Seitansai
            </span>
          </div>
        )}

        <p className={`text-xs mt-2 ${
          isDark ? 'text-gray-600' : 'text-gray-500'
        }`}>
          👤 {member_count || 0} member
        </p>
      </div>
    </div>
  );
}
