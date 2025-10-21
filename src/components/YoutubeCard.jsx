import dayjs from "dayjs";
import "dayjs/locale/id";
import { useTheme } from "../contexts/ThemeContext";

dayjs.locale("id");

export default function YoutubeCard({ data }) {
  const { isDark } = useTheme();
  const date = dayjs(data.date).format("DD MMMM YYYY");

  const formatViews = (views) => {
    const num = parseInt(views);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block group cursor-pointer ${
        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
      } rounded-lg overflow-hidden transition-colors duration-200`}
    >
      <div className="relative">
        <img
          src={data.thumbnails.medium.url}
          alt="thumbnail"
          className="w-full aspect-video object-cover rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
        </div>
      </div>

      <div className="p-3">
        <div className="flex gap-3">
          <img
            src={data.profilePict.medium.url}
            alt={data.channelTitle}
            className="w-9 h-9 rounded-full flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-tight line-clamp-2 mb-1 ${
              isDark ? 'text-white' : 'text-black'
            } group-hover:text-gray-400`}>
              {data.title}
            </h3>

            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } mb-1`}>
              {data.channelTitle}
            </p>

            <p className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formatViews(data.statistics.viewCount)} views • {date}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
