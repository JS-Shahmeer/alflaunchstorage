"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./SimpleToast";

export default function CustomerHeader() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const toast = useToast();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      const { error } = await signOut();
      if (error) {
        throw error;
      }
      toast.show("Signed out successfully");
      router.push("/");
    } catch (err: any) {
      toast.show(err?.message || "Unable to sign out");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Customer dashboard
          </p>
          <h1 className="text-lg font-semibold text-slate-950">
            Care Licensing Solutions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            View storefront
          </Link>
          <span className="hidden items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800 md:inline-flex">
            <User className="h-4 w-4" />
            {profile?.first_name || user?.email}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-full cursor-pointer bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-50 border hover:border-emerald-400 hover:shadow-md border-emerald-900 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut className="h-4 w-4 inline mr-2" />
            {signingOut ? "Signing out" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
