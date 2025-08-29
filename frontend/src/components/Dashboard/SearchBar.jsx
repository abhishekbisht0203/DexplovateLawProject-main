const SearchBar = () => (
    <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
            type="text"
            placeholder="Search..."
            className="block w-full bg-gray-100 border border-transparent rounded-lg py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:bg-white sm:text-sm transition-all duration-300"
        />
    </div>
);
export default SearchBar;