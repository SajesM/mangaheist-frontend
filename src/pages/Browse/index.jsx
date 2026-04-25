
import { useState, useEffect } from 'react';
import MangaCard from '../../shared/components/MangaCard';

function Browse() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [latestManga, setLatestManga] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchLatestManga();
    }, []);

    const fetchLatestManga = async () => {
        try {
            const response = await fetch('https://mangaheist-backend.onrender.com/api/manga/latest');
            const data = await response.json();
            setLatestManga(data || []);
        } catch (error) {
            console.error('Error fetching latest manga:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://mangaheist-backend.onrender.com/api/manga/search?title=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error('Error searching manga:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="bg-[#000000e6] min-h-screen px-6 py-10">
            {/* Search Bar */}
            <div className="justify-center flex mb-10">
                <form className="w-full max-w-xl flex" onSubmit={handleSearch}>
                    <input
                        className="flex-1 px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:border-rose-900"
                        type="text"
                        placeholder="Search manga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="px-6 py-3 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-r-lg transition"
                        type="submit"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/*Results */}
            {searchResults.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-white text-2xl font-bold mb-6">Search Results</h2>
                    <div className="flex flex-wrap gap-6">
                        {searchResults.map(manga => (
                            <MangaCard
                                key={manga.id}
                                id={manga.id}
                                title={manga.title}
                                coverFile={manga.coverFile}
                                tags={manga.tags || []}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Latest Manga */}
            <div>
                <h2 className="text-white text-2xl font-bold mb-6">
                    {searchResults.length > 0 ? 'Latest Manga' : 'Browse Latest Manga'}
                </h2>
                <div className="flex flex-wrap gap-6">
                    {latestManga.map(manga => (
                        <MangaCard
                            key={manga.id}
                            id={manga.id}
                            title={manga.title}
                            coverFile={manga.coverFile}
                            tags={manga.tags || []}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Browse;