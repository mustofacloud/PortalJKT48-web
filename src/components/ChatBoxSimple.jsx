import React, { useEffect, useRef } from "react";

export default function ChatBoxSimple({ messages }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto p-3 space-y-2 rounded-b-lg scrollbar-thin scrollbar-thumb-[#3a0f12] scrollbar-track-transparent"
    >
      {messages.length === 0 ? (
        <p className="italic text-gray-500 text-center">
          Belum ada pesan...
        </p>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            className="border border-white/50 rounded-lg px-2 py-1 hover:bg-[#210e10] transition-colors duration-150"
          >
            <div className="text-red-400 font-semibold text-xs mb-1 truncate">
              {m.nickname || "Anonymous"}
            </div>
            <div className="text-white text-sm leading-snug break-words">
              {m.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
