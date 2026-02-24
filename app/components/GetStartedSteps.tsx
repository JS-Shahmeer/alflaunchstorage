"use client";

import React, { useMemo, useState } from "react";
import GetStartedComponentOne from "./GetStartedComponentOne";
import GetStartedComponentTwo from "./GetStartedComponentTwo";
import GetStartedComponentThree from "./GetStartedComponentThree";
import { useSearchParams, useRouter } from "next/navigation";
import { programTypeIcons } from "./lucide-icons";
import { products } from "./products-data";
import { FileText, Award, Users } from "lucide-react";

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

export default function GetStartedSteps() {
  const searchParams = useSearchParams();
  const selectedState = searchParams.get("state") || null;
  const selectedType = searchParams.get("type") || null;
  const steps = ["Select State", "Program Type", "Choose Products", "Checkout"];
  const currentStep = selectedState && selectedType ? 3 : selectedState ? 2 : 1;

  // Program types data
  const programTypes = useMemo(
    () => [
      {
        key: "Group Home For Children",
        desc: "Licensed group home for children services",
      },
      {
        key: "Non-Medical Home Care Agency",
        desc: "Licensed non-medical home care agency services",
      },
      {
        key: "Adult Day Care Program",
        desc: "Licensed adult day care program services",
      },
      {
        key: "Adult Developmental Home",
        desc: "Licensed adult developmental home services",
      },
      {
        key: "Assisted Living Facility",
        desc: "Licensed assisted living facility services",
      },
      {
        key: "Child Care Facility",
        desc: "Licensed child care facility services",
      },
      {
        key: "Group Home For Developmental Disabilities",
        desc: "Licensed group home for developmental disabilities services",
      },
      {
        key: "Nursing Care Institution",
        desc: "Licensed nursing care institution services",
      },
      {
        key: "Home Health Agency",
        desc: "Licensed home health agency services",
      },
      {
        key: "Hospice Program",
        desc: "Licensed hospice program services",
      },
    ],
    [],
  );

  // Modal state must be declared at the top level
  const [bundleModalOpen, setBundleModalOpen] = useState(false);

  // Step 1: No state selected
  if (!selectedState) {
    return <GetStartedComponentOne steps={steps} currentStep={currentStep} />;
  }

  // Step 3: State and type selected
  if (selectedState && selectedType) {
    const bundleProducts = products.filter((p) => p.bundle && !p.bonus);
    const bonusProducts = products.filter((p) => p.bonus);
    const individualProducts = products.filter(
      (p) =>
        !p.bonus &&
        ![
          "Full 11-Module Operational Success Course",
          "Private Community Access",
        ].includes(p.key),
    );
    return (
      <GetStartedComponentThree
        steps={steps}
        currentStep={currentStep}
        selectedState={selectedState}
        selectedType={selectedType}
        stateNames={stateNames}
        programTypes={programTypes}
        bundleProducts={bundleProducts}
        bonusProducts={bonusProducts}
        individualProducts={individualProducts}
        bundleModalOpen={bundleModalOpen}
        setBundleModalOpen={setBundleModalOpen}
      />
    );
  }

  // Step 2: State selected, type not selected
  return (
    <GetStartedComponentTwo
      steps={steps}
      currentStep={currentStep}
      selectedState={selectedState}
      stateNames={stateNames}
      programTypes={programTypes}
      selectedType={selectedType}
    />
  );
}
