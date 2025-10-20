import axios from "axios";

const BASE = {
  jadwal: "https://api.crstlnz.my.id/api/event",
  live: "https://api.crstlnz.my.id/api/now_live?group=jkt48&debug=false",
  recent: "https://api.crstlnz.my.id/api/recent?sort=date&page=1&filter=active&order=-1&perpage=12&search=&room_id=&group=jkt48&type=all",
  news: "https://api.crstlnz.my.id/api/news",
  birthday: "https://api.crstlnz.my.id/api/next_birthday?group=jkt48",

  recentDetail: (id) => `https://api.crstlnz.my.id/api/recent/${id}`,
  theaterDetail: (id) => `https://api.crstlnz.my.id/api/theater/${id}`,
  newsDetail: (id) => `https://api.crstlnz.my.id/api/news/${id}`,
  memberDetail: (url) => `https://proxi-ten.vercel.app/api/member/${encodeURIComponent(url)}`,
};

// Additional API URLs for WatchLivePage
export const API_URLS = {
  LIVE_URL: "https://api.crstlnz.my.id/api/now_live?group=jkt48&debug=false",
  IDN_PROXY: "https://jkt48showroom-api.my.id/proxy?url=",
  IDN_ONLIVES: "https://api-idn.vercel.app/api/onlives",
  SHOWROOM_GIFTS: (roomIdShowroom) => `https://sorum-mobile.vercel.app/api/lives/gift/${roomIdShowroom}/gift`,
  IDN_TOP_GIFTERS: (uuidStreamer) => `https://api.idn.app/api/v1/gift/livestream/top-gifter/daily?type=daily&uuid_streamer=${uuidStreamer}&n=1`,
};


export async function fetchLive() {
  const res = await axios.get(BASE.live);
  return res.data;
}

export async function fetchRecent(search = "", filter = "active", type = "all", page = 1, perpage = 12) {
  const url = `https://api.crstlnz.my.id/api/recent?sort=date&page=${page}&filter=${filter}&order=-1&perpage=${perpage}&search=${encodeURIComponent(search)}&room_id=&group=jkt48&type=${type}`;
  const res = await axios.get(url);
  return res.data;
}

export async function fetchNews(page = 1, perpage = 10, search = "") {
  const res = await axios.get(BASE.news, { params: { page, perpage, search } });
  return res.data;
}

export async function fetchJadwal() {
  const res = await axios.get(BASE.jadwal);
  return res.data;
}

export async function fetchBirthday() {
  const res = await axios.get(BASE.birthday);
  return res.data;
}

export async function fetchRecentDetail(id) {
  if (!id) return null;
  try {
    const res = await axios.get(BASE.recentDetail(id));
    return res.data;
  } catch (err) {
    console.error("❌ Fetch Recent Detail Error:", err);
    return null;
  }
}

export async function fetchTheaterDetail(id) {
  if (!id) return null;
  try {
    const res = await axios.get(BASE.theaterDetail(id));
    return res.data;
  } catch (err) {
    console.error("❌ Fetch Theater Detail Error:", err);
    return null;
  }
}

export async function fetchNewsDetail(id) {
  if (!id) return null;
  try {
    const res = await axios.get(BASE.newsDetail(id));
    return res.data;
  } catch (err) {
    console.error("❌ Fetch News Detail Error:", err);
    return null;
  }
}

export async function fetchMemberDetail(url) {
  if (!url) return null;
  try {
    const res = await axios.get(BASE.memberDetail(url));
    return res.data;
  } catch (err) {
    console.error("❌ Fetch Member Detail Error:", err);
    return null;
  }
}

// Additional API functions for WatchLivePage
export async function fetchIdnOnlives() {
  const res = await axios.get(API_URLS.IDN_ONLIVES);
  return res.data;
}

export async function fetchShowroomGifts(roomId) {
  if (!roomId) return [];
  const res = await axios.get(API_URLS.SHOWROOM_GIFTS(roomId));
  return res.data;
}

export async function fetchIdnTopGifters(uuid) {
  if (!uuid) return { status: 0, data: [] };
  const res = await axios.get(API_URLS.IDN_TOP_GIFTERS(uuid), {
    headers: {
      "X-API-KEY": "123f4c4e-6ce1-404d-8786-d17e46d65b5c"
    }
  });
  return res.data;
}
