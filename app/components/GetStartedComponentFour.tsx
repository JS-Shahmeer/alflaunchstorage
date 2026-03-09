import React from "react";
import Stepper from "./Stepper";
import { useRouter } from "next/navigation";
import GetStartedSidebar from "./GetStartedSidebar";
import GetStartedStickyBar from "./GetStartedStickyBar";

export default function GetStartedComponentFour({
  steps,
  selectedState,
  selectedType,
  stateNames,
}: {
  steps: string[];
  selectedState: string;
  selectedType: string;
  stateNames: { [abbr: string]: string };
}) {
  const router = useRouter();
  return (
    <>
      <Stepper currentStep={4} steps={steps} />
      <section className="flex flex-col items-center justify-center py-8 pb-32">
        <div className="w-full max-w-6xl flex gap-8">
          {/* Sidebar (filter selection bar) */}
          <GetStartedSidebar
            stateNames={stateNames}
            selectedState={selectedState}
            selectedType={selectedType}
            programTypes={[]}
            disableState={true}
            disableType={true}
          />
          {/* Main summary */}
          <main className="flex-1">
            <div className="bg-white rounded-xl border border-[#eaffea] p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-black">
                Order Summary
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-[#eaffea] text-[#417a5a] font-semibold px-3 py-1 rounded-full">
                  {stateNames[selectedState]}
                </span>
                <span className="bg-[#eaffea] text-[#417a5a] font-semibold px-3 py-1 rounded-full">
                  {selectedType}
                </span>
              </div>
              <div className="mb-2 text-gray-700">
                Licensing package for {selectedType} in{" "}
                {stateNames[selectedState]}
              </div>
              <div className="mb-2 text-gray-700 font-semibold">
                Complete Licensing Bundle
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-3 py-2 flex-1 text-black"
                    placeholder="Enter code"
                  />
                  <button className="bg-[#eaffea] text-[#417a5a] font-semibold px-4 py-2 rounded">
                    Apply
                  </button>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold text-gray-700">$997</span>
              </div>
              <div className="flex justify-between text-lg font-bold mb-4">
                <span className="text-gray-700">Total</span>
                <span className="text-gray-700">$997</span>
              </div>
              <div className="text-xs text-gray-700 text-center mt-6">
                All sales are final. This product is an informational resource
                and does not constitute legal, financial, or professional
                compliance advice.
              </div>
              <GetStartedStickyBar
                onBack={() => router.back()}
                onContinue={() => router.push("/checkout")}
                continueDisabled={false}
              />
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
