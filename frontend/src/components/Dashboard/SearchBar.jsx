import React from 'react';

// Define the SearchIcon component directly in this file
const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

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
