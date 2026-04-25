import { Link } from "react-router-dom";

function MangaCard({ id, title, coverFile, tags }) {
  const cover = coverFile
    ? `https://mangaheist-backend.onrender.com/api/manga/cover/${id}/${coverFile}.256.jpg`
    : " ";

  // console.log(`https://uploads.mangadex.org/covers/${id}/${coverFile}`);
  // console.log(`https://api.mangadex.org/cover/${coverId}`);

  const genre = (tags || [])
    .slice(0, 4)
    .map((tag) => tag.attributes.name.en)
    .join(" · ");

  return (
    <Link to={`/manga/${id}`} className="w-[180px] block group">
      {/* image box */}
      <div className="relative w-full h-[240px] overflow-hidden bg-gray-900 mb-2">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* info below image */}
      <div className="px-1">
        <h3 className="text-white text-sm font-semibold mb-1">
          {title}
        </h3>
        <p className="text-gray-400 text-xs mb-2">{genre}</p>
      </div>
    </Link>
  );
}

export default MangaCard;
