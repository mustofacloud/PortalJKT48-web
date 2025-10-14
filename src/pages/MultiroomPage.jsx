import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { IoMdClose, IoMdAdd, IoMdAlert } from "react-icons/io";

const LIVE_URL =
  "https://api.crstlnz.my.id/api/now_live?group=jkt48&debug=false";
const IDN_PROXY = "https://jkt48showroom-api.my.id/proxy?url=";

function LivePlayer({ live, onRemove }) {
  const videoRef = useRef(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!live?.url) return;
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported() && live.url.endsWith(".m3u8")) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        debug: false,
      });
      hls.loadSource(live.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log(`✅ HLS manifest loaded for ${live.name}, starting playback...`);
        video.play().catch((e) => console.warn("Autoplay blocked:", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn(`HLS fatal error for ${live.name}:`, data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = live.url;
      video.play().catch((e) => console.warn("Autoplay blocked:", e));
    }

    return () => hls && hls.destroy();
  }, [live]);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(live.room_id), 300);
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[60vh] 
      ${removing ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay
        muted
        playsInline
      />
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-2 transition cursor-pointer"
      >
        <IoMdClose size={18} />
      </button>
      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
        {live.name}
      </div>
    </div>
  );
}

export default function MultiroomPage() {
  const [lives, setLives] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showListMobile, setShowListMobile] = useState(false);

  // Alert modal
  const [showAlert, setShowAlert] = useState(false);
  const [closingAlert, setClosingAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // Grid setting
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);

  const maxCols = 4;
  const maxRows = 3;

  useEffect(() => {
    const getLives = async () => {
      try {
        const res = await fetch(LIVE_URL);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.data || [];
        setLives(arr);
      } catch (err) {
        console.error("❌ Failed fetch lives:", err);
      }
    };
    getLives();
    const interval = setInterval(getLives, 15000);
    return () => clearInterval(interval);
  }, []);

  const addLive = (item) => {
    if (item.type === "youtube") {
      setAlertMsg("Live YouTube hanya bisa ditonton langsung di YouTube.");
      setShowAlert(true);
      return;
    }

    const maxAllowed = cols * rows;
    if (selected.length >= maxAllowed) {
      setAlertMsg(
        `❌ Maksimal tampilan live adalah ${maxAllowed} sesuai setting ${cols}x${rows}`
      );
      setShowAlert(true);
      return;
    }

    if (selected.find((s) => s.room_id === item.room_id)) return;

    const stream = item.streaming_url_list?.find((s) => {
      if (item.type === "idn") return s.label === "original";
      if (item.type === "showroom") return s.label === "original quality";
      return false;
    })?.url;

    if (!stream) {
      setAlertMsg("⚠️ Stream tidak ditemukan.");
      setShowAlert(true);
      return;
    }

    const url =
      item.type === "idn"
        ? `${IDN_PROXY}${encodeURIComponent(stream)}`
        : stream;

    setSelected((prev) => [...prev, { ...item, url }]);
    setShowListMobile(false);
  };

  const removeLive = (roomId) => {
    setSelected((prev) => prev.filter((s) => s.room_id !== roomId));
  };

  return (
    <div className="w-full min-h-screen text-white overflow-hidden rounded-xl bg-white/20">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Grid multiroom */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold animate-fadeIn">Multiroom Live</h1>

            {/* Setting rows/cols */}
            <div className="flex gap-2 items-center text-sm">
              <label>
                Cols:{" "}
                <select
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="bg-[#111] border border-gray-600 rounded px-2 py-1 text-white"
                >
                  {Array.from({ length: maxCols }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c} className="bg-[#111]">
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Rows:{" "}
                <select
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="bg-[#111] border border-gray-600 rounded px-2 py-1 text-white"
                >
                  {Array.from({ length: maxRows }, (_, i) => i + 1).map((r) => (
                    <option key={r} value={r} className="bg-[#111]">
                      {r}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* grid live */}
          <div
            className="grid gap-4 place-items-stretch"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {selected.length ? (
              selected.map((live) => (
                <LivePlayer
                  key={live.room_id}
                  live={live}
                  onRemove={removeLive}
                />
              ))
            ) : (
              <div className="col-span-full text-gray-400 text-center py-8">
                Pilih live untuk mulai menonton.
              </div>
            )}
          </div>
        </div>

        {/* List member (desktop) */}
        <div className="hidden md:block md:w-64 bg-[#111] border border-gray-600 rounded-lg p-3 overflow-y-auto h-[80vh]">
          <h3 className="font-semibold mb-3">Member Live</h3>
          <div className="space-y-3">
            {lives.length ? (
              lives.map((live) => (
                <div
                  key={live.room_id || live.videoId}
                  className="bg-[#1a1a1a] p-2 rounded-lg flex items-center gap-2"
                >
                  <img
                    src={live.img_alt || live.img}
                    alt={live.name || live.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {live.name || live.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {live.type?.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => addLive(live)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full cursor-pointer"
                  >
                    <IoMdAdd />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-400">Tidak ada yang live 😥</div>
            )}
          </div>
        </div>

        {/* Floating button (mobile) */}
        <button
          onClick={() => setShowListMobile(true)}
          className="md:hidden fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg animate-bounce"
        >
          <IoMdAdd size={24} />
        </button>

        {/* Modal list (mobile) */}
        {showListMobile && (
          <div className="fixed inset-0 bg-black/70 flex items-end z-50">
            <div className="bg-[#111] w-full max-h-[70vh] rounded-t-lg p-4 overflow-y-auto animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Pilih Member Live</h3>
                <button
                  onClick={() => setShowListMobile(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {lives.length ? (
                  lives.map((live) => (
                    <div
                      key={live.room_id || live.videoId}
                      className="bg-[#1a1a1a] p-2 rounded-lg flex items-center gap-2"
                    >
                      <img
                        src={live.img_alt || live.img}
                        alt={live.name || live.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">
                          {live.name || live.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {live.type?.toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={() => addLive(live)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      >
                        <IoMdAdd />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Tidak ada yang live 😥</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Alert */}
        {showAlert && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black/70 z-50 ${
              closingAlert ? "animate-fadeOut" : "animate-fadeIn"
            }`}
          >
            <div
              className={`bg-[#1a1a1a] border border-gray-600 rounded-lg p-6 text-center w-80 ${
                closingAlert ? "animate-fadeOut" : "animate-bounceIn"
              }`}
            >
              <div className="flex justify-center mb-3">
                <IoMdAlert className="text-yellow-400 animate-pulse" size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Perhatian</h3>
              <p className="text-sm text-gray-300 mb-4">{alertMsg}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setClosingAlert(true);
                    setTimeout(() => {
                      setShowAlert(false);
                      setClosingAlert(false);
                    }, 300);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
