import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Herobanner({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // slide effect
  useEffect(() => {
    if (!items || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentManga = items[currentIndex];
  const { id, title, description: desc, coverFile, tags } = currentManga;
  const cover = coverFile ? `https://mangaheist-backend.onrender.com/api/manga/cover/${id}/${coverFile}` : "";

  // Get genres string
  const genres = tags
    ?.slice(0, 4)
    ?.map((tag) => tag.attributes?.name?.en)
    ?.join(" · ") || "";

  return (
    <div className="relative bg-black min-h-[300px] md:min-h-[460px] flex items-center overflow-hidden transition-all duration-500 ease-in-out">

      {/* Background cover — only visible md+ */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[60%] hidden md:block opacity-60">
        <img
          key={`bg-${currentIndex}`} // Force re-render for fade
          className="w-full h-full object-cover object-center animate-fade-in"
          src={cover}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 w-full animate-fade-in" key={`content-${currentIndex}`}>
        {/* Cover image — hidden on very small screens, shown as thumbnail on md+ */}
        <div className="hidden md:flex flex-shrink-0 w-[150px] lg:w-[200px] h-[220px] lg:h-[300px] rounded-xl overflow-hidden border-2 border-gray-800 shadow-2xl shadow-rose-500/20">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mobile cover banner */}
        <div className="md:hidden w-full h-[180px] overflow-hidden rounded-xl mb-2 relative">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent" />
        </div>

        {/*content */}
        <div className="relative z-10 w-full mb-6 max-w-3xl">
          <span className="bg-rose-500 text-white text-xs font-semibold uppercase rounded-full py-1 px-3">
            Top Trending
          </span>
          <h1 className="text-white text-3xl md:text-5xl font-bold mt-3 mb-3 line-clamp-2 drop-shadow-md">
            {title}
          </h1>
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded shadow">
              Chapters
            </span>
            <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded shadow">
              Manga
            </span>
            {genres && (
              <span className="bg-rose-600/80 text-white text-xs px-3 py-1 rounded shadow">
                {genres}
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-6 line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow-sm">
            {desc}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to={`/manga/${id}`}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition shadow-lg shadow-rose-500/30"
            >
              Read Now
            </Link>
          </div>
        </div>
      </div>

      {/* Slider*/}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
                ? "bg-rose-500 w-6 h-2"
                : "bg-gray-600/70 hover:bg-gray-400 w-2 h-2"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Herobanner;
