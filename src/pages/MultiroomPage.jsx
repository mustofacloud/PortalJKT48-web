import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { IoMdClose, IoMdAdd, IoMdAlert } from "react-icons/io";
import { useTheme } from "../contexts/ThemeContext";
import { API_URLS, fetchLive } from "../utils/api/api";

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
      className={`relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-[50vh] max-h-[70vh] 
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
  const { isDark } = useTheme();
  const [lives, setLives] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showListMobile, setShowListMobile] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [closingAlert, setClosingAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);

  const maxCols = 4;
  const maxRows = 3;

  useEffect(() => {
    const getLives = async () => {
      try {
        const data = await fetchLive();
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
        ? `${API_URLS.IDN_PROXY}${encodeURIComponent(stream)}`
        : stream;

    setSelected((prev) => [...prev, { ...item, url }]);
    setShowListMobile(false);
  };

  const removeLive = (roomId) => {
    setSelected((prev) => prev.filter((s) => s.room_id !== roomId));
  };

  return (
    <div className={`w-full min-h-screen overflow-hidden ${
      isDark ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="flex flex-col md:flex-row gap-4 px-2 md:p-0">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold animate-fadeIn">Multiroom Live</h1>

            <div className="flex gap-2 items-center text-sm">
              <label>
                Cols:{" "}
                <select
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className={`rounded px-2 py-1 ${
                    isDark
                      ? 'bg-[#111] border border-gray-600 text-white'
                      : 'bg-gray-100 border border-gray-300 text-gray-900'
                  }`}
                >
                  {Array.from({ length: maxCols }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c} className={isDark ? 'bg-[#111]' : 'bg-gray-100'}>
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
                  className={`rounded px-2 py-1 ${
                    isDark
                      ? 'bg-[#111] border border-gray-600 text-white'
                      : 'bg-gray-100 border border-gray-300 text-gray-900'
                  }`}
                >
                  {Array.from({ length: maxRows }, (_, i) => i + 1).map((r) => (
                    <option key={r} value={r} className={isDark ? 'bg-[#111]' : 'bg-gray-100'}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div
            className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4 place-items-stretch"
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
              <div className={`col-span-full text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Pilih live untuk mulai menonton.
              </div>
            )}
          </div>
        </div>

        <div className={`hidden md:block md:w-64 rounded-lg p-3 overflow-y-auto h-[80vh] ${
          isDark
            ? 'bg-[#111] border border-gray-600'
            : 'bg-gray-100 border border-gray-300'
        }`}>
          <h3 className="font-semibold mb-3">Member Live</h3>
          <div className="space-y-3">
            {lives.length ? (
              lives.map((live) => (
                <div
                  key={live.room_id || live.videoId}
                  className={`p-2 rounded-lg flex items-center gap-2 ${
                    isDark ? 'bg-[#1a1a1a]' : 'bg-white'
                  }`}
                >
                  <img
                    src={live.img_alt || live.img || live.thumbnails?.high?.url}
                    alt={live.name || live.title}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {live.name || live.title}
                    </div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
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
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tidak ada yang live 😥</div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowListMobile(true)}
          className="md:hidden fixed bottom-12 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg animate-bounce"
        >
          <IoMdAdd size={24} />
        </button>

        {showListMobile && (
          <div className={`fixed inset-0 flex items-end z-50 ${
            isDark ? 'bg-black/70' : 'bg-gray-900/70'
          }`}>
            <div className={`w-full max-h-[70vh] rounded-t-lg p-4 overflow-y-auto animate-fadeIn ${
              isDark ? 'bg-[#111]' : 'bg-gray-100'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Pilih Member Live</h3>
                <button
                  onClick={() => setShowListMobile(false)}
                  className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {lives.length ? (
                  lives.map((live) => (
                    <div
                      key={live.room_id || live.videoId}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        isDark ? 'bg-[#1a1a1a]' : 'bg-white'
                      }`}
                    >
                      <img
                        src={live.img_alt || live.img || live.thumbnails?.high?.url}
                        alt={live.name || live.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {live.name || live.title}
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
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
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tidak ada yang live 😥</div>
                )}
              </div>
            </div>
          </div>
        )}

        {showAlert && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              closingAlert ? "animate-fadeOut" : "animate-fadeIn"
            } ${isDark ? 'bg-black/70' : 'bg-gray-900/70'}`}
          >
            <div
              className={`rounded-lg p-6 text-center w-80 ${
                closingAlert ? "animate-fadeOut" : "animate-bounceIn"
              } ${
                isDark
                  ? 'bg-[#1a1a1a] border border-gray-600'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <div className="flex justify-center mb-3">
                <IoMdAlert className="text-yellow-400 animate-pulse" size={48} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Perhatian</h3>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>{alertMsg}</p>
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
