// components/LocationSearch.tsx
import { useEffect, useRef } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { cities } from "../assets/city";

interface LocationSearchProps {
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLocation: string | null;
  setSelectedLocation: (loc: string) => void;
  search: string;
  setSearch: (value: string) => void;
  handleUseCurrentLocation: () => void;
}

export const LocationSearch = ({
  dropdownOpen,
  setDropdownOpen,
  selectedLocation,
  setSelectedLocation,
  search,
  setSearch,
  handleUseCurrentLocation,
}: LocationSearchProps) => {
  const locationButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationButtonRef.current &&
        !locationButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const filteredLocations = cities.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative locationButton" ref={locationButtonRef}>
      <button
        className="text-slate-700 font-medium px-4 py-2 rounded shadow bg-slate-100/70 flex items-center gap-2 cursor-pointer outline-none"
        onClick={() => setDropdownOpen((open) => !open)}
        type="button"
      >
        {selectedLocation || "Select Location"}
        <svg
          className={
            "w-4 h-4 ml-1 transition-all duration-300 " +
            (dropdownOpen ? " rotate-180" : "")
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-6 w-64 border rounded shadow-lg z-10 bg-custom-gradient">
          <button
            className="w-full text-left px-4 py-2 hover:bg-slate-100/50 flex gap-4 cursor-pointer"
            onClick={handleUseCurrentLocation}
          >
            <FaLocationCrosshairs />
            <span>Use Current Location</span>
          </button>

          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border rounded outline-none"
            />
          </div>

          <div className="max-h-40 overflow-y-auto scrollbar">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <button
                  key={loc}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100/50 cursor-pointer"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setDropdownOpen(false);
                    setSearch("");
                  }}
                >
                  {loc}
                </button>
              ))
            ) : (
              <div className="px-4 py-2">No locations found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
