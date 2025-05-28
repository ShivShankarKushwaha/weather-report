import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../Redux/slices/locationSlice";
import { MobileSidebar } from "./MobileMenu";
import { LocationSearch } from "./LocationSearch";
import { cities } from "../assets/city";
import type { RootState } from "../Redux/store";

export const NavBar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const currentCity = useSelector((state:RootState) => state.location.currentCity);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCity) {
      setSelectedLocation(currentCity);
    }
  }, [currentCity]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/forecast", label: "Forecast" },
  ];

  const filteredLocations = cities.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseCurrentLocation = () => {
    setSelectedLocation("Current Location");
    setDropdownOpen(false);
    dispatch(setCity("Current Location"));
    setSearch("");
  };

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    setDropdownOpen(false);
    dispatch(setCity(loc));
    setSearch("");
  };

  return (
    <div>
      <div className="lg:w-4/5 border bg-slate-200/60 h-20 mx-auto my-4 rounded-lg flex items-center justify-between hover:bg-slate-300/60 transition-all duration-300 px-6 fixed top-0 left-1/2 transform -translate-x-1/2 shadow-lg z-20 w-[90%]">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          <span className="ml-3 text-xl font-bold text-slate-700 hidden lg:flex">WeatherApp</span>
        </div>

        <nav className="gap-6 items-center cursor-pointer transition-all duration-500 hidden lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-slate-700 font-medium transition-colors hover:text-blue-600 ${
                location.pathname === link.to
                  ? "text-blue-700 border shadow-slate-100 shadow-inner p-2 px-3 rounded"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LocationSearch
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            selectedLocation={selectedLocation}
            setSelectedLocation={handleSelectLocation}
            search={search}
            setSearch={setSearch}
            handleUseCurrentLocation={handleUseCurrentLocation}
          />
        </nav>

        <div className="lg:hidden flex items-center">
          <FaBars
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl text-slate-700 cursor-pointer"
          />
          <MobileSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            navLinks={navLinks}
            handleSelectLocation={handleSelectLocation}
            handleUseCurrentLocation={handleUseCurrentLocation}
            search={search}
            setSearch={setSearch}
            filteredLocations={filteredLocations}
          />
        </div>
      </div>
    </div>
  );
};
