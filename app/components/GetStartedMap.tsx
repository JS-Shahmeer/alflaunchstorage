"use client";

import React, { useState } from "react";
import USAMap from "./USAMap";
import { useRouter } from "next/navigation";

const stateNames: { [abbr: string]: string } = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

export default function GetStartedMap() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateSelect = (abbr: string) => {
    if (abbr && stateNames[abbr]) {
      router.push(`/get-started?state=${abbr}`);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-[#b6ff7a] mx-auto p-8 flex flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block bg-[#b6ff7a] text-[#417a5a] font-semibold text-sm px-4 py-1 rounded-full">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#417a5a" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="#b6ff7a"
                stroke="#417a5a"
                strokeWidth="2"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold text-[#417a5a]">
            Step 1: Select your state
          </span>
        </div>
        <div className="bg-[#eaffea] rounded-xl p-3 flex items-center justify-center w-full">
          <div className="w-full flex items-center justify-center relative">
            <USAMap
              selectedState={selectedState || undefined}
              onSelectState={handleStateSelect}
            />
          </div>
        </div>
        <div className="mt-6 text-center text-[#417a5a] text-sm">
          <span>Please select your state to continue</span>
        </div>
      </div>
    </section>
  );
}
