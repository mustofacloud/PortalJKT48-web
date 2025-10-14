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


export async function fetchLive() {
  const res = await axios.get(BASE.live);
  return res.data;
}

export async function fetchRecent(search = "", filter = "active", type = "all", page = 1, perpage = 12) {
  const url = `https://api.crstlnz.my.id/api/recent?sort=date&page=${page}&filter=${filter}&order=-1&perpage=${perpage}&search=${encodeURIComponent(search)}&room_id=&group=jkt48&type=${type}`;
  const res = await axios.get(url);
  return res.data;
}

export async function fetchNews(page = 1, perpage = 3) {
  const res = await axios.get(BASE.news, { params: { page, perpage } });
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
