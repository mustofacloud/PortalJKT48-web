import React from "react";
import { Link } from "react-router-dom";

/**
 * Membuat slug berdasarkan data member:
 * - gunakan data.url jika ada
 * - jika tidak, buat slug dari nama_member
 */
function makeSlug(data) {
  if (!data) return "unknown";
  if (data.url && typeof data.url === "string" && data.url.trim() !== "") {
    return data.url;
  }
  const name = (data.biodata?.namaPanggilan).toString();
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function MemberCard({ data }) {
  if (!data) return null;

  const slug = makeSlug(data);
  const name = data.biodata?.namaPanggilan || "Member Name";
  const team = data.kategori || "";
  const img = data.ava_member || "https://placehold.co/300x400?text=Member";

  return (
    <Link
      to={`/member/${encodeURIComponent(slug)}`}
      state={{ member: data }}
      className="block"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col items-center p-3">
        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-slate-700">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover hover:scale-115 transition duration-250"
            loading="lazy"
          />
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-100 text-sm truncate">
            {name}
          </h3>
          <p className="text-xs text-gray-400">{team}</p>
        </div>
      </div>
    </Link>
  );
}
