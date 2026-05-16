import { useEffect, useRef, useState } from 'react';
import { searchMovies, getImageUrl } from '@/services/tmdbService';
import '@/css/MovieSearch.css';
import { useDebounce } from '@/hooks/useDebounce';

const MovieSearch = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchMovies = async () => {
            if (debouncedQuery.length > 2) {
                setIsLoading(true);
                try {
                    const movies = await searchMovies(debouncedQuery);
                    setResults(movies);
                } catch (error) {
                    console.error("Error buscando pelis:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        fetchMovies();
    }, [debouncedQuery]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const selectMovie = (m) => {
        onSelect({
            title: m.title,
            description: m.overview,
            cover: getImageUrl(m.poster_path)
        });
        setResults([]);
        setQuery('');
    };

    return (
        <div className="tmdb-search-container" ref={searchRef}>
            <input
                type="text"
                className="form-control themed-input"
                placeholder="Buscar en TMDB..."
                value={query}
                onChange={handleInputChange}
            />

            {isLoading && <div className="p-2 text-muted">Buscando...</div>}

            {results.length > 0 && (
                <div className="tmdb-results-list shadow-lg">
                    {results.map(m => (
                        <div
                            key={m.id}
                            className="tmdb-result-item"
                            onClick={() => selectMovie(m)}
                        >
                            <img
                                src={getImageUrl(m.poster_path) || 'https://via.placeholder.com/45x68?text=No+Img'}
                                alt={m.title}
                            />
                            <div className="tmdb-result-info">
                                <span className="tmdb-result-title">{m.title}</span>
                                <span className="tmdb-result-year">
                                    {m.release_date ? m.release_date.split('-')[0] : 'S/N'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieSearch;