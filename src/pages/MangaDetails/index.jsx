import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/backend";

function MangaDetails() {
  const { mangaId } = useParams();

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [readChapters, setReadChapters] = useState([]);

  const [isBookmarked, setIsBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithRetry = async (url, options = {}, retries = 2) => {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response");
      }
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw err;
    }
  };

  // 🚀 load all main data together
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [mangaData, chapterData] = await Promise.all([
          fetchWithRetry(`https://mangaheist-backend.onrender.com/api/manga/${mangaId}`),
          fetchWithRetry(`https://mangaheist-backend.onrender.com/api/manga/chapters/${mangaId}`)
        ]);

        if (!isMounted) return;

        setManga(mangaData);
        setChapters(chapterData?.data || []);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load manga. Try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [mangaId]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const [bookmarkRes, historyRes] = await Promise.all([
          api.getBookmarks(),
          api.getReadChapters(mangaId)
        ]);

        if (bookmarkRes?.bookmarks) {
          setIsBookmarked(
            bookmarkRes.bookmarks.some(b => b.mangaId === mangaId)
          );
        }

        if (historyRes?.readChapterIds) {
          setReadChapters(historyRes.readChapterIds);
        }
      } catch (err) {
        console.error("User data error:", err);
      }
    };

    loadUserData();
  }, [mangaId]);


  const toggleBookmark = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to bookmark manga.");
      return;
    }

    setLoadingBookmark(true);

    try {
      await api.toggleBookmark({
        mangaId,
        title: manga.title,
        cover: manga.coverFile || ""
      });

      setIsBookmarked(prev => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookmark(false);
    }
  };

  const sortedChapters = useMemo(() => {
    return [...chapters].sort(
      (a, b) =>
        Number(b.attributes.chapter || 0) -
        Number(a.attributes.chapter || 0)
    );
  }, [chapters]);

  const cover = manga?.coverFile
    ? `https://mangaheist-backend.onrender.com/api/manga/cover/${manga.id}/${manga.coverFile}.512.jpg`
    : "";


  if (loading) {
    return (
      <div className="text-white text-center py-20 text-xl font-bold">
        Loading manga...
      </div>
    );
  }

  // ❌ error UI
  if (error) {
    return (
      <div className="text-red-400 text-center py-20 text-xl font-bold">
        {error}
      </div>
    );
  }

  if (!manga) return null;

  return (
    <div className="bg-black text-white min-h-screen p-4 md:px-24">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 mt-6 justify-center max-w-4xl mx-auto border border-gray-800 p-6 rounded-xl bg-[#111]">
        <img
          className="w-[200px] h-[300px] object-cover rounded mx-auto md:mx-0 shadow-lg"
          src={cover}
          alt={manga.title}
        />

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{manga.title}</h1>

          <p className="text-gray-400 text-sm max-w-[720px] mb-6 flex-1">
            {manga.description}
          </p>

          <button
            onClick={toggleBookmark}
            disabled={loadingBookmark}
            className={`self-start px-6 py-2 rounded font-bold transition-colors ${
              isBookmarked
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-rose-500 hover:bg-rose-600"
            } disabled:opacity-50`}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>

      {/* Chapters */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2 w-full max-w-[700px]">
          Chapters
        </h2>

        <div className="flex flex-col gap-2 max-h-[800px] w-full max-w-[700px] overflow-y-auto pr-2">
          {sortedChapters.map((ch) => {
            const isRead = readChapters.includes(ch.id);

            return (
              <Link
                key={ch.id}
                to={`/reader/${mangaId}/${ch.id}`}
                className={`p-4 rounded flex justify-between items-center transition ${
                  isRead
                    ? "bg-gray-900/40 opacity-60 hover:opacity-100"
                    : "bg-gray-900 hover:border-rose-500 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      isRead ? "text-gray-400" : "text-white"
                    }`}
                  >
                    Chapter {ch.attributes.chapter || "?"}
                  </span>

                  {isRead && (
                    <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded uppercase">
                      Read
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-500">
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