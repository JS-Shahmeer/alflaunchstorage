"use client";
import React from "react";
import { X, CheckCircle, Zap } from "lucide-react";

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  state: string;
  agencyType: string;
  price: number;
  oldPrice: number;
  features: string[];
}

export default function DetailsModal({
  open,
  onClose,
  state,
  agencyType,
  price,
  oldPrice,
  features,
}: DetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-colors">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        {/* State Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
            {state.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              MARKET RESEARCH REPORT
            </div>
            <div className="text-2xl font-bold text-black">{state}</div>
            <div className="text-xs text-gray-400">State Approved 2025</div>
          </div>
        </div>
        {/* Agency Type */}
        <div className="mb-4">
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
            {agencyType}
          </span>
        </div>
        <div className="h-56 overflow-auto">
          {/* Features List */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold text-black">What's Inside</span>
            </div>
            <ul className="space-y-3 bg-white rounded-lg p-2 border">
              {[
                "Executive Summary with key market indicators & financial opportunity analysis",
                "Complete service model breakdown with regulatory classifications & funding streams",
                "Full licensing roadmap with step-by-step application process & timelines",
                "Administrator & staff requirements with certifications & training details",
                "Reimbursement rates, billing requirements & revenue optimization strategies",
                "Referral pipeline development with relationship building protocols",
                "Facility and equipment requirements checklist",
                "Market trends, competitive landscape & strategic positioning",
                "Comprehensive startup cost analysis with financial projections",
                "Implementation timeline with phase-by-phase action steps",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-black">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* Built For Action Section */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Built For Action</span>
            </div>
            <div className="text-gray-100 text-sm mb-2">
              This isn't generic research—it's an{" "}
              <span className="text-green-300 font-bold">
                operational blueprint
              </span>{" "}
              built from current state regulations, real reimbursement data, and
              proven provider strategies. Every section includes specific agency
              contacts, form numbers, and direct source links so you can move
              from research to execution{" "}
              <span className="text-green-300 font-bold">immediately</span>.
            </div>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                50+ Pages
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                100+ Sources
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                PDF Format
              </span>
            </div>
          </div>
        </div>
        {/* Price & Add to Cart */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-black">${price}</span>
            <span className="text-gray-400 line-through text-lg">
              ${oldPrice}
            </span>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Save $119
            </span>
          </div>
          <button className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-900 transition mb-2">
            Add to Cart
          </button>
        </div>
        {/* Footer */}
        <div className="flex justify-center gap-4 text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-green-700">Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-700">Instant delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-700">Professional-grade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
