"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const BundleModal = dynamic(() => import("./BundleModal"), { ssr: false });
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Eye, X } from "lucide-react";
import { states, allProducts, productTypes, Product, slugify } from "../data/shopData";
import Image from "next/image";

export default function ShopMain() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("");
  const [selectedProgramSlug, setSelectedProgramSlug] = useState("");
  // allow selecting multiple product types via checkboxes
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Best Selling");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // read URL param from window only once when component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramProgram = params.get("programs") || "";
    const paramSearch = params.get("search") || "";
    const paramState = params.get("state") || "";
    if (paramProgram) {
      setSelectedProgramSlug(paramProgram);
    }
    if (paramSearch) {
      setSearch(paramSearch);
    }
    if (paramState) {
      setSelectedState(paramState);
    }
  }, []);

  // keep the URL in sync when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedProgramSlug) {
      params.set("programs", selectedProgramSlug);
    }
    if (search) {
      params.set("search", search);
    }
    if (selectedState) {
      params.set("state", selectedState);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : "/shop";
    router.replace(newUrl);
  }, [selectedProgramSlug, search, selectedState, router]);
  // Filter logic
  let filteredProducts = allProducts.filter((p) => {
    const matchesState = !selectedState || p.code === selectedState;
    const matchesProductType =
      selectedProductTypes.length === 0 || selectedProductTypes.includes(p.type);
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase());
    const matchesProgram =
      !selectedProgramSlug || slugify(p.program) === selectedProgramSlug;
    return matchesState && matchesProductType && matchesSearch && matchesProgram;
  });

  // apply sorting
  if (sort === "Price: Low to High") {
    filteredProducts = filteredProducts.slice().sort((a, b) => a.price - b.price);
  } else if (sort === "Price: High to Low") {
    filteredProducts = filteredProducts.slice().sort((a, b) => b.price - a.price);
  } else if (sort === "Newest") {
    filteredProducts = filteredProducts
      .slice()
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }
  // Best Selling leaves original order


  return (
    <section className="bg-[#faf9f7] w-full md:py-12 py-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Filters */}
        <aside className="w-full md:w-64 p-6 shrink-0">
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-black">
              State
            </label>
            <Select.Root
              value={selectedState || "ALL"}
              onValueChange={(val) =>
                setSelectedState(val === "ALL" ? "" : val)
              }
            >
              <Select.Trigger
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-white text-black"
                aria-label="State"
              >
                <span style={{ pointerEvents: "none" }}>
                  {selectedState
                    ? states.find((s) => s.code === selectedState)?.name
                    : "All States"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={4}
                  className="z-50 w-[var(--radix-select-trigger-width)] min-w-[180px] max-w-full sm:max-w-xs bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none"
                >
                  <Select.Viewport className="max-h-72 overflow-y-auto">
                    <Select.Item
                      value="ALL"
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    >
                      <span className="text-black">All States</span>
                    </Select.Item>
                    {states.map((s) => (
                      <Select.Item
                        key={s.code}
                        value={s.code}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer text-black"
                      >
                        <img
                          src={s.flag}
                          alt={s.name}
                          className="w-5 h-3 rounded mr-2"
                        />
                        <span>{s.name}</span>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-black">
              Program Type
            </label>
            <div className="text-gray-500 text-xs mb-2">
              Select a state first to see available program types
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-black">
              Product Type
            </label>
            <div className="flex flex-col gap-2">
              {productTypes.map((pt) => {
                // skip rendering the "All Product Types" option as its own checkbox;
                // clearing selections is handled by the UI below
                if (pt.label === "All Product Types") return null;
                const isChecked = selectedProductTypes.includes(pt.label);
                return (
                  <label
                    key={pt.label}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={pt.label}
                      checked={isChecked}
                      onChange={() => {
                        setSelectedProductTypes((prev) => {
                          if (isChecked) {
                            return prev.filter((v) => v !== pt.label);
                          } else {
                            return [...prev, pt.label];
                          }
                        });
                      }}
                      className="accent-green-700 mt-1.5"
                    />
                    <span className="text-gray-900 text-sm flex items-start flex-col">
                      {pt.label}
                      {pt.price && (
                        <span className="text-green-900 font-semibold">
                          ${pt.price}
                        </span>
                      )}
                      {pt.label === "Complete Bundle" && (
                        <span className="block text-green-700 text-xs font-semibold">
                          See What's Included
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:px-0 px-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              Showing {filteredProducts.length} of {allProducts.length} products
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 rounded-lg border border-gray-200 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <select
                className="rounded-lg border border-gray-200 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option>Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedState || selectedProductTypes.length > 0 || selectedProgramSlug) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-gray-700 text-sm font-medium">Active filters:</span>
              {selectedState && (
                <div
                  className="inline-flex items-center gap-2 bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                  onClick={() => setSelectedState("")}
                >
                  <span>
                    {states.find((s) => s.code === selectedState)?.name}
                  </span>
                  <X size={16} />
                </div>
              )}
              {selectedProgramSlug && (
                <div
                  className="inline-flex items-center gap-2 bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                  onClick={() => setSelectedProgramSlug("")}
                >
                  <span>{selectedProgramSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <X size={16} />
                </div>
              )}
              {selectedProductTypes.map((type) => (
                <div
                  key={type}
                  className="inline-flex items-center gap-2 bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                  onClick={() =>
                    setSelectedProductTypes((prev) => prev.filter((t) => t !== type))
                  }
                >
                  <span>{type}</span>
                  <X size={16} />
                </div>
              ))}
              <button
                onClick={() => {
                  setSelectedState("");
                  setSelectedProductTypes([]);
                  setSelectedProgramSlug("");
                }}
                className="text-green-800 hover:text-green-900 text-sm font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-green-700 text-lg py-10">
              No product found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#fffbea] border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden hover:shadow-lg transition group"
                >
                  {/* Gold Top Border */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 rounded-t-2xl" />

                  <div className="p-4 pt-6 flex flex-col flex-1">
                    {/* State, Code Circle, and Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.flag}
                          alt={p.state}
                          className="w-6 h-4 rounded shadow"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg text-gray-900 inline-block">
                            {p.state}
                          </span>
                          <span className="text-xs text-gray-500 inline-block">
                            State Approved {p.year || 2025}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold w-10 h-10 flex items-center justify-center rounded-full">
                          {p.code}
                        </span>
                        {p.bestValue && (
                          <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                            Best Value
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Program Type Pill */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                        {p.program}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Features */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-green-700 text-xs">
                          <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                          Instant Download
                        </span>
                        <span className="flex items-center gap-1 text-gray-700 text-xs">
                          <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                          PDF Format
                        </span>
                      </div>

                      {/* Logo */}
                      <div>
                        <Image
                          src={p.logo}
                          alt="logo"
                          className="w-10 h-10 rounded"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2 mt-2">
                      <span className="bg-gray-100 text-gray-700 text-[9px] px-2 py-1 rounded-full">
                        {p.state}
                      </span>
                      <span className="bg-green-700 text-white text-[9px] px-2 py-1 rounded-full font-semibold">
                        {p.program}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mb-2">
                      <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {p.title}
                      </div>
                      <div className="text-gray-700 text-[10px] mb-1 line-clamp-2">
                        {p.description}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className="cursor-pointer w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-2 rounded-lg mt-auto flex items-center justify-center gap-2 transition text-sm"
                      onClick={() => {
                        setModalProduct(p);
                        setModalOpen(true);
                      }}
                    >
                      <Eye size={16} />
                      See What's Included
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        {/* Modal for bundle details (only one instance, outside the map) */}
        {modalOpen && modalProduct && (
          <BundleModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            bundleTitle={modalProduct.title}
            price={modalProduct.price}
            oldPrice={2205}
            saveAmount={2205 - modalProduct.price}
            items={[
              { label: "Market Research Report", price: 397 },
              { label: "Policy & Procedure Manual", price: 497 },
              { label: "Pro Forma P&L Template", price: 297 },
              { label: "Licensing Checklist", price: 397 },
            ]}
            bonuses={["Private Community Access", "Free Updates When Laws Change"]}
            coursePrice={297}
          />
        )}
      </div>
      </div>
    </section>
  );
}
