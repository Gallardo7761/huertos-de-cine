const SearchToolbar = ({ searchTerm, onSearchChange }) => (
    <div className="sticky-toolbar search-toolbar-wrapper">
        <div className="search-toolbar">
            <input
                type="text"
                className="search-input"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    </div>
);

export default SearchToolbar;