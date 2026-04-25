import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../LoginModal";
import RegisterModal from "../RegisterModal";
import burgerIcon from "../../../assets/icons/burger.svg";
import closeIcon from "../../../assets/icons/close.svg";

function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Sync login state when modals close or route changes
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        setUsername(localStorage.getItem("username") || "User");
    }, [isLoginOpen, isRegisterOpen, location.pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/");
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/browse", label: "Browse" },
        ...(isLoggedIn ? [
            { to: "/bookmarks", label: "Bookmarks" },
            { to: "/history", label: "History" },
        ] : []),
    ];

    return (
        <nav>
            <div className="bg-black border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-screen-xl mx-auto px-4 md:px-6">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="text-white text-2xl font-bold flex-shrink-0">
                            <span className="text-rose-500">MangaHiest</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8 text-lg font-semibold text-white">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    className="hover:text-rose-500 transition-colors"
                                    to={link.to}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Auth Button / User Dropdown */}
                        <div className="hidden md:flex font-bold text-white text-lg items-center relative">
                            {isLoggedIn ? (
                                <div>
                                    <button
                                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors text-sm"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>{username}</span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-gray-800 rounded-md shadow-lg py-1 z-50">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded transition-colors text-sm"
                                >
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Mobile: Auth + Burger Button */}
                        <div className="flex md:hidden items-center gap-3">
                            {!isLoggedIn && (
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded transition-colors text-sm text-white font-semibold"
                                >
                                    Login
                                </button>
                            )}
                            {/* Burger icon */}
                            <button
                                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                                className="text-white focus:outline-none p-1"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    /* X icon */
                                    <img src={closeIcon} alt="Close menu" className="h-6 w-6" />
                                ) : (
                                    /* Hamburger icon */
                                    <img src={burgerIcon} alt="Open menu" className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-black border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-white text-lg font-semibold hover:text-rose-500 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors text-sm text-white font-semibold text-left"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </nav>
    );
}

export default Navbar;