import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/id";
import MemberSmallCard from "../components/MemberSmallCard";
import { fetchTheaterDetail } from "../utils/api/api"

dayjs.locale("id");

export default function JadwalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetail() {
      setLoading(true);
      try {
        const data = await fetchTheaterDetail(id);
        console.log("🎬 [DETAIL THEATER RESPONSE] =>", data);
        if (data?.shows?.length > 0) setShowData(data.shows[0]);
      } catch (err) {
        console.error("❌ Gagal fetch detail jadwal:", err);
      } finally {
        setLoading(false);
      }
    }
    getDetail();
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
        Loading...
      </div>
    );

  if (!showData)
    return (
      <div className="py-20 text-center text-gray-500">
        Data tidak ditemukan.
      </div>
    );

  const { title, setlist, members, date, team, idnTheater, url, seitansai } =
    showData;
  const formattedDate = dayjs(date).format("dddd, DD MMMM YYYY HH:mm");

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-10">
      {setlist?.banner && (
        <div className="relative w-full h-52 sm:h-64 md:h-80 rounded-xl overflow-hidden shadow">
          <img
            src={setlist.banner}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h1 className="absolute bottom-4 left-4 text-red-400 text-2xl sm:text-3xl font-bold drop-shadow-md">
            {setlist.title}
          </h1>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="hidden md:block col-span-1">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
            <img
              src={setlist?.poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <p className="text-white text-sm">{setlist?.description}</p>

          <div className="text-sm mt-3 text-gray-300 space-y-1">
            <p>
              📅 <b>{formattedDate}</b>
            </p>
          </div>

          {idnTheater && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={idnTheater.image}
                    alt={idnTheater.title}
                    className="w-24 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="text-sm font-medium">{idnTheater.title}</p>
                    <p className="text-xs text-gray-500">
                      💰 {idnTheater.price} Gold — @{idnTheater.username}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://www.idn.app/jkt48-official/live/preview/${idnTheater.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                >
                  🎟️ Beli Tiket di IDN Live
                </a>
              </div>
            </div>
          )}

          {seitansai && seitansai.length > 0 && (
            <div className="mt-5 p-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-red-500/20 border border-pink-400/40 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold text-pink-300 flex items-center gap-2 mb-3">
                🎂 Member Ulang Tahun
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                {seitansai.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 bg-black/30 px-3 py-2 rounded-lg border border-pink-400/30 hover:bg-black/40 transition"
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-pink-400"
                    />
                    <div>
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-400">
                        Sedang berulang tahun 🎉
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl text-white font-semibold mb-4">👩‍🎤 Member Performing</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {members && members.length > 0 ? (
            members.map((m) => <MemberSmallCard key={m.id} data={m} />)
          ) : (
            <p className="text-gray-500 text-sm">
              Belum ada data member tampil.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
