import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/backend";

function Reader() {
  const { mangaId, chapterId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [mangaTitle, setMangaTitle] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  // Reset page counter when chapter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [chapterId]);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const res = await fetch(`https://mangaheist-backend.onrender.com/api/manga/pages/${chapterId}`);
        const data = await res.json();
        setPages(data);
      } catch (err) { console.error(err); }
    };
    if (chapterId) {
      loadPages();
    }
  }, [chapterId]);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const res = await fetch(`https://mangaheist-backend.onrender.com/api/manga/chapters/${mangaId}`);
        const data = await res.json();
        setChapters(data.data || []);
      } catch (err) { console.error(err); }
    };
    if (mangaId) loadChapters();
  }, [mangaId, chapterId]);

  useEffect(() => {
    const loadManga = async () => {
      try {
        const res = await fetch(`https://mangaheist-backend.onrender.com/api/manga/${mangaId}`);
        const manga = await res.json();
        setMangaTitle(manga.title);
        setCoverFileName(manga.coverFile || "");
      } catch (err) { console.error(err); }
    };
    if (mangaId) loadManga();
  }, [mangaId]);

  // Check bookmark status
  useEffect(() => {
    const checkBookmark = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await api.getBookmarks();
        if (res?.bookmarks) {
          setIsBookmarked(res.bookmarks.some(b => b.mangaId === mangaId));
        }
      } catch (err) { console.error(err); }
    };
    if (mangaId) checkBookmark();
  }, [mangaId]);

  const toggleBookmark = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to bookmark.");
      return;
    }
    try {
      await api.toggleBookmark({ mangaId, title: mangaTitle, cover: coverFileName });
      setIsBookmarked(prev => !prev);
    } catch (err) { console.error(err); }
  };

  // Mark as read — fires once when chapterId + mangaTitle are both ready.
  // A closure-local `called` flag prevents duplicate calls if the effect
  // re-runs before the async call settles, and the cleanup sets it to
  // true so a stale invocation is no-op'd when the component re-renders.
  useEffect(() => {
    if (!mangaTitle || !chapters.length) return;
    if (!localStorage.getItem("token")) return;

    let called = false;

    const ch = chapters.find(c => c.id === chapterId);
    const chapterNumber = ch?.attributes?.chapter || "?";

    called = true;
    api.markAsRead({
      mangaId,
      chapterId,
      mangaTitle,
      coverUrl: coverFileName,
      chapterNumber,
    }).catch(err => console.error(err));

    return () => { called = false; };
  }, [chapterId, mangaTitle]); // only re-fire when the chapter or title changes

  const sortedChapters = [...chapters].sort(
    (a, b) => (a.attributes.chapter || 0) - (b.attributes.chapter || 0),
  );

  const currentChapterIndex = sortedChapters.findIndex((ch) => ch.id === chapterId);
  const nextChapter = sortedChapters[currentChapterIndex + 1];
  const prevChapter = sortedChapters[currentChapterIndex - 1];

  return (
    <div className="bg-[#000000e6] flex flex-col min-h-screen">
      {/* top sticky reader toolbar */}
      <div className="sticky top-0 z-50 grid grid-cols-3 items-center px-3 md:px-6 py-2 bg-black/90 border-b border-gray-800">
        {/* Left: Back + Home */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/manga/${mangaId}`)}
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm font-semibold bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded"
            title="Back to manga"
          >
            <span className="hidden sm:inline">Back</span>
          </button>
          <Link
            to="/"
            className="text-white text-m font-bold flex-shrink-0"
            title="Home"
          >
            <span className="text-rose-500">MangaHiest</span>
          </Link>
        </div>

        {/* Center: chapter navigation */}
        <div className="justify-self-center flex items-center gap-1 md:gap-2">
          <button
            onClick={() => prevChapter && navigate(`/reader/${mangaId}/${prevChapter.id}`)}
            disabled={!prevChapter}
            className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition-colors px-2 md:px-3 py-1.5 rounded text-sm font-semibold"
          >
            ‹ Prev
          </button>
          <select
            value={chapterId}
            className="bg-gray-800 text-white font-semibold text-xs md:text-sm px-2 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-rose-500 transition-colors max-w-[110px] md:max-w-[180px]"
            onChange={(e) => {
              const selectedChapter = e.target.value;
              if (selectedChapter) navigate(`/reader/${mangaId}/${selectedChapter}`);
            }}
          >
            {sortedChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                Ch. {ch.attributes.chapter || "?"}
              </option>
            ))}
          </select>
          <button
            onClick={() => nextChapter && navigate(`/reader/${mangaId}/${nextChapter.id}`)}
            disabled={!nextChapter}
            className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-30 transition-colors px-2 md:px-3 py-1.5 rounded text-sm font-semibold"
          >
            Next ›
          </button>
        </div>

        {/* Right: Bookmark */}
        <button
          onClick={toggleBookmark}
          title={isBookmarked ? "Remove bookmark" : "Bookmark this manga"}
          className={`justify-self-end flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded transition-colors ${isBookmarked
            ? "bg-rose-500 hover:bg-rose-600 text-white"
            : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
        >
          {/* Bookmark*/}
          <span className="hidden sm:inline">{isBookmarked ? "Bookmark Saved" : "Bookmark"}</span>
        </button>
      </div>

      {/* manga page images */}
      <div className="flex flex-col items-center gap-1 py-4 pb-24 md:pb-4">
        {pages.map((page, index) => (
          <img
            className="w-full max-w-[800px]"
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            onLoad={() => setCurrentPage(index + 1)}
          />
        ))}
      </div>

      {/* bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-[#111] border-t border-gray-800 px-4 py-3 flex items-center justify-center gap-3 mt-4 z-40">
        <button
          onClick={() => {
            if (prevChapter) {
              navigate(`/reader/${mangaId}/${prevChapter.id}`);
            }
          }}
          disabled={!prevChapter}
          className="bg-gray-800 text-white font-semibold text-sm px-4 md:px-6 py-2 rounded border border-gray-700 hover:bg-gray-700 active:bg-gray-900 disabled:opacity-30 transition-colors"
        >
          Prev Chapter
        </button>
        <select
          value={chapterId}
          className="bg-gray-800 text-white font-semibold text-xs md:text-sm px-2 md:px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-rose-500 transition-colors max-w-[140px] md:max-w-none"
          onChange={(e) => {
            const selectedChapter = e.target.value;
            if (selectedChapter) { navigate(`/reader/${mangaId}/${selectedChapter}`) };
          }}
        >
          <option value="">Chapters</option>
          {sortedChapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              Ch. {ch.attributes.chapter || "?"}
            </option>
          ))}
        </select>
        <button
          disabled={!nextChapter}
          className="bg-gray-800 text-white font-semibold text-sm px-6 py-2 rounded border border-gray-700 hover:bg-gray-700 active:bg-gray-900 disabled:opacity-30 transition-colors"
          onClick={() => {
            if (nextChapter) {
              navigate(`/reader/${mangaId}/${nextChapter.id}`);
            }
          }}
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
}

export default Reader;
