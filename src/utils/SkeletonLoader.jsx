// src/components/SkeletonLoader.jsx
import React from "react";

export default function SkeletonLoader({ type = "card", count = 6 }) {
  const shimmer =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200";

  switch (type) {
    /* ================================
       🏠 HOME / DEFAULT CARD SKELETON
    =================================*/
    case "home":
      return (
        <div className="space-y-6 py-6">
          {/* Member Live */}
          <div>
            <div className={`${shimmer} h-6 w-40 rounded mb-3`} />
            <div className="w-40 h-60 bg-gray-200 rounded-lg" />
          </div>

          {/* Ulang Tahun & Berita */}
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`${shimmer} h-12 rounded-lg`} />
                ))}
              </div>
            ))}
          </div>

          {/* Member List */}
          <div>
            <div className={`${shimmer} h-6 w-40 rounded mb-3`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border p-2">
                    <div className={`${shimmer} aspect-[3/4] rounded-md`} />
                    <div className="mt-2 space-y-2">
                      <div className={`${shimmer} h-3 w-3/4 rounded`} />
                      <div className={`${shimmer} h-3 w-1/2 rounded`} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );

    /* ================================
       👩‍🎤 MEMBER LIST
    =================================*/
    case "member":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className={`${shimmer} w-full aspect-[3/4]`} />
                <div className="p-2">
                  <div className={`${shimmer} h-4 w-3/4 rounded mb-2`} />
                  <div className={`${shimmer} h-3 w-1/2 rounded`} />
                </div>
              </div>
            ))}
        </div>
      );

    /* ================================
       🎭 JADWAL THEATER
    =================================*/
    case "jadwal":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className={`${shimmer} w-full aspect-[3/4]`} />
                <div className="p-3 space-y-2">
                  <div className={`${shimmer} h-4 w-4/5 rounded`} />
                  <div className={`${shimmer} h-3 w-1/2 rounded`} />
                  <div className={`${shimmer} h-3 w-1/3 rounded`} />
                </div>
              </div>
            ))}
        </div>
      );

    /* ================================
       📰 NEWS LIST
    =================================*/
    case "news":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-3"
              >
                <div className={`${shimmer} w-10 h-10 rounded`} />
                <div className="flex-1 space-y-2">
                  <div className={`${shimmer} h-4 w-3/4 rounded`} />
                  <div className={`${shimmer} h-3 w-1/3 rounded`} />
                </div>
              </div>
            ))}
        </div>
      );

    /* ================================
       🎥 RECENT LIVE
    =================================*/
    case "recent":
      return (
        <div className="space-y-4 py-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row bg-white border rounded-xl overflow-hidden shadow-sm"
              >
                <div className={`${shimmer} w-full sm:w-32 h-48 sm:h-auto`} />
                <div className="flex-1 p-4 space-y-3">
                  <div className={`${shimmer} h-4 w-1/2 rounded`} />
                  <div className={`${shimmer} h-3 w-3/4 rounded`} />
                  <div className="flex gap-3">
                    <div className={`${shimmer} h-3 w-20 rounded`} />
                    <div className={`${shimmer} h-3 w-20 rounded`} />
                  </div>
                </div>
                <div className="p-4 bg-gray-200 w-full sm:w-32 flex items-center justify-center">
                  <div className={`${shimmer} h-6 w-16 rounded-md`} />
                </div>
              </div>
            ))}
        </div>
      );

    default:
      return null;
  }
}
