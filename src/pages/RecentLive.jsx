import React, { useEffect, useState } from "react";
import { fetchRecent } from "../utils/api/api";
import { Link } from "react-router-dom";
import SkeletonLoader from "../utils/SkeletonLoader"

export default function RecentLive() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        console.log("[RecentLive] Fetching data...");
        const res = await fetchRecent();
        console.log("[RecentLive] Raw response:", res);

        let list = [];
        if (Array.isArray(res.recents)) {
          list = res.recents;
        } else {
          console.warn("[RecentLive] Tidak ada array recents di response");
        }

        setItems(list);
      } catch (e) {
        console.error("[RecentLive] Error fetch:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <SkeletonLoader type="recent" />;

  const filtered = items.filter((it) => {
    const matchSearch =
      !search ||
      it.member?.nickname?.toLowerCase().includes(search.toLowerCase()) ||
      it.member?.name?.toLowerCase().includes(search.toLowerCase()) ||
      it.idn?.title?.toLowerCase().includes(search.toLowerCase());

    const matchPlatform =
      platform === "all" || it.type?.toLowerCase() === platform;

    const matchStatus =
      status === "all" ||
      (status === "active" && !it.member?.is_graduate) ||
      (status === "graduated" && it.member?.is_graduate);

    return matchSearch && matchPlatform && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 text-gray-200">
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold mb-3 text-black">🎥 Live Terbaru</h2>

        {filtered.length === 0 ? (
          <div className="text-red-700 rounded-lg p-6 text-center">
            Tidak ada data recent live ⚠
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row bg-white border rounded-xl overflow-hidden hover:border-red-700 transition-colors duration-200"
            >
              <img
                src={item.member?.img_alt || item.member?.img}
                alt={item.member?.nickname}
                className="w-full sm:w-32 h-48 sm:h-auto object-cover"
              />

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {item.member?.nickname}
                  </h3>
                  <p className="text-sm text-red-400 mt-1">
                    {item.idn?.title || "-"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
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

                <div className="text-xs text-gray-500 mt-3">
                  {item.live_info?.date?.end
                    ? new Date(item.live_info.date.end).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : ""}
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-end p-4 sm:w-32 border-t sm:border-t-0 sm:border-l border-[#3a0f12] bg-gray-700">
                <Link
                  to={`/recent/${item.data_id}`}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm transition"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <aside className="w-full md:w-72 flex-shrink-0 space-y-4">
        <h2 className="text-2xl font-bold mb-3 text-black">🔍 Filter</h2>
        <div className="bg-gray-700 border border-gray-500 rounded-xl p-4 space-y-4">
          <input
            type="text"
            placeholder="Cari member atau judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-200 text-black border border-[#3a0f12] text-sm focus:outline-none focus:ring-1 focus:ring-red-700"
          />

          <div>
            <p className="text-sm font-medium mb-2">Platform</p>
            <div className="flex gap-2 flex-wrap">
              {["showroom", "idn", "all"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    platform === p
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-black hover:bg-[#2a0f12]"
                  }`}
                >
                  {p === "showroom"
                    ? "Showroom"
                    : p === "idn"
                    ? "IDN Live"
                    : "Semua"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Status Member</p>
            <div className="flex gap-2 flex-wrap">
              {["active", "graduated", "all"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    status === s
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-black hover:bg-[#2a0f12]"
                  }`}
                >
                  {s === "active"
                    ? "Active"
                    : s === "graduated"
                    ? "Graduated"
                    : "Semua"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
