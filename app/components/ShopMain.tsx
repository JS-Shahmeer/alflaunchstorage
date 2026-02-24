"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const BundleModal = dynamic(() => import("./BundleModal"), { ssr: false });
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Eye } from "lucide-react";

const states = [
  {
    code: "AL",
    name: "Alabama",
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg",
  },
  {
    code: "AK",
    name: "Alaska",
    flag: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg",
  },
  {
    code: "AZ",
    name: "Arizona",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg",
  },
  {
    code: "AR",
    name: "Arkansas",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg",
  },
  {
    code: "CA",
    name: "California",
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg",
  },
  {
    code: "CO",
    name: "Colorado",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg",
  },
  {
    code: "CT",
    name: "Connecticut",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Connecticut.svg",
  },
  {
    code: "DE",
    name: "Delaware",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Delaware.svg",
  },
  {
    code: "FL",
    name: "Florida",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg",
  },
  {
    code: "GA",
    name: "Georgia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Georgia_%28U.S._state%29.svg",
  },
  {
    code: "HI",
    name: "Hawaii",
    flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg",
  },
  {
    code: "ID",
    name: "Idaho",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Idaho.svg",
  },
  {
    code: "IL",
    name: "Illinois",
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg",
  },
  {
    code: "IN",
    name: "Indiana",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg",
  },
  {
    code: "IA",
    name: "Iowa",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Iowa.svg",
  },
  {
    code: "KS",
    name: "Kansas",
    flag: "https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Kansas.svg",
  },
  {
    code: "KY",
    name: "Kentucky",
    flag: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Flag_of_Kentucky.svg",
  },
  {
    code: "LA",
    name: "Louisiana",
    flag: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Louisiana.svg",
  },
  {
    code: "ME",
    name: "Maine",
    flag: "https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Maine.svg",
  },
  {
    code: "MD",
    name: "Maryland",
    flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg",
  },
  {
    code: "MA",
    name: "Massachusetts",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Massachusetts.svg",
  },
  {
    code: "MI",
    name: "Michigan",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Michigan.svg",
  },
  {
    code: "MN",
    name: "Minnesota",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Minnesota.svg",
  },
  {
    code: "MS",
    name: "Mississippi",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg",
  },
  {
    code: "MO",
    name: "Missouri",
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Missouri.svg",
  },
  {
    code: "MT",
    name: "Montana",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Montana.svg",
  },
  {
    code: "NE",
    name: "Nebraska",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Nebraska.svg",
  },
  {
    code: "NV",
    name: "Nevada",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_Nevada.svg",
  },
  {
    code: "NH",
    name: "New Hampshire",
    flag: "https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_New_Hampshire.svg",
  },
  {
    code: "NJ",
    name: "New Jersey",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_New_Jersey.svg",
  },
  {
    code: "NM",
    name: "New Mexico",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_New_Mexico.svg",
  },
  {
    code: "NY",
    name: "New York",
    flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg",
  },
  {
    code: "NC",
    name: "North Carolina",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg",
  },
  {
    code: "ND",
    name: "North Dakota",
    flag: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_North_Dakota.svg",
  },
  {
    code: "OH",
    name: "Ohio",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg",
  },
  {
    code: "OK",
    name: "Oklahoma",
    flag: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Oklahoma.svg",
  },
  {
    code: "OR",
    name: "Oregon",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg",
  },
  {
    code: "PA",
    name: "Pennsylvania",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pennsylvania.svg",
  },
  {
    code: "RI",
    name: "Rhode Island",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Rhode_Island.svg",
  },
  {
    code: "SC",
    name: "South Carolina",
    flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_South_Carolina.svg",
  },
  {
    code: "SD",
    name: "South Dakota",
    flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_South_Dakota.svg",
  },
  {
    code: "TN",
    name: "Tennessee",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Tennessee.svg",
  },
  {
    code: "TX",
    name: "Texas",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Texas.svg",
  },
  {
    code: "UT",
    name: "Utah",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Utah.svg",
  },
  {
    code: "VT",
    name: "Vermont",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Vermont.svg",
  },
  {
    code: "VA",
    name: "Virginia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Virginia.svg",
  },
  {
    code: "WA",
    name: "Washington",
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg",
  },
  {
    code: "WV",
    name: "West Virginia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_West_Virginia.svg",
  },
  {
    code: "WI",
    name: "Wisconsin",
    flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Wisconsin.svg",
  },
  {
    code: "WY",
    name: "Wyoming",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg",
  },
];

const allProducts = [
  {
    state: "Alabama",
    code: "AL",
    program: "Nursing Facility",
    bestValue: true,
    type: "Complete Bundle",
    title: "Alabama Nursing Facility Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Alabama", "Nursing Facility"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "California",
    code: "CA",
    program: "Group Home for Adults with Developmental Disabilities",
    bestValue: true,
    type: "Complete Bundle",
    title:
      "California Group Home for Adults with Developmental Disabilities Complete Bundle",
    description: "Everything you need in one complete package",
    tags: [
      "California",
      "Group Home for Adults with Developmental Disabilities",
    ],
    price: 1397,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Delaware",
    code: "DE",
    program: "Adult Day Care Program",
    bestValue: true,
    type: "Complete Bundle",
    title: "Delaware Adult Day Care Program Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Delaware", "Adult Day Care Program"],
    price: 1197,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Delaware.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Illinois",
    code: "IL",
    program: "Nursing Facility",
    bestValue: true,
    type: "Complete Bundle",
    title: "Illinois Nursing Facility Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Illinois", "Nursing Facility"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Minnesota",
    code: "MN",
    program: "Nursing Facility",
    bestValue: true,
    type: "Complete Bundle",
    title: "Minnesota Nursing Facility Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Minnesota", "Nursing Facility"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Minnesota.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Nevada",
    code: "NV",
    program: "Ambulatory Surgical Center",
    bestValue: true,
    type: "Complete Bundle",
    title: "Nevada Ambulatory Surgical Center Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Nevada", "Ambulatory Surgical Center"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_Nevada.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "New York",
    code: "NY",
    program: "Child Care Program",
    bestValue: true,
    type: "Complete Bundle",
    title: "New York Child Care Program Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["New York", "Child Care Program"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Tennessee",
    code: "TN",
    program: "Home Care Organization",
    bestValue: true,
    type: "Complete Bundle",
    title: "Tennessee Home Care Organization Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Tennessee", "Home Care Organization"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Tennessee.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
  {
    state: "Texas",
    code: "TX",
    program: "Adult Day Care Program",
    bestValue: true,
    type: "Complete Bundle",
    title: "Texas Adult Day Care Program Complete Bundle",
    description: "Everything you need in one complete package",
    tags: ["Texas", "Adult Day Care Program"],
    price: 1297,
    format: "PDF Format",
    download: true,
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Texas.svg",
    logo: "https://facility-launchkit.lovable.app/assets/alf-launch-logo-B5RpnBeN.png",
    year: 2025,
  },
];

const productTypes = [
  { label: "All Product Types", price: null },
  { label: "Market Research Report", price: 397 },
  { label: "Policy & Procedure Manual", price: 497 },
  { label: "Pro Forma P&L Template", price: 297 },
  { label: "Licensing Checklist", price: 397 },
  { label: "Complete Bundle", price: null },
];

type Product = typeof allProducts[number];

export default function ShopMain() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Best Selling");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Filter logic
  const filteredProducts = allProducts.filter((p) => {
    const matchesState = !selectedState || p.code === selectedState;
    const matchesProductType =
      !selectedProductType || p.type === selectedProductType;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesProductType && matchesSearch;
  });

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
              {productTypes.map((pt, idx) => (
                <label
                  key={pt.label}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="productType"
                    value={pt.label}
                    checked={selectedProductType === (pt.label === "All Product Types" ? "" : pt.label)}
                    onChange={() => setSelectedProductType(pt.label === "All Product Types" ? "" : pt.label)}
                    className="accent-green-700"
                  />
                  <span className="text-gray-900 text-sm">
                    {pt.label}
                    {pt.price && (
                      <span className="ml-2 text-green-900 font-semibold">
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
              ))}
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
                        <img
                          src={p.logo}
                          alt="logo"
                          className="w-10 h-10 rounded bg-black"
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
