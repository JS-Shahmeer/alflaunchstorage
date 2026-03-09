import React from "react";

interface GetStartedStickyBarProps {
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  children?: React.ReactNode;
}

export default function GetStartedStickyBar({
  onBack,
  onContinue,
  continueDisabled = false,
  children,
}: GetStartedStickyBarProps) {
  return (
    <div className="w-full sticky left-0 bottom-0 flex justify-center items-end z-40 bg-white border-t border-[#eaffea] py-4 shadow-sm">
      <div className="max-w-6xl w-full flex justify-between px-4">
        <button
          className="text-[#417a5a] font-semibold px-8 py-3 rounded-xl border border-[#eaffea] bg-white hover:bg-[#eaffea]"
          onClick={onBack}
        >
          ← Back
        </button>
        <button
          className="bg-[#e6d7b0] hover:bg-[#f1d99e] cursor-pointer text-[#417a5a] font-semibold px-8 py-3 rounded-xl shadow-sm"
          onClick={onContinue}
          disabled={continueDisabled}
        >
          Continue →
        </button>
      </div>
      {children && <div className="w-full mt-2">{children}</div>}
    </div>
  );
}
