
import Stepper from "./Stepper";
import GetStartedMap from "./GetStartedMap";
import { useRouter } from "next/navigation";

export default function GetStartedComponentOne({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  const router = useRouter();
  return (
    <>
      <Stepper currentStep={currentStep} steps={steps} />
      <GetStartedMap />
      {/* Sticky bottom bar */}
      <div className="w-full sticky left-0 bottom-0 flex justify-center items-end z-40 bg-white border-t border-[#eaffea] py-4 shadow-sm">
        <div className="max-w-6xl w-full flex justify-between px-4">
          <button
            className="text-[#417a5a] font-semibold px-8 py-3 rounded-xl border border-[#eaffea] bg-white hover:bg-[#eaffea]"
            onClick={() => router.push("/")}
          >
            ← Back
          </button>
          <button
            className="bg-[#e6d7b0] text-[#417a5a] font-semibold px-8 py-3 rounded-xl shadow-sm"
            onClick={() => {
              // No state selected, so do nothing or scroll to map
              const map = document.getElementById("us-map-svg");
              if (map) map.scrollIntoView({ behavior: "smooth" });
            }}
            disabled
          >
            Continue →
          </button>
        </div>
      </div>
    </>
  );
}
