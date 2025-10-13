import { useEffect, useState } from "react";
import SkeletonLoader from "../utils/SkeletonLoader"
import { fetchLive, fetchNews, fetchBirthday } from "../utils/api/api";
import LiveCard from "../components/LiveCard";
import NewsCard from "../components/NewsCard";
import MemberCard from "../components/MemberCard";
import BirthdayCard from "../components/BirthdayCard";
import memberData from "../data/MEMBER.json";

// 🖼️ gambar error
import errorImg from "../assets/error.png";

export default function Home() {
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 text-white">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-black">🎥 Member Live</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 place-items-stretch">
          {!error && live.length > 0 ? (
            live.map((item, idx) => <LiveCard key={idx} live={item} />)
          ) : (
            <div className="col-span-full flex flex-col items-center text-center py-8">
              <img
                src={errorImg}
                alt="Error"
                className="w-28 h-28 mb-3 opacity-90"
              />
              <p className="text-red-500 font-semibold">
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
          <h2 className="text-2xl font-bold mb-4 text-black">🎂 Ulang Tahun Terdekat</h2>
          {!error && birthday.length > 0 ? (
            <div className="space-y-3">
              {birthday.slice(0, 3).map((b, idx) => (
                <BirthdayCard key={idx} data={b} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <img
                src={errorImg}
                alt="Error"
                className="w-20 h-20 mb-3 opacity-80"
              />
              <p className="text-red-500 font-semibold">
                {error
                  ? "Gagal memuat data ulang tahun ⚠️"
                  : "Tidak ada ulang tahun dalam waktu dekat."}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-black">📰 Berita Terbaru</h2>

          {!error && news.length > 0 ? (
            <div className="space-y-3">
              {news.slice(0, 3).map((n, idx) => (
                <NewsCard key={idx} data={n} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <img
                src={errorImg}
                alt="Error"
                className="w-20 h-20 mb-3 opacity-80"
              />
              <p className="text-red-500 font-semibold">
                {error
                  ? "Gagal memuat berita terbaru ⚠️"
                  : "Belum ada berita terbaru."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-black">👩‍🎤 Member List</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {memberData.slice(0, 6).map((m, idx) => (
            <MemberCard key={idx} data={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
