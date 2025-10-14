import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { fetchMemberDetail } from "../utils/api/api";
import {
  Video,
  Gift,
  Clock,
  Calendar,
  BarChart2,
  User,
  Activity,
} from "lucide-react"; // icon lucide-react

export default function MemberDetail() {
  const { url } = useParams();
  const location = useLocation();
  const stateMember = location.state?.member || null;

  const [member, setMember] = useState(stateMember);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getDetail() {
      setLoading(true);
      try {
        const data = await fetchMemberDetail(url);
        if (!data) throw new Error("Gagal mengambil data member");
        setMember(data);
      } catch (err) {
        console.error("❌ Fetch Member Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getDetail();
    window.scrollTo(0, 0);
  }, [url]);

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
        Memuat data member...
      </div>
    );

  if (error || !member)
    return (
      <div className="flex flex-col justify-center items-center text-center py-20">
        <p className="text-red-600 font-semibold text-lg mb-2">
          ⚠️ Gagal memuat data member
        </p>
        <Link
          to="/member"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Kembali ke Daftar Member
        </Link>
      </div>
    );

  // ====== Ekstrak data ======
  const {
    name,
    nickname,
    img,
    img_alt,
    description,
    jikosokai,
    generation,
    socials,
    stats,
    height,
    birthdate,
    is_graduate,
  } = member;

  const birth = new Date(birthdate).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Statistik
  const totalShowroom = stats?.total_live?.showroom || 0;
  const totalIDN = stats?.total_live?.idn || 0;
  const mostGift = stats?.most_gift?.gift || 0;
  const longestLive = stats?.longest_live?.duration || 0;
  const durationMin = Math.floor(longestLive / 60000);
  const durationHours = Math.floor(durationMin / 60);

  const lastLiveDate = stats?.last_live?.date?.end
    ? new Date(stats.last_live.date.end).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Belum ada data";

  return (
    <div className="text-gray-800 rounded-xl overflow-hidden shadow-lg max-w-7xl mx-auto my-1">
      {/* Tombol Kembali */}
      <div className="p-1">
        <Link
          to="/member"
          className="bg-black/50 text-white px-3 py-1 rounded-md text-sm hover:bg-black/70"
        >
          ← Kembali
        </Link>
      </div>

      {/* Header: Avatar & Jikosokai */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between px-6 gap-6 md:gap-10">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <img
            src={img_alt || img}
            alt={name}
            className="w-32 h-40 md:w-40 md:h-52 object-cover rounded-md border-4 border-white shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-sm text-gray-600">{nickname}</p>
            <p className="text-xs text-red-500 mt-1">
              {generation?.toUpperCase()} •{" "}
              {is_graduate ? "Graduated Member" : "Active Member"}
            </p>
          </div>
        </div>

        {/* Jikosokai */}
        {jikosokai && (
          <div className="bg-white p-4 rounded-md md:w-1/2 text-center md:text-left">
            <p className="italic text-red-400 font-semibold">"{jikosokai}"</p>
          </div>
        )}
      </div>

      {/* Konten utama */}
      <div className="pt-3 px-6 pb-8">
        {/* Informasi pribadi & deskripsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md space-y-1">
            <h3 className="font-semibold text-lg text-red-600 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" /> Informasi Pribadi
            </h3>
            <p>
              <span className="text-gray-500">📅 Tanggal Lahir:</span> {birth}
            </p>
            <p>
              <span className="text-gray-500">📏 Tinggi Badan:</span> {height}
            </p>
            <p>
              <span className="text-gray-500">🎓 Status:</span>{" "}
              {is_graduate ? "Lulus" : "Aktif"}
            </p>
          </div>

          <div className="bg-white p-4 rounded-md">
            <h3 className="font-semibold text-lg text-red-600 mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" /> Deskripsi
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {description}
            </pre>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-3 bg-white p-4 rounded-md">
          <h3 className="font-semibold text-lg text-red-600 mb-3 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-red-600" /> Statistik Live
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ✅ Total Live (Showroom & IDN dalam 1 box) */}
            <div className="bg-[#8F8F8F] rounded-md p-3 text-center">
              <p className="text-white text-xs flex justify-center items-center gap-1 mb-1">
                <Video className="w-4 h-4" /> Total Live
              </p>
              <div className="text-black font-semibold text-sm space-y-0.5">
                <p>🎥 Showroom: {totalShowroom}</p>
                <p>📺 IDN Live: {totalIDN}</p>
              </div>
            </div>

            {/* Gift Tertinggi */}
            <div className="bg-[#8F8F8F] rounded-md p-3 text-center">
              <p className="text-white text-xs flex justify-center items-center gap-1">
                <Gift className="w-4 h-4" /> Gift Tertinggi
              </p>
              <p className="text-lg font-semibold text-red-600">
                Rp {mostGift.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Durasi Terlama */}
            <div className="bg-[#8F8F8F] rounded-md p-3 text-center">
              <p className="text-white text-xs flex justify-center items-center gap-1">
                <Clock className="w-4 h-4" /> Durasi Terlama
              </p>
              <p className="text-black text-lg font-semibold">
                {durationHours > 0
                  ? `${durationHours} Jam ${durationMin % 60} Menit`
                  : `${durationMin} Menit`}
              </p>
            </div>

            {/* Terakhir Live */}
            <div className="bg-[#8F8F8F] rounded-md p-3 text-center sm:col-span-2 lg:col-span-3">
              <p className="text-white text-xs flex justify-center items-center gap-1">
                <Calendar className="w-4 h-4" /> Terakhir Live
              </p>
              <p className="text-black text-lg font-semibold">{lastLiveDate}</p>
            </div>
          </div>
        </div>

        {/* Sosial Media */}
        <div className="mt-6 bg-white p-4 rounded-md">
          <h3 className="font-semibold text-lg text-red-600 mb-3 flex items-center gap-2">
            🌐 Media Sosial
          </h3>
          <div className="flex flex-wrap gap-2">
            {socials?.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
