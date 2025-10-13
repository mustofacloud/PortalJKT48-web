import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

export default function TheaterCard({ data, type }) {
  if (!data) return null;

  const { title, poster, member_count, date, seitansai } = data;
  const formattedDate = dayjs(date).format("DD MMM YYYY, HH:mm");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
      <div className="relative w-full aspect-[3/4] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover object-center"
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
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight min-h-[2.5rem]">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
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

        <p className="text-xs text-gray-600 mt-2">
          👤 {member_count || 0} member
        </p>
      </div>
    </div>
  );
}
