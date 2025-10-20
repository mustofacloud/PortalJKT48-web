import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ChatBoxSimple({ messages }) {
  const { isDark } = useTheme();
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={ref}
      className={`flex-1 overflow-y-auto p-3 space-y-2 rounded-b-lg ${
        isDark
          ? 'scrollbar-thin scrollbar-thumb-[#3a0f12] scrollbar-track-transparent'
          : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent'
      }`}
    >
      {messages.length === 0 ? (
        <p className="italic text-gray-500 text-center">
          Belum ada pesan...
        </p>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            className={`border rounded-lg px-2 py-1 transition-colors duration-150 ${
              isDark
                ? 'border-white/50 hover:bg-[#210e10]'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="text-red-400 font-semibold text-xs mb-1 truncate">
              {m.nickname || "Anonymous"}
            </div>
            <div className={`text-sm leading-snug break-words ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {m.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
