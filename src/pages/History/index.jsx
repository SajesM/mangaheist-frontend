import { useState, useEffect } from "react";
import { api } from "../../api/backend";
import MangaCard from "../../shared/components/MangaCard";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getHistory();
        if (res && res.history) {
          // Deduplicate: keep only the latest entry per manga
          const seen = new Map();
          for (const item of res.history) {
            if (!seen.has(item.mangaId)) {
              seen.set(item.mangaId, item);
            } else {
              // Keep the entry with the higher chapter number
              const existing = seen.get(item.mangaId);
              const existingNum = parseFloat(existing.chapterNumber) || 0;
              const currentNum = parseFloat(item.chapterNumber) || 0;
              if (currentNum > existingNum) {
                seen.set(item.mangaId, item);
              }
            }
          }
          setHistory(Array.from(seen.values()));
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (localStorage.getItem("token")) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20 text-xl">Loading...</div>;
  }

  if (!localStorage.getItem("token")) {
    return <div className="text-white text-center py-20 text-xl">Please login to view history.</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
        Continue Reading
      </h1>

      {history.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No reading history yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {history.map((item) => (
            <div key={item.mangaId} className="relative">
              <span className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                Ch. {item.chapterNumber && item.chapterNumber !== "?" ? item.chapterNumber : "???"}
              </span>
              <MangaCard
                id={item.mangaId}
                title={item.mangaTitle}
                coverFile={item.coverUrl}
                tags={[]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
