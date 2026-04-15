"use client";
import React, { useState } from "react";
import { useCart } from "./cart-context";
import dynamic from "next/dynamic";
const CartModal = dynamic(() => import("./CartModal"), { ssr: false });
const SearchDropdown = dynamic(() => import("./SearchDropdown"), { ssr: false });
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingCart, User, LogOut } from "lucide-react";
import Image from "next/image";
import LogoImg from "@/public/assets/images/logo-dark-bg.png";
import { useAuth } from "./AuthContext";
import { useToast } from "./SimpleToast";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/states", label: "By State" },
  { href: "/course", label: "Course" },
  { href: "/about", label: "About" },
  // { href: "/guides", label: "Guides" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const toast = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.show('Error signing out');
    } else {
      toast.show('Signed out successfully');
    }
  };

  const linkClass =
    "relative w-fit text-gray-700 hover:text-green-700 transition after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-green-700 after:transition-all hover:after:w-full";

  return (
    <header className="w-full bg-white/85 backdrop-blur-sm shadow-lg px-4 md:px-8 py-3 z-50 fixed top-0 left-0">
      <div className="max-w-7xl mx-auto  flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <Image
            src={LogoImg}
            alt="Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded"
          />
          <span className="text-base sm:text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
            Care Licensing{" "}
            <span className="text-green-700 font-bold">Solutions</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {navLinks.map((link, idx) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <a
                key={idx}
                href={link.href}
                className={`${linkClass} ${
                  isActive
                    ? "text-green-700 font-semibold after:w-full"
                    : ""
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded hover:bg-gray-100 transition cursor-pointer"
          >
            <Search size={20} className="text-black" />
          </button>

          <div className="relative">
            <button className="p-2 rounded hover:bg-gray-100 transition cursor-pointer" onClick={() => setCartOpen((v) => !v)}>
              <ShoppingCart size={20} className="text-black" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User size={16} />
                <span>{user.user_metadata?.first_name || user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          )}

          <a
            href="/states"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu / Close Button */}
        <button
          className="lg:hidden p-2 relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={26} className="text-black" />
          ) : (
            <Menu size={26} className="text-black" />
          )}
        </button>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 flex flex-col gap-6 mt-16 bg-white">
            {navLinks.map((link, idx) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${linkClass} text-lg ${
                    isActive
                      ? "text-green-700 font-semibold after:w-full"
                      : ""
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Mobile Search */}
            <div className="mt-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                <Search size={18} className="text-gray-400" />
                <span className="text-gray-600">Search...</span>
              </button>
            </div>

            {/* Mobile Cart and Auth */}
            <div className="flex items-center justify-between mt-4">
              <div className="relative">
                <button
                  className="p-2 rounded hover:bg-gray-100 transition"
                  onClick={() => setCartOpen((v) => !v)}
                >
                  <ShoppingCart size={22} className="text-black" />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User size={16} />
                    <span className="truncate max-w-32">{user.user_metadata?.first_name || user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={16} className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            <a
              href="/states"
              onClick={() => setMenuOpen(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition text-center mt-4"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Cart Modal */}
        {cartOpen && (
          <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
        )}

        {/* Search Dropdown (Global) */}
        <SearchDropdown
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={(url) => {
            router.push(url);
            setMenuOpen(false); // Close mobile menu if open
          }}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
