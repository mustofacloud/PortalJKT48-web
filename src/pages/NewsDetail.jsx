import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { fetchNewsDetail } from "../utils/api/api";

dayjs.locale("id");

export default function NewsDetail() {
  const { isDark } = useTheme();
  const { id } = useParams();
  const location = useLocation();
  const stateNews = location.state?.news || null;

  const [news, setNews] = useState(stateNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getDetail() {
      setLoading(true);
      try {
        const data = await fetchNewsDetail(id);
        if (!data) throw new Error("Gagal mengambil data berita");
        setNews(data);
      } catch (err) {
        console.error("❌ Fetch News Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500">
        <svg className="animate-spin h-5 w-5 mx-auto mb-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        Memuat berita...
      </div>
    );

  if (error || !news)
    return (
      <div className="flex flex-col justify-center items-center text-center py-20">
        <p className="text-red-600 font-semibold text-lg mb-2">
          ⚠️ Gagal memuat berita
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );

  const date = dayjs(news.date).format("DD MMMM YYYY");
  const contentHTML = { __html: news.content };

  return (
    <div className={`w-full rounded-lg min-h-screen ${
      isDark ? 'bg-slate-900 text-gray-200' : 'bg-white text-gray-800'
    }`}>

      <div
        className={`${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-300'
        } border-t rounded-lg shadow-sm px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 w-full`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div>
            <h1 className={`font-bold text-xl sm:text-2xl mb-1 leading-snug ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {news.title}
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-white' : 'text-gray-600'
            }`}>{date}</p>
          </div>
        </div>

        <div
          className={`prose prose-sm sm:prose-base max-w-none leading-relaxed
                     prose-img:rounded-lg prose-img:mx-auto prose-img:my-4
                     prose-p:my-2 ${
            isDark ? 'prose-headings:text-red-400' : 'prose-headings:text-red-600'
          }`}
          dangerouslySetInnerHTML={contentHTML}
        />
      </div>
    </div>
  );
}
