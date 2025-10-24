import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { fetchNews } from "../utils/api/api";
import SkeletonLoader from "../utils/SkeletonLoader"

dayjs.locale("id");

export default function News() {
  const { isDark } = useTheme();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const totalNews = 1752;
  const perPage = 10;
  const totalPages = Math.ceil(totalNews / perPage);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const data = await fetchNews(page, perPage, search);
        setNewsList(data?.news || []);
        setError(false);
      } catch (err) {
        console.error("❌ Gagal fetch berita:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
    window.scrollTo(0, 0);
  }, [page, search]);


  if (loading) return <SkeletonLoader type="news" />;

  if (error)
    return (
      <div className="text-center py-20 text-red-400 font-semibold">
        ⚠️ Gagal memuat data berita.
      </div>
    );

  return (
    <div className="w-full text-gray-800 min-h-screen px-2 md:p-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-8">
        <h2 className={`text-2xl font-bold mb-6 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>
          📰 Berita Terbaru
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {newsList.map((item) => {
            const date = dayjs(item.date).format("DD MMMM YYYY");
            return (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                state={{ news: item }}
                className={`block border rounded-xl p-4 shadow-sm hover:shadow-md transition ${
                  isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={`https://www.jkt48.com${item.label}`}
                    alt="icon"
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                  <div>
                    <h3 className={`font-semibold text-sm sm:text-base leading-snug mb-1 line-clamp-3 ${
                      isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {newsList.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Tidak ada berita yang tersedia.
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1.5 text-sm rounded-md ${
              page === 1
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-red-400 text-white hover:bg-red-700 cursor-pointer"
            }`}
          >
            ⟨ Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages - 1 ||
                p === totalPages ||
                (p >= page - 2 && p <= page + 2)
            )
            .map((p, idx, arr) => {
              const next = arr[idx + 1];
              return (
                <React.Fragment key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      page === p
                        ? "bg-red-400 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer"
                    }`}
                  >
                    {p}
                  </button>
                  {next && next - p > 1 && (
                    <span className="text-gray-400 px-1">...</span>
                  )}
                </React.Fragment>
              );
            })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1.5 text-sm rounded-md ${
              page === totalPages
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-red-400 text-white hover:bg-red-700 cursor-pointer"
            }`}
          >
            Berikutnya ⟩
          </button>
        </div>

        <p className="text-center text-xs text-gray-750 mt-3">
          Halaman {page} dari {totalPages}
        </p>
      </div>
    </div>
  );
}
