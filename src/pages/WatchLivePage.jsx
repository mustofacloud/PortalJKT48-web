import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, PictureInPicture, Settings } from "lucide-react";
import CommentIDN from "../components/CommentIDN";
import CommentShowroom from "../components/CommentShowroom";
import LiveCard from "../components/LiveCard";
import { API_URLS, fetchIdnOnlives, fetchShowroomGifts, fetchIdnTopGifters } from "../utils/api/api.js";
import { useTheme } from "../contexts/ThemeContext";

export default function WatchLivePage() {
  const { isDark } = useTheme();
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
  const [activeTab, setActiveTab] = useState('chat');
  const [otherLives, setOtherLives] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const [streamingUrlList, setStreamingUrlList] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [recentGifts, setRecentGifts] = useState([]);
  const [topGifters, setTopGifters] = useState([]);
  const [uuidStreamer, setUuidStreamer] = useState("");

  const fetchLive = async () => {
    try {
      const res = await fetch(API_URLS.LIVE_URL);
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
        ? `${API_URLS.IDN_PROXY}${encodeURIComponent(stream)}`
        : stream;

      console.log("🎞️ Stream URL:", finalUrl);

      setStreamUrl(finalUrl);
      setType(live.type);
      setSlug(live.slug || live.url_key);
      setUsername(live.username || live.name || "guest");
      setChatId(live.chat_room_id || "");
      setRoomIdShowroom(live.room_id || null);
      setImgAlt(live.img_alt || live.image || "");
      setStreamingUrlList(live.streaming_url_list || []);

      const others = data.filter((item) => item.url_key !== roomId);
      setOtherLives(others);
    } catch (err) {
      console.error("❌ Error fetch live data:", err);
    }
  };

  const fetchGifts = async () => {
    if (type !== "showroom" || !roomIdShowroom) return;
    try {
      const data = await fetchShowroomGifts(roomIdShowroom);
      console.log("✅ Fetched gifts:", data);
      setRecentGifts(data);
    } catch (err) {
      console.error("❌ Error fetch gifts:", err);
    }
  };

  const fetchUuid = async (username) => {
    try {
      console.log("🔍 Fetching UUID for username:", username);
      const data = await fetchIdnOnlives();

      // Try to match by name first (remove "JKT48" suffix if present)
      let live = data.find(item => item.user.name === username);
      if (!live) {
        // Try to match by name without "JKT48" suffix
        live = data.find(item => item.user.name.replace(' JKT48', '') === username);
      }
      if (!live) {
        // Try to match by username field
        live = data.find(item => item.user.username === username);
      }

      if (live) {
        console.log("✅ Found UUID:", live.user.id, "for username:", username);
        setUuidStreamer(live.user.id);
      } else {
        console.warn("⚠️ UUID not found for username:", username);
        console.log("Available names in API:", data.map(item => item.user.name));
        console.log("Available usernames in API:", data.map(item => item.user.username));
      }
    } catch (err) {
      console.error("❌ Error fetch UUID:", err);
    }
  };

  const fetchTopGifters = async () => {
    if (!uuidStreamer) return;
    try {
      const data = await fetchIdnTopGifters(uuidStreamer);
      console.log("✅ Fetched top gifters:", data);
      setTopGifters(data.data || []);
    } catch (err) {
      console.error("❌ Error fetch top gifters:", err);
      setTopGifters([]);
    }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    if (type === "showroom" && roomIdShowroom) {
      fetchGifts();
      const interval = setInterval(fetchGifts, 15000);
      return () => clearInterval(interval);
    }
  }, [type, roomIdShowroom]);

  useEffect(() => {
    if (type === "idn" && username) {
      fetchUuid(username);
    }
  }, [type, username]);

  useEffect(() => {
    if (type === "idn" && uuidStreamer) {
      fetchTopGifters();
      const interval = setInterval(fetchTopGifters, 15000);
      return () => clearInterval(interval);
    }
  }, [type, uuidStreamer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    console.log("🎬 Attaching HLS to video element...");

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

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
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  const handleQualityChange = (quality) => {
    const selected = streamingUrlList.find((item) => item.quality === quality);
    if (selected) {
      setSelectedQuality(quality);
      const isIDN = type === "idn";
      const finalUrl = isIDN
        ? `${API_URLS.IDN_PROXY}${encodeURIComponent(selected.url)}`
        : selected.url;
      setStreamUrl(finalUrl);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (video) {
      video.volume = e.target.value;
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = e.target.value;
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        video.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (video) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setShowControls(false);
    }
  };

  const handleClick = () => {
    if (isMobile()) {
      if (showControls) {
        setShowControls(false);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      } else {
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000); // Hide after 3 seconds on mobile
      }
    }
  };

  return (
    <div className={`w-full min-h-screen overflow-hidden ${
      isDark ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="grid md:grid-cols-5 md:grid-rows-6 md:gap-4 h-screen p-1">
        <div className="md:col-span-3 md:row-span-4 bg-black rounded-xl overflow-hidden relative flex items-center justify-center group"
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            autoPlay
            playsInline
            onClick={handleClick}
          />

          {/* Custom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-black/70 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Time */}
                <span className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Quality Selector for Showroom */}
                {type === "showroom" && streamingUrlList.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowQualitySelector(!showQualitySelector)}
                      className="text-white hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Settings size={20} />
                    </button>
                    {showQualitySelector && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                        {streamingUrlList.map((item) => (
                          <button
                            key={item.quality}
                            onClick={() => {
                              handleQualityChange(item.quality);
                              setShowQualitySelector(false);
                            }}
                            className={`block w-full text-left px-3 py-1 hover:bg-gray-700 ${
                              selectedQuality === item.quality ? 'bg-red-600' : ''
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Picture in Picture */}
                <button
                  onClick={togglePictureInPicture}
                  className="text-white hover:text-red-500 transition-colors cursor-pointer"
                >
                  <PictureInPicture size={20} />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-500 transition-colors cursor-pointer"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`md:col-span-3 md:row-start-5 rounded-xl border flex items-center justify-between px-4 py-2 ${
          isDark
            ? 'bg-[#111] border-gray-800'
            : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center gap-3">
            {imgAlt && (
              <img
                src={imgAlt}
                alt={username}
                className={`w-10 h-10 rounded-md object-cover border ${
                  isDark ? 'border-gray-700' : 'border-gray-400'
                }`}
              />
            )}
            <div>
              <p className={`font-semibold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{username}</p>
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

        <div className={`md:col-span-2 md:row-span-6 md:col-start-4 rounded-xl flex flex-col overflow-hidden h-[40vh] md:h-auto ${
          isDark
            ? 'bg-[#111] border border-gray-800'
            : 'bg-gray-100 border border-gray-300'
        }`}>
          <div className="flex">
            <button
              className={`flex-1 py-2 text-sm font-semibold transition cursor-pointer ${
                activeTab === 'chat'
                  ? "bg-red-600 text-white"
                  : isDark
                    ? "bg-transparent text-gray-400 hover:text-white"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat
            </button>
            {(type === "showroom" || type === "idn") && (
              <button
                className={`flex-1 py-2 text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'gifts'
                    ? "bg-red-600 text-white"
                    : isDark
                      ? "bg-transparent text-gray-400 hover:text-white"
                      : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab('gifts')}
              >
                {type === "idn" ? "🏆 Top Gifter" : "🎁 Gifts"}
              </button>
            )}
            <button
              className={`flex-1 py-2 text-sm font-semibold transition cursor-pointer ${
                activeTab === 'other'
                  ? "bg-red-600 text-white"
                  : isDark
                    ? "bg-transparent text-gray-400 hover:text-white"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab('other')}
            >
              📺 Live Lainnya
            </button>
          </div>

          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3 text-sm"
          >
            {activeTab === 'chat' ? (
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
                  <div className={`text-center mt-5 ${
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Chat tidak tersedia
                  </div>
                )}
              </>
            ) : activeTab === 'gifts' ? (
              type === "showroom" ? (
                recentGifts.length > 0 ? (
                  <div className="space-y-2">
                    {recentGifts.slice(0, 8).map((gift, index) => (
                      <div key={index} className={`flex items-center gap-2 text-sm p-2 rounded ${
                        isDark ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <img src={gift.image} alt="gift" className="w-10 h-10" />
                        <span className="font-semibold text-red-400">{gift.name}</span>
                        <span className="text-yellow-400">x{gift.num}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center mt-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    🎁 Tidak ada gift terbaru
                  </div>
                )
              ) : type === "idn" ? (
                topGifters.length > 0 ? (
                  <div className="space-y-2">
                    {topGifters.map((gifter, index) => (
                      <div key={index} className={`flex items-center gap-2 text-sm p-2 rounded ${
                        isDark ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <img src={gifter.image_url} alt="avatar" className="w-10 h-10 rounded-full" />
                        <span className="font-semibold text-red-400">{gifter.name}</span>
                        <span className="text-yellow-400">{gifter.total_gold} Gold</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center mt-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    🏆 Tidak ada top gifter
                  </div>
                )
              ) : null
            ) : otherLives.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-1 place-conten-center">
                {otherLives.map((item) => (
                  <Link key={item.url_key} to={`/watch/${item.url_key}`}>
                    <LiveCard live={item} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center mt-5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                🔴 Tidak ada live lainnya
              </div>
            )}
          </div>
        </div>
      </div>

      {liveEnded && (
        <div className={`absolute inset-0 flex items-center justify-center z-50 ${
          isDark ? 'bg-black/70' : 'bg-gray-900/70'
        }`}>
          <div className={`rounded-xl p-6 text-center w-80 animate-fadeIn ${
            isDark
              ? 'bg-slate-900 border border-gray-700'
              : 'bg-white border border-gray-300'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              ⚠️ Live Telah Berakhir
            </h3>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Live yang kamu tonton sudah selesai.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
