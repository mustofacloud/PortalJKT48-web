import React, { useEffect, useRef, useState } from "react";
import ChatBoxSimple from "./ChatBoxSimple";

export default function CommentIDN({ chatId, slug, username, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  const nickname = username || `user_${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    if (!chatId) return;
    const ws = new WebSocket("wss://chat.idn.app");
    wsRef.current = ws;
    let registered = false;

    ws.onopen = () => {
      ws.send(`NICK ${nickname}`);
      ws.send(`USER ${nickname} 0 * :WebSocket User`);
    };

    ws.onmessage = (event) => {
      const raw = event.data;
      if (raw.startsWith("PING")) {
        ws.send("PONG" + raw.substring(4));
        return;
      }

      if (raw.includes("001") && !registered) {
        registered = true;
        ws.send(`JOIN #${chatId}`);
        return;
      }

      if (raw.includes("PRIVMSG")) {
        const match = raw.match(/PRIVMSG #[^ ]+ :(.*)/);
        if (match) {
          try {
            const json = JSON.parse(match[1]);
            if (json?.chat) {
              const msg = {
                nickname: json?.user?.name || "User",
                message: json?.chat?.message,
              };
              setMessages((prev) => [...prev.slice(-100), msg]);
              onNewMessage?.(msg);
            }
          } catch (e) {
            console.warn("❌ Gagal parse:", match[1]);
          }
        }
      }
    };

    return () => ws.close();
  }, [chatId, nickname]);

  return <ChatBoxSimple messages={messages} />;
}
