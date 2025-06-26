import icons from "@/app/icons";
import React from "react";

export default function SearchBar({
    state,
}: {
    state: [string, React.Dispatch<React.SetStateAction<string>>];
}) {
    const [search, setSearch] = state;
    
    return (
        <div className="border px-2 py-1 rounded-md flex items-center justify-between gap-x-2 text-gray-600">
            <input
                type="text"
                name="search"
                id="search"
                className="px-2 py-1 bg-transparent w-full"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button>{icons.search}</button>
        </div>
    );
}
