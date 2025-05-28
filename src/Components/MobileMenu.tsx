import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export const MobileSidebar = ({
  isOpen,
  onClose,
  navLinks,
  selectedLocation,
  handleSelectLocation,
  handleUseCurrentLocation,
  search,
  setSearch,
  filteredLocations,
}) => {
  return (
    <div>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-opacity-40 z-40 lg:hidden w-full"
        />
      )}
      <div
        className={`fixed -top-4 -left-14 w-full h-full z-50 transform ${
          isOpen ? "translate-x-0 -left-[2px] -top-[10px]" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-xl lg:hidden bg-slate-500 rounded-t-xl`}
      >
        <div className="flex items-center justify-between px-4 py-4 text-white text-xl font-semibold">
          <span>Menu</span>
          <FaTimes onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-4 px-4 p-5 m-0 w-full bg-slate-500 rounded-b-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="text-white text-lg hover:text-yellow-300"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => {
              handleUseCurrentLocation();
              onClose();
            }}
            className="text-white flex items-center gap-2 hover:text-yellow-300"
          >
            Use Current Location
          </button>

          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 mt-2 rounded bg-slate-900 text-white outline-none w-full"
          />

          <div className="overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-gray-300">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    handleSelectLocation(loc);
                    onClose();
                  }}
                  className="block text-left w-full text-white hover:text-yellow-300 p-2"
                >
                  {loc}
                </button>
              ))
            ) : (
              <p className="text-white mt-2">No locations found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
