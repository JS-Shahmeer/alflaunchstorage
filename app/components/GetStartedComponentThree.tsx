import Stepper from "./Stepper";
import { useToast } from "./SimpleToast";
import { programTypeIcons } from "./lucide-icons";
import { FileText, Award, Users } from "lucide-react";
import BundleModal from "./BundleModal";
import DetailsModal from "./DetailsModal";
import React from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GetStartedSidebar from "./GetStartedSidebar";
import { useCart } from "./cart-context";
import GetStartedStickyBar from "./GetStartedStickyBar";

export default function GetStartedComponentThree({
  steps,
  currentStep,
  selectedState,
  selectedType,
  stateNames,
  programTypes,
  bundleProducts,
  bonusProducts,
  individualProducts,
  bundleModalOpen,
  setBundleModalOpen,
}: {
  steps: string[];
  currentStep: number;
  selectedState: string;
  selectedType: string;
  stateNames: { [abbr: string]: string };
  programTypes: { key: string; desc: string }[];
  bundleProducts: { key: string }[];
  bonusProducts: { key: string }[];
  individualProducts: { key: string; desc: string; popular?: boolean }[];
  bundleModalOpen: boolean;
  setBundleModalOpen: (open: boolean) => void;
}) {
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [detailsProduct, setDetailsProduct] = React.useState<any | null>(null);
  const [selectedBundle, setSelectedBundle] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const { items: cartItems, addItem, removeItem } = useCart();
  const toast = useToast();
  const router = useRouter();
  return (
    <>
      <Stepper currentStep={currentStep} steps={steps} />
      <section className="flex flex-col items-center justify-center py-8 pb-32">
        {/* Header Badges */}
        <div className="w-full max-w-6xl flex items-center mb-4">
          <span className="bg-[#eaffea] text-[#417a5a] font-semibold px-4 py-2 rounded-full mr-2">State:</span>
          <span className="bg-[#417a5a] text-white font-semibold px-4 py-2 rounded-full mr-2">{stateNames[selectedState]}</span>
          <span className="bg-[#eaffea] text-[#417a5a] font-semibold px-4 py-2 rounded-full mr-2">Program:</span>
          <span className="bg-[#417a5a] text-white font-semibold px-4 py-2 rounded-full">{selectedType}</span>
        </div>
        <div className="w-full max-w-6xl flex gap-8">
          {/* Sidebar */}
          <GetStartedSidebar
            stateNames={stateNames}
            selectedState={selectedState}
            selectedType={selectedType}
            programTypes={programTypes}
            onStateChange={abbr => router.push(`/get-started?state=${abbr}&type=${encodeURIComponent(selectedType)}`)}
            onTypeChange={type => router.push(`/get-started?state=${selectedState}&type=${encodeURIComponent(type)}`)}
          />
          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col items-center mb-6">
              <span className="bg-[#eaffea] text-[#417a5a] font-semibold px-4 py-2 rounded-full mb-2">{stateNames[selectedState]} • {selectedType}</span>
              <h2 className="text-2xl font-bold text-[#417a5a] mb-2">Choose Your Products</h2>
              <p className="text-[#417a5a] mb-6 text-center">Select the resources you need to launch your {selectedType} in {stateNames[selectedState]}</p>
            </div>
            {/* Bundle Card */}
            <div className="border border-[#eaffea] rounded-xl bg-[#f9f9f4] p-6 flex flex-col md:flex-row gap-6 items-center mb-8 shadow-sm">
              <div className="flex-1">
                <span className="bg-[#e6d7b0] text-[#7a5a41] text-xs font-bold px-3 py-1 rounded-full">★ Most Popular - Save $1288</span>
                <h3 className="text-xl font-bold text-[#417a5a] mt-3 mb-2">Complete Licensing Bundle</h3>
                <p className="text-[#417a5a] mb-4">Everything you need to launch your care business with confidence</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-4">
                  {bundleProducts.map((p) => (
                    <li key={p.key} className="flex items-center gap-2 text-[#417a5a] text-sm">✔ {p.key}</li>
                  ))}
                </ul>
                <div className="text-xs font-semibold text-[#417a5a] mb-1">BONUSES INCLUDED:</div>
                <ul className="mb-2">
                  {bonusProducts.map((p) => (
                    <li key={p.key} className="flex items-center gap-2 text-[#417a5a] text-xs">✔ {p.key}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-55">
                <p className="text-[#417a5a] text-sm text-center">Everything you need in one complete package</p>
                <button
                  className={`bg-[#e6d7b0] text-[#7a5a41] font-semibold px-6 py-3 rounded-xl shadow-sm w-full ${selectedBundle ? 'ring-2 ring-[#417a5a]' : ''}`}
                  onClick={() => {
                    if (selectedBundle) {
                      removeItem('Complete Licensing Bundle');
                      setSelectedBundle(false);
                    } else {
                      addItem({
                        id: 'Complete Licensing Bundle',
                        name: 'Complete Licensing Bundle',
                        price: 997,
                        type: selectedType,
                        state: stateNames[selectedState],
                      });
                      setSelectedBundle(true);
                      toast.show('Complete Licensing Bundle added to cart!');
                    }
                  }}
                >
                  {selectedBundle ? 'Selected' : 'Select Bundle'}
                </button>
                <button
                  className="mt-2 bg-white border border-[#e6d7b0] text-[#7a5a41] font-semibold px-6 py-2 rounded-xl shadow-sm w-full"
                  onClick={() => setBundleModalOpen(true)}
                >
                  See What's Included
                </button>
                <div className="text-xs text-[#417a5a]">127 purchased this month</div>
              </div>
            </div>
            {/* Individual Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {individualProducts.map((p) => {
                const isSelected = selectedProducts.includes(p.key);
                const handleSelect = () => {
                  if (isSelected) {
                    removeItem(p.key);
                    setSelectedProducts((prev) => prev.filter((k) => k !== p.key));
                  } else {
                    addItem({
                      id: p.key,
                      name: p.key,
                      price: 397, // Default price for individual product
                      type: selectedType,
                      state: stateNames[selectedState],
                    });
                    setSelectedProducts((prev) => [...prev, p.key]);
                    toast.show(`${p.key} added to cart!`);
                  }
                };
                return (
                  <div key={p.key} className={`bg-white border ${isSelected ? 'border-[#417a5a] ring-2 ring-[#417a5a]' : 'border-[#eaffea]'} rounded-xl p-6 shadow-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-[#417a5a]">{p.key}</span>
                      {p.popular && (
                        <span className="ml-2 bg-[#eaffea] text-[#417a5a] text-xs font-bold px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                    <div className="text-[#417a5a] text-xs mb-4">{p.desc}</div>
                    <div className="flex gap-2">
                      <button
                        className={`border border-[#417a5a] text-[#417a5a] font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#eaffea] transition-all ${isSelected ? 'bg-[#eaffea]' : 'bg-white'}`}
                        onClick={handleSelect}
                      >{isSelected ? 'Selected' : 'Select'}</button>
                      <button
                        className="border border-[#417a5a] text-[#417a5a] font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#eaffea] transition-all"
                        onClick={() => {
                          setDetailsProduct(p);
                          setDetailsModalOpen(true);
                        }}
                      >View Details</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </section>
      <BundleModal
        open={bundleModalOpen}
        onClose={() => setBundleModalOpen(false)}
        bundleTitle={selectedType}
        price={997}
        oldPrice={2285}
        saveAmount={1288}
        items={bundleProducts.map((p) => ({ label: p.key, price: 297 }))}
        bonuses={bonusProducts.map((p) => p.key)}
        coursePrice={297}
      />
      <GetStartedStickyBar
        onBack={() => router.push(`/get-started?state=${selectedState}`)}
        onContinue={() => {
          // Allow checkout if bundle is selected OR bundle is in cart OR any individual product is in cart
          const bundleInCart = cartItems.some(item => item.name === 'Complete Licensing Bundle');
          const productInCart = cartItems.some(item => individualProducts.some(p => item.name === p.key));
          if (selectedBundle || bundleInCart || productInCart) {
            const params = new URLSearchParams({
              state: selectedState,
              type: selectedType,
              step: 'checkout',
              bundle: selectedBundle || bundleInCart ? '1' : '',
              products: productInCart ? cartItems.filter(item => individualProducts.some(p => item.name === p.key)).map(item => item.name).join(',') : ''
            });
            router.push(`/get-started?${params.toString()}`);
          } else {
            Swal.fire({
              icon: "warning",
              title: "Select a product",
              text: "Please select at least one product or the bundle to continue.",
              confirmButtonColor: "#417a5a"
            });
          }
        }}
      />
    {/* Details Modal integration */}
    {detailsModalOpen && detailsProduct && (
      <DetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        state={stateNames[selectedState]}
        agencyType={selectedType}
        price={detailsProduct.price || 397}
        oldPrice={detailsProduct.oldPrice || 516}
        features={detailsProduct.features || [detailsProduct.desc]}
        productKey={detailsProduct.key}
        productDesc={detailsProduct.desc}
      />
    )}
    </>
  );
}
