import { useState, useEffect } from "react";
import { api } from "../../api/backend";
import MangaCard from "../../shared/components/MangaCard";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.getBookmarks();
        if (res && res.bookmarks) setBookmarks(res.bookmarks);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20 text-xl">Loading...</div>;
  }

  if (!localStorage.getItem("token")) {
    return <div className="text-white text-center py-20 text-xl">Please login to view bookmarks.</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-8 bg-black">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
        My Bookmarks
      </h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-400 text-center py-10">You haven't bookmarked any manga yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {bookmarks.map((bm) => (
            <div key={bm.mangaId} className="relative">
              <MangaCard
                id={bm.mangaId}
                title={bm.title}
                coverFile={bm.cover}
                tags={[]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
