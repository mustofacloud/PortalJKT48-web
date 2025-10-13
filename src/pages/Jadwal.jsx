// src/pages/Jadwal.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJadwal } from "../utils/api/api";
import TheaterCard from "../components/TheaterCard";
import SkeletonLoader from "../utils/SkeletonLoader"

export default function Jadwal() {
  const [upcoming, setUpcoming] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSchedule() {
      setLoading(true);
      try {
        const res = await fetchJadwal();
        console.log("🎭 [SCHEDULE API RESPONSE] =>", res);
        if (res?.theater?.upcoming) setUpcoming(res.theater.upcoming);
        if (res?.theater?.recent) setRecent(res.theater.recent);
      } catch (err) {
        console.error("❌ Gagal fetch jadwal:", err);
      } finally {
        setLoading(false);
      }
    }
    getSchedule();
  }, []);

  if (loading) return <SkeletonLoader type="jadwal" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">🎟️ Jadwal Mendatang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {upcoming.length > 0 ? (
            upcoming.map((item) => (
              <Link key={item.id} to={`/jadwal/${item.id}`} className="block">
                <TheaterCard data={item} type="upcoming" />
              </Link>
            ))
          ) : (
            <p className="text-red-700 text-sm">Tidak ada jadwal mendatang ⚠</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">🕓 Jadwal Terbaru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {recent.length > 0 ? (
            recent.map((item) => (
              <Link key={item.id} to={`/jadwal/${item.id}`} className="block">
                <TheaterCard data={item} type="recent" />
              </Link>
            ))
          ) : (
            <p className="text-red-700 text-sm">Belum ada jadwal sebelumnya ⚠</p>
          )}
        </div>
      </section>
    </div>
  );
}
