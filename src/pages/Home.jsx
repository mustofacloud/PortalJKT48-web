import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import SkeletonLoader from "../utils/SkeletonLoader"
import { HiSignalSlash } from "react-icons/hi2";
import { fetchLive, fetchNews, fetchBirthday, fetchYoutube } from "../utils/api/api";
import LiveCard from "../components/LiveCard";
import NewsCard from "../components/NewsCard";
import MemberCard from "../components/MemberCard";
import BirthdayCard from "../components/BirthdayCard";
import YoutubeCard from "../components/YoutubeCard";
import memberData from "../data/MEMBER.json";

// 🖼️ gambar error
import errorImg from "../assets/error.png";

export default function Home() {
  const { isDark } = useTheme();
  const [live, setLive] = useState([]);
  const [news, setNews] = useState([]);
  const [birthday, setBirthday] = useState([]);
  const [youtube, setYoutube] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setError(false);

      try {
        // Fetch all APIs independently to prevent one failure from affecting others
        const promises = [
          fetchLive().catch(err => { console.error("❌ Live API error:", err); return []; }),
          fetchNews().catch(err => { console.error("❌ News API error:", err); return { news: [] }; }),
          fetchBirthday().catch(err => { console.error("❌ Birthday API error:", err); return []; }),
          fetchYoutube().catch(err => { console.error("❌ YouTube API error:", err); return []; })
        ];

        const [resLive, resNews, resBday, resYoutube] = await Promise.all(promises);

        // Validate and set data
        setLive(Array.isArray(resLive) ? resLive : []);
        setNews(Array.isArray(resNews.news) ? resNews.news : []);
        setBirthday(Array.isArray(resBday) ? resBday : []);
        setYoutube(Array.isArray(resYoutube) ? resYoutube : []);
      } catch (err) {
        console.error("❌ General fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  if (loading) return <SkeletonLoader type="home" />;

  return (
    <div className="max-w-7xl mx-auto px-2 md:p-0 md:pb-3 space-y-10 text-white">
      <section>
        <h2 className={`flex items-center justify-between text-2xl font-bold mb-4 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>
          <span>🎥 Member Live</span>
          {live.length > 0 ? (
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          ) : (
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          )}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
          {live.length > 0 ? (
            live.map((item, idx) => <LiveCard key={idx} live={item} />)
          ) : (
            <div className="col-span-full flex flex-col items-center text-center py-8 bg-gray-300/50 rounded-xl ">
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                Tidak ada member yang sedang live.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>🎂 Ulang Tahun Terdekat</h2>
          {birthday.length > 0 ? (
            <div className="space-y-3">
              {birthday.map((b, idx) => (
                <BirthdayCard key={idx} data={b} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8 bg-gray-300/50 rounded-xl">
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 text-gray-800" />
              </span>
              <p className="text-red-400 font-semibold">
                Tidak ada ulang tahun dalam waktu dekat.
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>📰 Berita Terbaru</h2>

          {news.length > 0 ? (
            <div className="space-y-3">
              {news.slice(0, 4).map((n, idx) => (
                <NewsCard key={idx} data={n} />
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center text-center py-8 border rounded-xl ${
              isDark
                ? 'bg-gray-300/50'
                : 'bg-gray-300/50'
            }`}>
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                Belum ada berita terbaru.
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>👩‍🎤 Member List</h2>
          <a
            href="/member"
            className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
            }`}
          >
            Lihat lainnya →
          </a>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {memberData.slice(0, 12).map((m, idx) => (
            <MemberCard key={idx} data={m} />
          ))}
        </div>
      </section>

      <section>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>📺 YouTube</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {youtube.length > 0 ? (
            youtube.slice(0, 6).map((item, idx) => (
              <YoutubeCard key={idx} data={item} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-center py-8 bg-gray-300/50 rounded-xl">
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                Tidak ada video YouTube terbaru.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
