import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import SkeletonLoader from "../utils/SkeletonLoader"
import { HiSignalSlash } from "react-icons/hi2";
import { fetchLive, fetchNews, fetchBirthday } from "../utils/api/api";
import LiveCard from "../components/LiveCard";
import NewsCard from "../components/NewsCard";
import MemberCard from "../components/MemberCard";
import BirthdayCard from "../components/BirthdayCard";
import memberData from "../data/MEMBER.json";

// 🖼️ gambar error
import errorImg from "../assets/error.png";

export default function Home() {
  const { isDark } = useTheme();
  const [live, setLive] = useState([]);
  const [news, setNews] = useState([]);
  const [birthday, setBirthday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setError(false);

      try {
        const resLive = await fetchLive();
        const resNews = await fetchNews();
        const resBday = await fetchBirthday();

        if (!Array.isArray(resLive) || !Array.isArray(resNews.news) || !Array.isArray(resBday)) {
          throw new Error("Invalid API structure");
        }

        setLive(resLive);
        setNews(resNews.news);
        setBirthday(resBday);
      } catch (err) {
        console.error("❌ Gagal fetch API:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  if (loading) return <SkeletonLoader type="home" />;

  return (
    <div className="max-w-7xl mx-auto py-1 space-y-10 text-white">
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
          {!error && live.length > 0 ? (
            live.map((item, idx) => <LiveCard key={idx} live={item} />)
          ) : (
            <div className="col-span-full flex flex-col items-center text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                {error
                  ? "Gagal memuat data Live ⚠️"
                  : "Tidak ada member yang sedang live."}
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
          {!error && birthday.length > 0 ? (
            <div className="space-y-3">
              {birthday.slice(0, 3).map((b, idx) => (
                <BirthdayCard key={idx} data={b} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                {error
                  ? "Gagal memuat data ulang tahun ⚠️"
                  : "Tidak ada ulang tahun dalam waktu dekat."}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>📰 Berita Terbaru</h2>

          {!error && news.length > 0 ? (
            <div className="space-y-3">
              {news.slice(0, 3).map((n, idx) => (
                <NewsCard key={idx} data={n} />
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center text-center py-8 border rounded-xl ${
              isDark
                ? 'bg-slate-900 border-slate-700'
                : 'bg-white border-gray-300'
            }`}>
              <span>
                <HiSignalSlash className="w-20 h-20 mb-3 opacity-80 text-gray-500" />
              </span>
              <p className="text-red-400 font-semibold">
                {error
                  ? "Gagal memuat berita terbaru ⚠️"
                  : "Belum ada berita terbaru."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>👩‍🎤 Member List</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {memberData.slice(0, 6).map((m, idx) => (
            <MemberCard key={idx} data={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
