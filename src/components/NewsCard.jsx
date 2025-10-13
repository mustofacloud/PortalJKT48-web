import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";

dayjs.locale("id");

export default function NewsCard({ data }) {
  const date = dayjs(data.date).format("DD MMMM YYYY");

  return (
    <Link
      to={`/news/${data.id}`}
      state={{ news: data }}
      className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-red-500 transition"
    >
      <div className="flex gap-3 items-start">
        <img
          src={`https://www.jkt48.com${data.label}`}
          alt="icon"
          className="w-8 h-8 object-contain"
        />
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
            {data.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
    </Link>
  );
}
