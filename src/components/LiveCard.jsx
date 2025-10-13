import React from "react";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";

import idnLogo from "../assets/idn.png";
import showroomLogo from "../assets/showroom.png";

export default function LiveCard({ live }) {
  if (!live) return null;

  const thumbnail =
    live.img || live.thumbnails?.high?.url || live.thumbnails?.medium?.url;

  const title = live.name || live.title || live.channelTitle || "Live Stream";

  const startedAt = live.started_at
    ? new Date(live.started_at).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  let linkTarget = "#";
  let isExternal = false;

  if (live.type === "youtube") {
    linkTarget = live.url;
    isExternal = true;
  } else {
    linkTarget = `/watch/${live.url_key || live.slug || live.id}`;
  }

  const Wrapper = isExternal ? "a" : Link;
  const wrapperProps = isExternal
    ? { href: linkTarget, target: "_blank", rel: "noopener noreferrer" }
    : { to: linkTarget };

  return (
    <Wrapper
      {...wrapperProps}
      className="group block bg-white rounded-lg p-2 flex flex-col w-full max-w-[140px] text-gray-200 hover:scale-[1.03] hover:border-red-700 transition-transform duration-200"
    >
      <div className="w-full aspect-[9/16] rounded-md overflow-hidden bg-black relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="mt-2 flex-1">
        <h4 className="font-semibold text-[12px] truncate text-black group-hover:text-red-400 transition">
          {title}
        </h4>

        {startedAt && (
          <p className="text-[10px] text-gray-400">Mulai: {startedAt}</p>
        )}

        <div className="mt-1 flex items-center gap-1">
          {live.type === "idn" && (
            <img
              src={idnLogo}
              alt="IDN Live"
              className="w-5 h-5 object-contain"
            />
          )}
          {live.type === "showroom" && (
            <img
              src={showroomLogo}
              alt="Showroom Live"
              className="w-5 h-5 object-contain"
            />
          )}
          {live.type === "youtube" && (
            <div className="flex items-center gap-1 text-red-500 font-semibold text-[10px]">
              <FaYoutube size={12} /> YouTube
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
