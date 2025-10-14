import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRecentDetail } from "../utils/api/api";

export default function RecentLiveDetail() {
  const { id } = useParams();
  const [history, setHistory] = useState(null);
  const [gift, setGift] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const isInteracting = useRef(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    async function getDetail() {
      setLoading(true);
      try {
        const data = await fetchRecentDetail(id);
        setHistory(data);
        setGift(data?.live_info?.gift?.list || []);
        document.title = `${data?.room_info?.name} Live History`;
      } catch (err) {
        console.error("❌ Error fetch recent detail:", err);
      } finally {
        setLoading(false);
      }
    }

    getDetail();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container || !history?.live_info?.screenshot?.list?.length) return;
    const children = container.children;
    const target = children[currentPage];
    if (!target) return;
    const left =
      target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, [currentPage, history]);

  useEffect(() => {
    if (!history?.live_info?.screenshot?.list?.length) return;
    const total = history.live_info.screenshot.list.length;
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (isInteracting.current) return;
      setCurrentPage((p) => (total ? (p + 1) % total : 0));
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [history]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNext = () => {
    const total = history?.live_info?.screenshot?.list?.length || 0;
    setCurrentPage((p) => Math.min(p + 1, total - 1));
  };

  const handleTouchStart = (e) => {
    isInteracting.current = true;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    isInteracting.current = false;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? handlePrev() : handleNext();
  };

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
        Memuat data...
      </div>
    );
  if (!history)
    return (
      <div className="text-center text-gray-400 py-20">
        Detail live tidak ditemukan.
      </div>
    );

  const banner = history.room_info?.img || "";
  const avatar = history.room_info?.img_alt || "";
  const nickname = history.room_info?.name || "Unknown";
  const title =
    history.live_info?.idn?.title ||
    history.room_info?.description ||
    "No Title";
  const giftTotal = history?.total_gifts || 0;
  const giftRate = history?.gift_rate || 0;
  const giftRupiah = giftTotal * giftRate;
  const viewers = history.live_info?.viewers.num || 0;
  const endDate = history.live_info?.date?.end
    ? new Date(history.live_info.date.end).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
  const screenshots = history?.live_info?.screenshot || null;
  const totalScreens = screenshots?.list?.length || 0;

  return (
    <div className="text-gray-200 rounded-xl borderoverflow-hidden shadow-lg max-w-7xl mx-auto my-1">
      <div
        className="h-48 bg-cover bg-center relative rounded-t-xl"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute top-2 left-2"></div>
        <div className="absolute -bottom-12 left-6 ">
          <img
            src={avatar}
            alt={nickname}
            className="w-24 h-24 rounded-full border-4 border-[#100609] object-cover shadow-md"
          />
        </div>
      </div>

      <div className="pt-16 px-6 pb-1">
        <h2 className="text-2xl font-bold text-red-400">{nickname}</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {totalScreens > 0 && (
            <div className="relative bg-white p-2 rounded-lg border place-content-center max-h-150">
              <button
                onClick={() => {
                  isInteracting.current = true;
                  handlePrev();
                  setTimeout(() => (isInteracting.current = false), 600);
                }}
                disabled={currentPage === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 px-2 py-1 rounded-full z-10 hover:bg-black/70 disabled:opacity-30"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  isInteracting.current = true;
                  handleNext();
                  setTimeout(() => (isInteracting.current = false), 600);
                }}
                disabled={currentPage === totalScreens - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 px-2 py-1 rounded-full z-10 hover:bg-black/70 disabled:opacity-30"
              >
                ▶
              </button>

              <div
                ref={sliderRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
              >
                {screenshots.list.map((s, idx) => {
                  const imgUrl = `https://res.cloudinary.com/haymzm4wp/image/upload/${screenshots.folder}/${s}.${screenshots.format}`;
                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-full snap-center flex justify-center px-3"
                    >
                      <img
                        src={imgUrl}
                        alt={`screenshot-${idx}`}
                        className="w-full max-w-xl max-h-140 object-contain rounded-md"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center mt-2 space-x-2">
                {screenshots.list.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      isInteracting.current = true;
                      setCurrentPage(i);
                      setTimeout(() => (isInteracting.current = false), 600);
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentPage ? "bg-red-600" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border">
                <p className="text-xs text-black font-semibold">Total Gift</p>
                <p className="font-semibold text-red-400">
                  {giftTotal.toLocaleString("id-ID")} Gold
                </p>
              </div>
              <div className="bg-white p-3 rounded-md border">
                <p className="text-xs text-black font-semibold">Viewers</p>
                <p className="font-semibold text-black">
                  {viewers.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-md ">
              <p className="text-xs text-black font-semibold">📆 Date</p>
              <p className="font-semibold text-black">{endDate}</p>
            </div>

            <div className="bg-white p-3 rounded-md border">
              <p className="text-sm text-black font-semibold py-1">
                🎁 Gift List
              </p>
              <ul className="space-y-2 text-xs max-h-150 overflow-y-auto custom-scrollbar">
                {gift.slice(0, 200).map((g, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-300 px-2 py-1 rounded"
                  >
                    <span className="flex items-center gap-2 text-black font-semibold">
                      {g.img && (
                        <img
                          src={g.img}
                          alt=""
                          className="w-13 h-13 rounded object-contain"
                        />
                      )}
                      {g.name}
                    </span>
                    <span className="text-black">{g.num}x</span>
                  </li>
                ))}
                {gift.length === 0 && (
                  <p className="text-black italic">Belum ada gift</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
