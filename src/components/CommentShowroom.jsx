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
        `https://comment-log.vercel.app/comment?room_id=${showroom}`
      );
      const json = await res.json();
      if (Array.isArray(json.comment_log)) {
        const newC = json.comment_log.filter(
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
      setTimeout(fetchComments, 1000);
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
