import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Hls from "hls.js";
import CommentIDN from "../components/CommentIDN";
import CommentShowroom from "../components/CommentShowroom";
import LiveCard from "../components/LiveCard";

import showroomLogo from "../assets/showroom.png";
import idnLogo from "../assets/idn.png";

const LIVE_URL =
  "https://api.crstlnz.my.id/api/now_live?group=jkt48&debug=false";
const IDN_PROXY = "https://jkt48showroom-api.my.id/proxy?url=";

export default function WatchLivePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [type, setType] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [username, setUsername] = useState("");
  const [chatId, setChatId] = useState("");
  const [roomIdShowroom, setRoomIdShowroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [liveEnded, setLiveEnded] = useState(false);
  const [imgAlt, setImgAlt] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [otherLives, setOtherLives] = useState([]);

  const fetchLive = async () => {
    try {
      const res = await fetch(LIVE_URL);
      const data = await res.json();
      console.log("📡 All Lives:", data);

      const live = data.find((item) => item.url_key === roomId);

      if (!live) {
        setLiveEnded(true);
        return;
      }

      const stream = live.streaming_url_list?.find((item) => {
        if (live.type === "idn") return item.label === "original";
        if (live.type === "showroom") return item.label === "original quality";
        return false;
      })?.url;

      if (!stream) return;

      const isIDN = live.type === "idn";
      const finalUrl = isIDN
        ? `${IDN_PROXY}${encodeURIComponent(stream)}`
        : stream;

      console.log("🎞️ Stream URL:", finalUrl);

      setStreamUrl(finalUrl);
      setType(live.type);
      setSlug(live.slug || live.url_key);
      setUsername(live.username || live.name || "guest");
      setChatId(live.chat_room_id || "");
      setRoomIdShowroom(live.room_id || null);
      setImgAlt(live.img_alt || live.image || "");

      const others = data.filter((item) => item.url_key !== roomId);
      setOtherLives(others);
    } catch (err) {
      console.error("❌ Error fetch live data:", err);
    }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    console.log("🎬 Attaching HLS to video element...");

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        debug: false,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("✅ HLS manifest loaded, starting playback...");
        video.play().catch((e) => console.warn("Autoplay blocked:", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn("HLS fatal error:", data);
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
      video.src = streamUrl;
      video.play().catch((e) => console.warn("Autoplay blocked:", e));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (!el || !autoScroll) return;
    el.scrollTop = el.scrollHeight;
  };
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    setAutoScroll(isAtBottom);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);

  return (
    <div className="w-full min-h-screen text-white overflow-hidden">
      <div className="grid md:grid-cols-5 md:grid-rows-6 md:gap-4 h-screen p-1">
        <div className="md:col-span-3 md:row-span-4 bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            playsInline
          />
          <div className="absolute top-3 right-3 px-2 py-1 rounded flex items-center gap-2">
            <img
              src={type === "idn" ? idnLogo : showroomLogo}
              alt="logo"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        <div className="md:col-span-3 md:row-start-5 bg-[#111] rounded-xl border border-gray-800 flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            {imgAlt && (
              <img
                src={imgAlt}
                alt={username}
                className="w-10 h-10 rounded-md object-cover border border-gray-700"
              />
            )}
            <div>
              <p className="font-semibold text-lg">{username}</p>
              <p className="text-sm text-red-400">
                {type === "idn" ? "IDN Live" : "Showroom Live"}
              </p>
            </div>
          </div>

          {/* 🆕 Title hanya muncul untuk IDN Live */}
          {type === "idn" && slug && (
            <div className="text-right animate-slideIn">
              <p className="text-sm font-semibold text-red-600">
                {
                  slug
                    .replace(/-\d+$/, "") // hapus angka di akhir
                    .replace(/-/g, " ") // ubah strip jadi spasi
                    .replace(/\b\w/g, (c) => c.toUpperCase()) // kapital setiap kata
                }
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-2 md:row-span-6 md:col-start-4 bg-[#111] rounded-xl flex flex-col overflow-hidden h-[40vh] md:h-auto">
          <div className="flex">
            <button
              className={`flex-1 py-2 text-sm font-semibold transition cursor-pointer ${
                showChat
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowChat(true)}
            >
              💬 Chat
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold transition cursor-pointer ${
                !showChat
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowChat(false)}
            >
              📺 Live Lainnya
            </button>
          </div>

          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3 text-sm"
          >
            {showChat ? (
              <>
                {type === "idn" && chatId ? (
                  <CommentIDN
                    chatId={chatId}
                    slug={slug}
                    username={username}
                    onNewMessage={handleNewMessage}
                  />
                ) : type === "showroom" && roomIdShowroom ? (
                  <CommentShowroom
                    showroom={roomIdShowroom}
                    onNewMessage={handleNewMessage}
                  />
                ) : (
                  <div className="text-gray-500 text-center mt-5">
                    Chat tidak tersedia
                  </div>
                )}
              </>
            ) : otherLives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 place-item-center">
                {otherLives.map((item) => (
                  <Link key={item.url_key} to={`/watch/${item.url_key}`}>
                    <LiveCard live={item} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center mt-5">
                🔴 Tidak ada live lainnya
              </div>
            )}
          </div>
        </div>
      </div>

      {liveEnded && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a0a0d] border border-[#3b0f12] rounded-xl p-6 text-center w-80 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-2">
              ⚠️ Live Telah Berakhir
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Live yang kamu tonton sudah selesai.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
