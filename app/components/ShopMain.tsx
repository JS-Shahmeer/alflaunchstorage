"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { BundleProduct } from "@/lib/bundles";
import { fetchShopProducts } from "@/lib/bundles";
import BundleCard from "./BundleCard";
const BundleModal = dynamic(() => import("./BundleModal"), { ssr: false });
import * as Select from "@radix-ui/react-select";
import { ChevronDown, X } from "lucide-react";
import { states, productTypes, slugify } from "../data/shopData";
import Image from "next/image";

export default function ShopMain() {
  const router = useRouter();
  const [products, setProducts] = useState<BundleProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedProgramSlug, setSelectedProgramSlug] = useState("");
  // allow selecting multiple product types via checkboxes
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Best Selling");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<BundleProduct | null>(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchShopProducts();
        setProducts(data);
      } catch (error) {
        console.error("Unable to load products from the database:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
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

  let filteredProducts = products.filter((p) => {
    const productType = p.metadata?.productLabel || p.type || "";
    const stateCode = p.metadata?.code || "";
    const productState = p.metadata?.state || "";
    const productProgram = p.metadata?.program || "";
    const productTitle = p.name || "";

    const matchesState = !selectedState || stateCode === selectedState;
    const matchesProductType =
      selectedProductTypes.length === 0 || selectedProductTypes.includes(productType);
    const matchesSearch =
      !search ||
      productTitle.toLowerCase().includes(search.toLowerCase()) ||
      productState.toLowerCase().includes(search.toLowerCase()) ||
      productProgram.toLowerCase().includes(search.toLowerCase());
    const matchesProgram =
      !selectedProgramSlug || slugify(productProgram) === selectedProgramSlug;
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
      .sort((a, b) => (b.metadata?.year || 0) - (a.metadata?.year || 0));
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
              {loadingProducts ? "Searching for Products..." : `Showing ${filteredProducts.length} of ${products.length} products`}
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
                className="cursor-pointer text-green-800 hover:text-black text-sm font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards */}
          {loadingProducts ? (
            <p className="text-center text-green-700 text-lg py-10">
              Searching for Products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-green-700 text-lg py-10">
              No Product Found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <BundleCard
                  key={p.id}
                  bundle={p}
                  onAction={() => {
                    setModalProduct(p);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        {/* Modal for bundle details (only one instance, outside the map) */}
        {modalOpen && modalProduct && (
          <BundleModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            bundleTitle={modalProduct.name}
            price={modalProduct.price}
            oldPrice={modalProduct.metadata?.oldPrice ?? modalProduct.price * 1.8}
            saveAmount={(modalProduct.metadata?.oldPrice ?? modalProduct.price * 1.8) - modalProduct.price}
            items={
              modalProduct.features && modalProduct.features.length > 0
                ? modalProduct.features.map((label) => ({ label, price: 0 }))
                : [
                    { label: "Market Research Report", price: 397 },
                    { label: "Policy & Procedure Manual", price: 497 },
                    { label: "Pro Forma P&L Template", price: 297 },
                    { label: "Licensing Checklist", price: 397 },
                  ]
            }
            bonuses={
              modalProduct.metadata?.bonuses && modalProduct.metadata.bonuses.length > 0
                ? modalProduct.metadata.bonuses
                : ["Private Community Access", "Free Updates When Laws Change"]
            }
            coursePrice={modalProduct.metadata?.coursePrice ?? 297}
          />
        )}
      </div>
      </div>
    </section>
  );
}
