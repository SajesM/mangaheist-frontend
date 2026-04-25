import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/backend";

function MangaDetails() {
  const { mangaId } = useParams();

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [readChapters, setReadChapters] = useState([]);

  useEffect(() => {
    const fetchManga = async () => {
      const res = await fetch(`https://mangaheist-backend.onrender.com/api/manga/${mangaId}`);
      const data = await res.json();
      setManga(data);
    };

    fetchManga();
  }, [mangaId]);

  useEffect(() => {
    const fetchChapters = async () => {
      const resData = await fetch(`https://mangaheist-backend.onrender.com/api/manga/chapters/${mangaId}`);
      const res = await resData.json();
      setChapters(res.data);
    };

    fetchChapters();
  }, [mangaId]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const [bookmarkRes, historyRes] = await Promise.all([
          api.getBookmarks(),
          api.getReadChapters(mangaId)
        ]);

        if (bookmarkRes && bookmarkRes.bookmarks) {
          const found = bookmarkRes.bookmarks.some(b => b.mangaId === mangaId);
          setIsBookmarked(found);
        }

        if (historyRes && historyRes.readChapterIds) {
          setReadChapters(historyRes.readChapterIds);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkUserStatus();
  }, [mangaId]);

  if (!manga) {
    return <div className="text-white p-4 text-center py-20 text-xl font-bold">Loading...</div>;
  }

  const title = manga.title;
  const coverFile = manga.coverFile;

  const cover = coverFile
    ? `https://mangaheist-backend.onrender.com/api/manga/cover/${manga.id}/${coverFile}.512.jpg`
    : "";

  const toggleBookmark = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to bookmark manga.");
      return;
    }
    setLoadingBookmark(true);
    try {
      await api.toggleBookmark({
        mangaId,
        title,
        cover: coverFile || ""
      });
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookmark(false);
    }
  };

  const sortedChapters = [...chapters].sort(
    (a, b) =>
      (b.attributes.chapter || 0) - (a.attributes.chapter || 0)
  );

  return (
    <div className="bg-[#000] text-white min-h-screen p-4 md:px-24">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 mt-6 justify-center max-w-4xl mx-auto border border-gray-800 p-6 rounded-xl bg-[#111]">
        <img
          className="w-[200px] h-[300px] object-cover rounded mx-auto md:mx-0 shadow-lg"
          src={cover}
          alt={title}
        />

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <p className="text-gray-400 text-sm max-w-[720px] mb-6 flex-1">
            {manga.description}
          </p>

          <button
            onClick={toggleBookmark}
            disabled={loadingBookmark}
            className={`self-start px-6 py-2 rounded font-bold transition-colors ${isBookmarked
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-rose-500 hover:bg-rose-600 text-white"
              } disabled:opacity-50`}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2 w-full max-w-[700px]">Chapters</h2>

        <div className="flex flex-col gap-2 max-h-[800px] w-full max-w-[700px] overflow-y-auto [color-scheme:dark] pr-2">
          {sortedChapters.map((ch) => {
            const isRead = readChapters.includes(ch.id);
            return (
              <Link
                key={ch.id}
                to={`/reader/${mangaId}/${ch.id}`}
                className={`border border-transparent transition-all p-4 rounded flex justify-between items-center group ${isRead
                  ? "bg-gray-900/40 opacity-60 hover:opacity-100 hover:border-gray-600"
                  : "bg-gray-900 hover:border-rose-500"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-semibold transition-colors ${isRead ? "text-gray-400 group-hover:text-gray-200" : "text-white group-hover:text-rose-500"
                    }`}>
                    Chapter {ch.attributes.chapter || "?"}
                  </span>
                  {isRead && (
                    <span className="text-[10px] font-bold bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-sm uppercase">Read</span>
                  )}
                </div>

                <span className="text-xs text-gray-500 bg-black/60 px-2 py-1 rounded">
                  {ch.attributes.publishAt?.slice(0, 10)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MangaDetails;