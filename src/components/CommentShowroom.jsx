import React, { useEffect, useRef, useState } from "react";
import ChatBoxSimple from "./ChatBoxSimple";

export default function CommentShowroom({ showroom, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const fetchedIds = useRef(new Set());
  const active = useRef(true);

  const fetchComments = async () => {
    if (!showroom || !active.current) return;
    try {
      const res = await fetch(
        `https://sorum-mobile.vercel.app/api/lives/comments/${showroom}/comment`
      );
      const json = await res.json();
      if (Array.isArray(json)) {
        const newC = json.filter(
          (c) => !fetchedIds.current.has(c.created_at)
        );
        newC.forEach((c) => fetchedIds.current.add(c.created_at));

        const mapped = newC.map((c) => ({
          nickname: c.name || "Anon",
          message: c.comment || "",
        }));

        if (mapped.length) {
          setMessages((prev) => [...prev.slice(-100), ...mapped]);
          mapped.forEach((m) => onNewMessage?.(m));
        }
      }
      requestAnimationFrame(fetchComments);
    } catch (e) {
      console.warn("❌ Gagal fetch showroom chat:", e);
      setTimeout(fetchComments, 5000);
    }
  };

  useEffect(() => {
    active.current = true;
    fetchComments();
    return () => {
      active.current = false;
    };
  }, [showroom]);

  return <ChatBoxSimple messages={messages} />;
}
