"use client";
import React, { useState } from "react";
import { useCart } from "./cart-context";
import dynamic from "next/dynamic";
const CartModal = dynamic(() => import("./CartModal"), { ssr: false });
import Link from "next/link";
import { Menu, X, Search, ShoppingCart } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", highlight: true },
  { href: "/shop", label: "Shop" },
  { href: "/states", label: "By State" },
  { href: "/", label: "Guides" },
  { href: "/", label: "Course" },
  { href: "/", label: "About" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <header className="w-full bg-white/85 backdrop-blur-sm shadow-lg px-4 md:px-8 py-3 z-50 fixed top-0 left-0">
      <div className="max-w-7xl mx-auto  flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <img
            src="https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png"
            alt="Logo"
            className="w-8 h-8 md:w-10 md:h-10 bg-black rounded"
          />
          <span className="text-base sm:text-lg md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
            Care Licensing{" "}
            <span className="text-green-700 font-bold">Solutions</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={
                link.highlight
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 transition"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="p-2 rounded hover:bg-gray-100 transition">
            <Search size={20} className="text-black" />
          </button>

          <div className="relative">
            <button className="p-2 rounded hover:bg-gray-100 transition" onClick={() => setCartOpen((v) => !v)}>
              <ShoppingCart size={20} className="text-black" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {/* Dropdown CartModal */}
            {cartOpen && (
              <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
            )}
          </div>

          <Link
            href="/"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Get Started
          </Link>
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
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  link.highlight
                    ? "text-green-700 font-semibold text-lg"
                    : "text-gray-700 hover:text-green-700 text-lg transition"
                }
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Icons */}
            <div className="flex items-center gap-6 mt-4">
              <Search size={22} className="text-black" />
              <div className="relative">
                <ShoppingCart size={22} className="text-black" />
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </div>
            </div>

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition text-center mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
