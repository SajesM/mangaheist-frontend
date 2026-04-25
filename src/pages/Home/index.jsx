import { useEffect, useState } from "react";
import Herobanner from "../../shared/components/HeroBanner";
import MangaCard from "../../shared/components/MangaCard";

function Home() {
  const [mangaList, setMangaList] = useState([]); // Popular
  const [top, setTop] = useState([]); // Trending
  const [latestManga, setLatestManga] = useState([]); // Latest
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mangaRes, topRes, latestRes] = await Promise.all([
          fetch('https://mangaheist-backend.onrender.com/api/manga/list?limit=10'),
          fetch('https://mangaheist-backend.onrender.com/api/manga/trending'),
          fetch('https://mangaheist-backend.onrender.com/api/manga/latest')
        ]);

        if (!mangaRes.ok || !topRes.ok || !latestRes.ok) throw new Error("Failed to fetch data");

        const mangaData = await mangaRes.json();
        const topData = await topRes.json();
        const latestData = await latestRes.json();

        setMangaList(mangaData);
        setTop(topData || []);
        setLatestManga(latestData || []);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white p-12 text-center text-xl font-bold">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-12 text-center font-bold">Error: {error}</div>;
  }

  return (
    <div className="bg-[#000000e6] min-h-screen pb-16">
      {top.length > 0 && (
        <Herobanner items={top.slice(0, 8)} />
      )}

      <div className="mt-12 px-4 md:px-12 lg:px-24 xl:px-32 flex flex-col gap-12">
        {/* Popular Section */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-6 border-l-4 border-rose-500 pl-3">Popular Manga</h2>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            {Array.isArray(mangaList) && mangaList.map((manga) => (
              <MangaCard
                id={manga.id}
                key={manga.id}
                title={manga.title}
                coverFile={manga.coverFile}
                tags={manga.tags || []}
              />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-6 border-l-4 border-rose-500 pl-3">Trending Manga</h2>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            {Array.isArray(top) && top.map((manga) => (
              <MangaCard
                id={manga.id}
                key={manga.id}
                title={manga.title}
                coverFile={manga.coverFile}
                tags={manga.tags || []}
              />
            ))}
          </div>
        </section>

        {/* Latest Section */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-6 border-l-4 border-rose-500 pl-3">Latest Updates</h2>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            {Array.isArray(latestManga) && latestManga.map((manga) => (
              <MangaCard
                id={manga.id}
                key={manga.id}
                title={manga.title}
                coverFile={manga.coverFile}
                tags={manga.tags || []}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
