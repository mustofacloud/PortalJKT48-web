import Layout from "../components/Layout";
import Home from "../pages/Home";
import Jadwal from "../pages/Jadwal";
import News from "../pages/News";
import RecentLive from "../pages/RecentLive";
import About from "../pages/About";
import JadwalDetail from "../pages/JadwalDetail";
import WatchLivePage from "../pages/WatchLivePage";
import RecentLiveDetail from "../pages/RecentLiveDetail";
import MemberList from "../pages/MemberList";
import MemberDetail from "../pages/MemberDetail";
import NewsDetail from "../pages/NewsDetail";
import MultiroomPage from "../pages/MultiroomPage";
import React from "react";

const appRoutes = [
  {
    path: "/",
    element: React.createElement(Layout),
    children: [
      { index: true, element: React.createElement(Home) },
      { path: "jadwal", element: React.createElement(Jadwal) },
      { path: "news", element: React.createElement(News) },
      { path: "recent-live", element: React.createElement(RecentLive) },
      { path: "about", element: React.createElement(About) },
      { path: "jadwal/:id", element: React.createElement(JadwalDetail) },
      { path: "watch/:roomId", element: React.createElement(WatchLivePage) },
      { path: "recent/:id", element: React.createElement(RecentLiveDetail) },
      { path: "member", element: React.createElement(MemberList) },
      { path: "member/:url", element: React.createElement(MemberDetail) },
      { path: "news/:id", element: React.createElement(NewsDetail) },
      { path: "multiroom", element: React.createElement(MultiroomPage) },
    ],
  },
];

export default appRoutes;
