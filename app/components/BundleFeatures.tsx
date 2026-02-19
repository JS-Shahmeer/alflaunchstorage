"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { BarChart3, ClipboardList, FileText, LineChart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
  title: string;
  subtitle: string;
  fileType: string;
  fileMeta: string;
  items?: string[];
  highlightBox?: boolean;
  icon: LucideIcon;
}

function FeatureCard({
  title,
  subtitle,
  fileType,
  fileMeta,
  items,
  highlightBox,
  icon: Icon,
}: CardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bundle-card bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="border-t-4 border-[#2F5D46]" />

      <div className="p-6">
        <div className="flex gap-4 items-start">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
            <Icon className="text-white" size={22} />
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500 italic mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="text-xs text-neutral-500 mt-4">
          {fileType} · {fileMeta}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="bg-[#F3F4F3] hover:bg-[#E6ECE8] rounded-md py-2 px-3 cursor-pointer flex items-center justify-between w-full mt-4 text-sm font-medium text-neutral-800"
        >
          <span>{open ? "Hide details" : "See what's inside"}</span>
          <ChevronDown
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            size={16}
          />
        </button>

        <div
          className={`grid transition-all duration-500 ${
            open
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {items && (
              <ul className="space-y-2 text-sm text-neutral-700">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-lime-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {highlightBox && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-neutral-700">
                <strong>Why it Matters</strong>
                <p className="mt-2">
                  This isn't a generic industry overview—it's state-specific,
                  program-specific intelligence with reimbursement rates and
                  regulatory citations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BundleFeatures() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".bundle-card");

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-neutral-100 md:py-12 py-6 md:px-0 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900">
            What's Included in the Bundle
          </h2>

          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            Each asset is crafted for your specific state and program type — no
            generic templates, no guesswork.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <FeatureCard
            title="Market Research Report"
            subtitle="Know your market before you invest a dollar."
            fileType="PDF"
            fileMeta="50–60 Pages"
            icon={BarChart3}
            items={[
              "Executive Summary with key indicators",
              "Licensed Facilities overview",
              "Startup feasibility analysis",
              "Financial 5-Year Forecast",
              "Market & Systems Landscape",
              "Strategic Recommendations",
            ]}
            highlightBox
          />

          <FeatureCard
            title="Licensing Documentation Checklist"
            subtitle="Never miss a requirement."
            fileType="Excel"
            fileMeta="15+ line items"
            icon={ClipboardList}
            items={[
              "Application Requirements",
              "Entity Registration",
              "Compliance Review",
              "Inspection Prep",
            ]}
          />

          <FeatureCard
            title="Submission-Ready Policy & Procedure Manual"
            subtitle="Policies regulators expect to see."
            fileType="Word Doc"
            fileMeta="Fully Editable"
            icon={FileText}
            items={[
              "HR Policies",
              "Clinical Procedures",
              "Risk Management Protocols",
            ]}
          />

          <FeatureCard
            title="Pro Forma Profit & Loss Template"
            subtitle="See your financial runway before launch."
            fileType="Excel"
            fileMeta="12-Month Projection"
            icon={LineChart}
            items={[
              "Revenue Forecast",
              "Expense Breakdown",
              "Cash Flow Projection",
            ]}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-neutral-600 mb-6">
            Ready to get started with your state-specific package?
          </p>

          <button className="bg-[#2F5D46] hover:bg-[#254A38] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300">
            View Packages
          </button>
        </div>
      </div>
    </section>
  );
}
