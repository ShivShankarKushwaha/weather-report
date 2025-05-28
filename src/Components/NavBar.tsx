import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaLocationCrosshairs } from "react-icons/fa6";
import {cities} from '../assets/city.ts'
import { useEffect, useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setCity } from "../Redux/slices/locationSlice.ts";
import { MobileSidebar } from "./MobileMenu";


export const NavBar = () => {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const currentCity = useSelector((state) => state.location.currentCity);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        if (currentCity) {
            setSelectedLocation(currentCity);
        }
    }, [currentCity]);

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
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropdownOpen]);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/forecast", label: "Forecast" },
    ];

    const filteredLocations = cities.filter(loc =>
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
            <nav className="gap-6 items-center cursor-pointer transition-all duration-500 hidden lg:flex ">
                {navLinks.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`text-slate-700 font-medium transition-colors hover:text-blue-600 ${
                            location.pathname === link.to ? "text-blue-700 border shadow-slate-100 shadow-inner p-2 px-3 rounded" : ""
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
                <div className="relative locationButton" ref={locationButtonRef}>
                    <button
                        className="text-slate-700 font-medium px-4 py-2 rounded shadow bg-slate-100/70 flex items-center gap-2 cursor-pointer outline-none"
                        onClick={() => setDropdownOpen((open) => !open)}
                        type="button"
                    >
                        {selectedLocation || "Select Location"}
                        <svg className={"w-4 h-4 ml-1 transition-all duration-300 "+(dropdownOpen?" rotate-180":"")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-6 w-64 border rounded shadow-lg z-10 bg-custom-gradient"
                        >
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-slate-100/50 flex gap-4 cursor-pointer"
                                onClick={handleUseCurrentLocation}
                            >
                                <FaLocationCrosshairs />
                                <span>
                                Use Current Location
                                </span>
                            </button>
                            <div className="px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full px-2 py-1 border rounded outline-none"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto scrollbar">
                                {filteredLocations.length > 0 ? (
                                    filteredLocations.map(loc => (
                                        <button
                                            key={loc}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-100/50 cursor-pointer"
                                            onClick={() => handleSelectLocation(loc)}
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
                selectedLocation={selectedLocation}
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
