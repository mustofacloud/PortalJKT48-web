import React, { useEffect, useState } from "react";
import { fetchRecent, fetchLive } from "../utils/api/api";
import { Link } from "react-router-dom";
import SkeletonLoader from "../utils/SkeletonLoader";
import LiveCard from "../components/LiveCard";
import { HiSignalSlash } from "react-icons/hi2";

export default function RecentLive() {
  const [items, setItems] = useState([]);
  const [live, setLive] = useState([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const perpage = 12;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        console.log("[RecentLive] Fetching data...");
        const filter = "active";
        const type = platform === "all" ? "all" : platform;
        const res = await fetchRecent(search, filter, type, page, perpage);
        console.log("[RecentLive] Raw response:", res);

        let list = [];
        if (Array.isArray(res.recents)) {
          list = res.recents;
        } else {
          console.warn("[RecentLive] Tidak ada array recents di response");
        }

        setItems(list);
        setTotalCount(res.total_count || 0);
        setTotalPages(Math.ceil((res.total_count || 0) / perpage));

        // Fetch live data
        const liveRes = await fetchLive();
        setLive(Array.isArray(liveRes) ? liveRes : []);

        window.scrollTo(0, 0);
      } catch (e) {
        console.error("[RecentLive] Error fetch:", e);
        setItems([]);
        setLive([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search, platform]);



  if (loading) return <SkeletonLoader type="recent" />;



  return (
    <div className="max-w-7xl mx-auto py-1 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">
          🎥 Live Terbaru
        </h2>
      </div>

      {/* FILTER PLATFORM */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["showroom", "idn", "all"].map((p) => (
          <button
            key={p}
            onClick={() => {
              setPlatform(p);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              platform === p
                ? "bg-red-400 text-white"
                : "bg-[#0b0b0b] text-gray-200 hover:bg-[#2a0e12]"
            }`}
          >
            {p === "showroom"
              ? "Showroom"
              : p === "idn"
              ? "IDN Live"
              : "Semua"}
          </button>
        ))}

        {/* SEARCH BAR */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari member atau judul..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* RECENT LIVE CARDS */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-semibold text-red-600 mb-2">
                Tidak ada data recent live ⚠️
              </p>
              <p className="text-sm">Coba ubah pencarian atau kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row bg-white border rounded-xl overflow-hidden hover:border-red-700 transition-colors duration-200"
                >
                  <img
                    src={item.member?.img_alt || item.member?.img}
                    alt={item.member?.nickname}
                    className="w-16 h-16 md:w-32 md:h-48 object-cover rounded-full md:rounded-none mx-auto mt-4 md:mt-0 md:mr-0"
                  />

                  <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm md:text-lg font-semibold text-gray-700 text-center md:text-left">
                        {item.member?.nickname}
                      </h3>
                      <p className="text-xs md:text-sm text-red-400 mt-1 text-center md:text-left">
                        {item.idn?.title || "-"}
                      </p>

                      <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-xs text-gray-400">
                        <span>
                          👥{" "}
                          {item.live_info?.viewers?.num?.toLocaleString("id-ID") ||
                            0}{" "}
                          penonton
                        </span>
                        <span>
                          ⏱{" "}
                          {item.live_info?.duration
                            ? Math.floor(item.live_info.duration / 60000)
                            : "?"}{" "}
                          menit
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2 md:mt-3 text-center md:text-left">
                      {item.live_info?.date?.end
                        ? new Date(item.live_info.date.end).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-end p-3 md:p-4 md:w-32 border-t md:border-t-0 md:border-l border-[#3a0f12] bg-gray-300">
                    <Link
                      to={`/recent/${item.data_id}`}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm transition"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LIVE MEMBERS SIDEBAR */}
        <div className="hidden lg:block lg:w-80">
          <h3 className="text-xl font-bold text-white mb-4">🔴 Member Sedang Live</h3>
          {live.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 bg-white p-1 rounded-xl">
              {live.map((item, idx) => (
                <LiveCard key={idx} live={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl text-center">
              <HiSignalSlash className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Tidak ada member yang sedang live</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1.5 text-sm rounded-md ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-400 text-white hover:bg-red-700 cursor-pointer"
            }`}
          >
            ⟨ Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
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
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
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
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-400 text-white hover:bg-red-700 cursor-pointer"
            }`}
          >
            Berikutnya ⟩
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-750 mt-3">
        Halaman {page} dari {totalPages}
      </p>
    </div>
  );
}
