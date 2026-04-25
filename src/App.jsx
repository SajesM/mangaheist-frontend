import Home from "./pages/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./shared/layouts/MainLayout";
import Reader from "./pages/Reader";
import ReaderLayout from "./shared/layouts/ReaderLayout";
import MangaDetails from "./pages/MangaDetails";
import Browse from "./pages/Browse";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:mangaId" element={<MangaDetails />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/history" element={<History />} />
        </Route>
        <Route element={<ReaderLayout />}>
          <Route path="/reader/:mangaId/:chapterId" element={<Reader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App