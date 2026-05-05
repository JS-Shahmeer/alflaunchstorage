"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Layers,
  LogOut,
  Package,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  User2Icon,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../components/AuthContext";
import Pagination from "../components/Pagination";
import AdminLoginClient from "./AdminLoginClient";
import BundleCard from "../components/BundleCard";
import type { BundleProduct, BundleFormPayload } from "@/lib/bundles";
import {
  createAdminBundle,
  deleteAdminBundle,
  fetchAdminBundle,
  fetchAdminBundles,
  updateAdminBundle,
} from "@/lib/bundles";
import { states, programCategories, statePrograms } from "@/app/data/shopData";

interface AdminStats {
  productsCount: number;
  coursesCount: number;
  bundlesCount: number;
  purchasesCount: number;
  usersCount: number;
  accessCount: number;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  is_admin?: boolean | null;
  created_at?: string | null;
}

export default function AdminPanelClient() {
  const router = useRouter();
  const { user, profile, isAdmin, loading, profileStatus, signOut, updateProfile } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "Overview" | "Bundles" | "Users" | "Profile Settings"
  >("Overview");
  const [bundles, setBundles] = useState<BundleProduct[]>([]);
  const [loadingBundles, setLoadingBundles] = useState(false);
  const [bundleFormOpen, setBundleFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<BundleProduct | null>(
    null,
  );
  const [bundleForm, setBundleForm] = useState({
    name: "",
    description: "",
    price: "",
    product_slug: "",
    status: "Active",
    quantity: 0,
    state: "",
    code: "",
    program: "",
    productLabel: "Complete Bundle",
    bestValue: false,
    tags: "",
    format: "PDF Format",
    download: true,
    flag: "",
    logo: "",
    year: 2025,
    features: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [bundleSearch, setBundleSearch] = useState("");
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    if (!loading && !user && !isSigningOut) {
      router.replace('/404');
    }

    if (!loading && user && profileStatus === 'success' && !isAdmin) {
      router.replace('/404');
    }
  }, [loading, user, profileStatus, isAdmin, isSigningOut, router]);

  // Mount effect - only set mounted flag once
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle loading timeout to prevent indefinite loading
  useEffect(() => {
    if (!loading) {
      setLoadingTimeout(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 8000); // Show timeout warning after 8 seconds

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Reset state when user logs out or auth state changes
  useEffect(() => {
    if (!isAdmin && mounted) {
      // Reset all loading states
      setLoadingStats(false);
      setLoadingBundles(false);
      setLoadingUsers(false);
      setStats(null);
      setBundles([]);
      setUsers([]);
      setError(null);
      setBundleFormOpen(false);
      setActiveSection("Overview");
    }
  }, [isAdmin, mounted]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    if (!mounted || !isAdmin) return;

    const timeoutId = setTimeout(() => {
      if (loadingStats) {
        setLoadingStats(false);
        setError("Failed to load admin stats. Please refresh the page.");
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeoutId);
  }, [loadingStats, mounted, isAdmin]);

  // Reset profile form when profile updates
  useEffect(() => {
    setProfileForm({
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
    });
  }, [profile]);

  const filteredBundles = bundles.filter((bundle) => {
    const query = bundleSearch.trim().toLowerCase();
    if (!query) return true;

    const searchable = [
      bundle.name,
      bundle.description,
      bundle.product_slug,
      bundle.product_label,
      bundle.metadata?.state,
      bundle.metadata?.code,
      bundle.metadata?.program,
      bundle.metadata?.productLabel,
      bundle.metadata?.tags?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filteredBundles.length / pageSize));
  const pagedBundles = filteredBundles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const selectedStateCode = states.find(
    (s) => s.name === bundleForm.state,
  )?.code;
  const availableProgramOptions =
    selectedStateCode && statePrograms[selectedStateCode]
      ? statePrograms[selectedStateCode]
      : programCategories;

  const handleLogout = async () => {
    setIsSigningOut(true);
    setLoadingStats(false);
    setLoadingBundles(false);
    setLoadingUsers(false);
    setStats(null);
    setBundles([]);
    setUsers([]);
    setError(null);
    setBundleFormOpen(false);
    setActiveSection("Overview");
    
    await signOut();
    router.push("/");
  };

  const refreshBundles = async () => {
    setLoadingBundles(true);
    try {
      const bundlesData = await fetchAdminBundles();
      setBundles(bundlesData);
    } catch (err: any) {
      setError(err?.message || "Unable to refresh bundles.");
    } finally {
      setLoadingBundles(false);
    }
  };

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/admin/profiles");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load user profiles.");
      }

      setUsers(data.users || []);
    } catch (err: any) {
      setError(err?.message || "Unable to load user profiles.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const openNewBundleForm = () => {
    setEditingBundle(null);
    setBundleForm({
      name: "",
      description: "",
      price: "",
      product_slug: "",
      status: "Active",
      quantity: 0,
      state: "",
      code: "",
      program: "",
      productLabel: "Complete Bundle",
      bestValue: false,
      tags: "",
      format: "PDF Format",
      download: true,
      flag: "",
      logo: "",
      year: 2025,
      features: "",
    });
    setBundleFormOpen(true);
    setActiveSection("Bundles");
  };

  const openEditBundleForm = (bundle: BundleProduct) => {
    setEditingBundle(bundle);
    setActiveSection("Bundles");

    setBundleForm({
      name: bundle.name || "",
      description: bundle.description || "",
      price: String(bundle.price ?? ""),
      product_slug: bundle.product_slug || "",
      status: bundle.metadata?.status || "Active",
      quantity: bundle.metadata?.quantity ?? 0,
      state: bundle.metadata?.state ?? bundle.state ?? "",
      code: bundle.metadata?.code ?? bundle.code ?? "",
      program: bundle.metadata?.program ?? bundle.program ?? "",
      productLabel:
        bundle.metadata?.productLabel ??
        bundle.product_label ??
        "Complete Bundle",
      bestValue: bundle.metadata?.bestValue ?? false,
      tags: (
        bundle.metadata?.tags || (Array.isArray(bundle.tags) ? bundle.tags : [])
      ).join(", "),
      format: bundle.metadata?.format || "PDF Format",
      download: bundle.metadata?.download ?? true,
      flag: bundle.metadata?.flag || "",
      logo: bundle.metadata?.logo || "",
      year: bundle.metadata?.year ?? 2025,
      features: (bundle.features || []).join(", "),
    });
    setBundleFormOpen(true);
  };

  const saveBundle = async () => {
    const trimmedName = bundleForm.name.trim();
    if (!trimmedName || bundleForm.price === "") {
      setError("Bundle name and price are required.");
      return;
    }

    const parsedTags = bundleForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      name: trimmedName,
      product_slug: bundleForm.product_slug || undefined,
      description: bundleForm.description,
      price: Number(bundleForm.price),
      state: bundleForm.state || undefined,
      code: bundleForm.code || undefined,
      program: bundleForm.program || undefined,
      product_label: bundleForm.productLabel || undefined,
      tags: parsedTags,
      metadata: {
        state: bundleForm.state,
        code: bundleForm.code,
        program: bundleForm.program,
        productLabel: bundleForm.productLabel,
        bestValue: bundleForm.bestValue,
        tags: parsedTags,
        format: bundleForm.format,
        download: bundleForm.download,
        flag: bundleForm.flag,
        logo: bundleForm.logo,
        year: Number(bundleForm.year) || 2025,
        status: bundleForm.status,
        quantity: Number(bundleForm.quantity),
      },
      features: bundleForm.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      is_active: true,
    };

    try {
      if (editingBundle) {
        await updateAdminBundle(editingBundle.id, payload);
      } else {
        await createAdminBundle(payload as BundleFormPayload);
      }
      setBundleFormOpen(false);
      setEditingBundle(null);
      await refreshBundles();
    } catch (err: any) {
      setError(err?.message || "Unable to save bundle.");
    }
  };

  const saveProfile = async () => {
    if (!updateProfile) {
      setError("Unable to update profile.");
      return;
    }

    setError(null);
    setSavingProfile(true);
    try {
      const { error } = await updateProfile({
        first_name: profileForm.first_name || null,
        last_name: profileForm.last_name || null,
      });
      if (error) {
        throw error;
      }
      Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your admin profile has been saved.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const deleteBundle = async (bundleId: string) => {
    const result = await Swal.fire({
      title: "Delete this bundle?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#14532d",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-[2rem] border border-emerald-100",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteAdminBundle(bundleId);
      await refreshBundles();
      await Swal.fire({
        title: "Deleted!",
        text: "The bundle was removed successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to delete bundle.");
    }
  };

  const previewBundle: BundleProduct = {
    id: editingBundle?.id || "preview",
    name: bundleForm.name || "Bundle preview",
    description:
      bundleForm.description ||
      "Preview your selected state, code, program, and tags before saving.",
    price: Number(bundleForm.price) || 0,
    type: "bundle",
    product_slug:
      bundleForm.product_slug || slugify(bundleForm.name || "preview-bundle"),
    features: bundleForm.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean),
    metadata: {
      status: bundleForm.status,
      quantity: Number(bundleForm.quantity) || 0,
      state: bundleForm.state,
      code: bundleForm.code,
      program: bundleForm.program,
      productLabel: bundleForm.productLabel,
      bestValue: bundleForm.bestValue,
      tags: bundleForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      format: bundleForm.format,
      download: bundleForm.download,
      flag: bundleForm.flag,
      logo: bundleForm.logo,
      year: Number(bundleForm.year) || 2025,
    },
  };

  useEffect(() => {
    if (!isAdmin || !mounted) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await fetch("/api/admin-stats");
        if (!response.ok) {
          throw new Error("Unable to load admin stats.");
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load admin stats.");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAdmin, mounted]);

  useEffect(() => {
    const fetchBundles = async () => {
      setLoadingBundles(true);
      try {
        const bundlesData = await fetchAdminBundles();
        setBundles(bundlesData);
      } catch (err: any) {
        setError(err?.message || "Unable to load bundles.");
      } finally {
        setLoadingBundles(false);
      }
    };

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch("/api/admin/profiles");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load user profiles.");
        }

        setUsers(data.users || []);
      } catch (err: any) {
        setError(err?.message || "Unable to load user profiles.");
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAdmin && mounted) {
      fetchBundles();
      loadUsers();
    }
  }, [isAdmin, mounted]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bundleSearch]);

  useEffect(() => {
    if (bundles.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    }
  }, [bundles.length, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center px-4 py-10">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-[0_30px_80px_rgba(15,57,34,0.12)] text-center max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-4">
              <div className="animate-spin">
                <RefreshCcw className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              Checking admin access...
            </p>
          </div>
          
          {loadingTimeout ? (
            <div className="space-y-4 hidden">
              <p className="text-sm text-slate-600">
                This is taking longer than expected. Your session may need to be refreshed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex-1 rounded-3xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <RefreshCcw className="w-4 h-4 inline mr-2" />
                  Reload Page
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Go Home
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Loading your admin dashboard...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user && profileStatus !== 'success') {
    return (
      <div className="min-h-screen bg-[#f5f8f6] flex items-center justify-center px-4 py-10">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,57,34,0.12)] text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 mb-3">
            <div className="animate-spin">
              <RefreshCcw className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-900">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] pt-28 pb-10">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Admin dashboard
            </p>
            <h1 className="text-lg font-semibold text-slate-950">
              Care Licensing Solutions
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full text-center md:text-sm border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              View storefront
            </Link>
            <span className="hidden md:text-sm rounded-full bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-800 sm:inline-flex">
              <User className="h-4 w-4 mr-2 inline" />
              Admin
              {/* : {user?.email} */}
            </span>
            <button
              type="button"
              onClick={() => setActiveSection("Profile Settings")}
              className="rounded-full md:text-sm border border-emerald-200 bg-white px-2.5 cursor-pointer py-2 text-xs font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 md:inline hidden"
            >
              <Settings className="h-4 w-4 inline" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-full md:text-sm bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-emerald-200 bg-linear-to-br from-[#eef8f2] via-[#f8fffb] to-[#eff7ee] p-8 shadow-[0_25px_80px_rgba(15,57,34,0.12)] mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/10 px-4 py-2 text-sm font-semibold text-emerald-900">
                <User2Icon className="h-4 w-4 inline" /> Admin Panel
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Admin Control Center
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                Manage bundles, access, and resources with a clean modern
                interface built to match your current theme.
              </p>
              {/* <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900 shadow-sm">Current section: {activeSection}</span>
              </div> */}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={openNewBundleForm}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-3xl bg-[#2F5D46] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#254A38]"
              >
                Create Bundles
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("Bundles")}
                className="cursor-pointer inline-flex items-center justify-center rounded-3xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Manage Bundles
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:order-first">
            <div className="sticky top-28 space-y-6 md:w-unset w-max">
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl md:w-full w-[90vw]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Admin sections
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {[
                    { label: "Overview", section: "Overview" },
                    { label: "Bundles", section: "Bundles" },
                    { label: "Users", section: "Users" },
                    { label: "Profile Settings", section: "Profile Settings" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveSection(item.section as any)}
                      className={`w-full cursor-pointer rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${activeSection === item.section ? "bg-emerald-900 text-white" : "bg-slate-50 text-slate-900 hover:bg-slate-100"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl md:w-full w-[90vw]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Admin stats
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      Live metrics
                    </h2>
                  </div>
                  <div className="rounded-3xl bg-emerald-100 p-3 text-emerald-900">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    { label: "Total users", value: stats?.usersCount ?? 0 },
                    {
                      label: "Completed purchases",
                      value: stats?.purchasesCount ?? 0,
                    },
                    { label: "Granted access", value: stats?.accessCount ?? 0 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <p className="text-sm font-medium text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin action</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">Need quick support?</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900">
                    <FileText className="h-4 w-4 inline" /> Documentation
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  The admin panel UI is ready to connect to resource uploads, user management, and course configuration flows.
                </p>
              </div> */}
            </div>
          </aside>

          <main className="space-y-6 xl:order-last">
            {activeSection === "Overview" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    {
                      label: "Total products",
                      value: stats?.productsCount ?? 0,
                      icon: Package,
                      accent: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      label: "Total users",
                      value: stats?.usersCount ?? 0,
                      icon: Users,
                      accent: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      label: "Completed purchases",
                      value: stats?.purchasesCount ?? 0,
                      icon: Sparkles,
                      accent: "bg-emerald-100 text-emerald-700",
                    },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className="rounded-[1.8rem] border border-white bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,57,34,0.08)]"
                      >
                        <div
                          className={`inline-flex items-center justify-center rounded-2xl p-3 ${metric.accent}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-950">
                          {metric.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl md:w-full w-[90vw]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Operations
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-950">
                        Admin access overview
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                      <ShieldCheck className="h-4 w-4 inline" /> Admin features
                      enabled
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {[
                      {
                        title: "Bundle Management",
                        description:
                          "Effortlessly create, update, and manage bundles directly from the dashboard.",
                        icon: Layers,
                      },
                      {
                        title: "User Registrations from Website",
                        description:
                          "Access and review user registrations along with their detailed profile information.",
                        icon: Users,
                      },
                      {
                        title: "Profile Management",
                        description:
                          "Manage and update your admin profile information and account preferences.",
                        icon: User2Icon,
                      },
                      {
                        title: "Access Control",
                        description:
                          "Control admin-level permissions and ensure the security of system settings.",
                        icon: ShieldCheck,
                      },
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.title}
                          className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-slate-300 hover:bg-white"
                        >
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white text-emerald-800 shadow-sm">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="mt-5 text-lg font-semibold text-slate-950">
                            {card.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {card.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeSection === "Bundles" && (
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl md:w-full w-[90vw]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Bundles
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-950">
                        Bundle management
                      </h2>
                      <p className="mt-2 text-slate-600">
                        Create, update, and delete bundle offerings directly
                        from the admin dashboard.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={openNewBundleForm}
                        className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        New bundle
                      </button>
                      <button
                        type="button"
                        onClick={refreshBundles}
                        className="cursor-pointer rounded-full border border-emerald-900 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        <RefreshCcw className="h-4 w-4 inline" /> Refresh list
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <label className="block text-sm font-semibold text-slate-700">
                          Search bundles
                        </label>
                        <p className="text-sm text-slate-500">
                          {bundleSearch
                            ? `Showing ${filteredBundles.length} matching bundles`
                            : `${bundles.length} bundles available`}
                        </p>
                      </div>
                      <input
                        value={bundleSearch}
                        onChange={(event) =>
                          setBundleSearch(event.target.value)
                        }
                        placeholder="Search by name, code, state, or tag"
                        className="mt-2 w-full min-w-0 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>

                {bundleFormOpen && (
                  <div
                    key={editingBundle?.id ?? "new-bundle"}
                    className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                          {editingBundle ? "Edit bundle" : "Create bundle"}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-950">
                          {editingBundle
                            ? "Update bundle details"
                            : "Add a new bundle"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBundleFormOpen(false)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Bundle name
                        <input
                          value={bundleForm.name}
                          onChange={(event) =>
                            setBundleForm({
                              ...bundleForm,
                              name: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          placeholder="Example: Texas Adult Day Care Complete Bundle"
                        />
                      </label>
                      <label className="block text-sm font-semibold text-slate-700">
                        Price
                        <input
                          value={bundleForm.price}
                          onChange={(event) =>
                            setBundleForm({
                              ...bundleForm,
                              price: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="1297"
                        />
                      </label>
                      <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                        Description
                        <textarea
                          value={bundleForm.description}
                          onChange={(event) =>
                            setBundleForm({
                              ...bundleForm,
                              description: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          rows={4}
                          placeholder="Short bundle description."
                        />
                      </label>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Product slug
                          <input
                            value={bundleForm.product_slug}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                product_slug: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="my-bundle-slug"
                          />
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Product label
                          <input
                            value={bundleForm.productLabel}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                productLabel: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="Complete Bundle"
                          />
                        </label>
                      </div>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          State
                          <select
                            value={bundleForm.state}
                            onChange={(event) => {
                              const selectedState = states.find(
                                (state) => state.name === event.target.value,
                              );
                              setBundleForm({
                                ...bundleForm,
                                state: event.target.value,
                                code: selectedState?.code || "",
                              });
                            }}
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="">Select a state</option>
                            {states.map((state) => (
                              <option key={state.code} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Code
                          <input
                            value={bundleForm.code}
                            readOnly
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none"
                            placeholder="AL"
                          />
                        </label>
                      </div>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Program
                          <select
                            value={bundleForm.program}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                program: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="">Select a program</option>
                            {availableProgramOptions.map((program) => (
                              <option key={program} value={program}>
                                {program}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Year
                          <input
                            value={bundleForm.year}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                year: Number(event.target.value),
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            type="number"
                            min="2020"
                            placeholder="2025"
                          />
                        </label>
                      </div>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Tags
                          <input
                            value={bundleForm.tags}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                tags: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="Alabama, Nursing Facilities (SNF)"
                          />
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Format
                          <input
                            value={bundleForm.format}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                format: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="PDF Format"
                          />
                        </label>
                      </div>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Logo URL
                          <input
                            value={bundleForm.logo}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                logo: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="/assets/images/logo-dark-bg.png"
                          />
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Flag URL
                          <input
                            value={bundleForm.flag}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                flag: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            placeholder="/assets/images/alabama-flag.png"
                          />
                        </label>
                      </div>
                      <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                        Features
                        <textarea
                          value={bundleForm.features}
                          onChange={(event) =>
                            setBundleForm({
                              ...bundleForm,
                              features: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          rows={3}
                          placeholder="Separate features with commas"
                        />
                      </label>
                      <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 items-end">
                        <label className="block text-sm font-semibold text-slate-700">
                          Status
                          <select
                            value={bundleForm.status}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                status: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                          >
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Inactive</option>
                          </select>
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">
                          Quantity
                          <input
                            value={bundleForm.quantity}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                quantity: Number(event.target.value),
                              })
                            }
                            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            type="number"
                            min="0"
                            step="1"
                          />
                        </label>
                      </div>
                      <div className="lg:col-span-2 flex flex-wrap gap-4 items-center">
                        <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={bundleForm.bestValue}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                bestValue: event.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                          />
                          Best value badge
                        </label>
                        <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={bundleForm.download}
                            onChange={(event) =>
                              setBundleForm({
                                ...bundleForm,
                                download: event.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                          />
                          Instant download available
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={saveBundle}
                        className="rounded-3xl cursor-pointer bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        {editingBundle ? "Save bundle" : "Create bundle"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBundleFormOpen(false)}
                        className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Live bundle preview
                          </p>
                          <p className="text-xs text-slate-500">
                            Confirm State, Code, Program, Tags, and pricing
                            before saving.
                          </p>
                        </div>
                      </div>
                      <BundleCard
                        bundle={previewBundle}
                        actionLabel="Preview"
                        variant="admin"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 text-sm text-slate-700">
                  <div className="space-y-4 md:px-5 px-2 pb-5 pt-2 overflow-x-auto">
                    {loadingBundles ? (
                      <div className="rounded-3xl bg-white px-4 py-6 text-center text-sm text-slate-600 shadow-sm">
                        Loading bundles...
                      </div>
                    ) : bundles.length === 0 ? (
                      <div className="rounded-3xl bg-white px-4 py-6 text-center text-sm text-slate-600 shadow-sm">
                        No bundles found. Create one to get started.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {pagedBundles.map((bundle) => (
                          <BundleCard
                            key={bundle.id}
                            bundle={bundle}
                            footerLabel={`Status: ${bundle.metadata?.status ?? "Active"} · Qty: ${bundle.metadata?.quantity ?? "—"}`}
                            onAction={() => openEditBundleForm(bundle)}
                            actionLabel="Edit Bundle"
                            variant="admin"
                            actions={
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditBundleForm(bundle)}
                                  className="cursor-pointer rounded-full border border-emerald-200 bg-white px-3 py-2 text-[11px] font-semibold text-emerald-900 transition hover:bg-emerald-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteBundle(bundle.id)}
                                  className="cursor-pointer rounded-full border border-rose-200 bg-white px-3 py-2 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-50"
                                >
                                  Delete
                                </button>
                              </>
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6"
                />
              </div>
            )}

            {activeSection === "Users" && (
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl md:w-full w-[90vw]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Users
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      User access
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={refreshUsers}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <RefreshCcw className="h-4 w-4 inline" /> Refresh list
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => setActiveSection("Users")}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Review access
                    </button> */}
                  </div>
                </div>
                <p className="mt-4 text-slate-600">
                  Review recent signups, manage permissions, and approve user
                  access to course materials.
                </p>

                <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  {loadingUsers ? (
                    <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
                      No users found yet. New signups will appear here.
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate-500">
                          <th className="py-3 pr-4">Name</th>
                          <th className="py-3 pr-4">Email</th>
                          <th className="py-3 pr-4">Role</th>
                          <th className="py-3 pr-4">Joined</th>
                          <th className="py-3 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {users.map((userProfile) => {
                          const fullName =
                            [userProfile.first_name, userProfile.last_name]
                              .filter(Boolean)
                              .join(" ") || "—";
                          const joinedAt = userProfile.created_at
                            ? new Date(
                                userProfile.created_at,
                              ).toLocaleDateString()
                            : "—";

                          return (
                            <tr
                              key={userProfile.id}
                              className="hover:bg-slate-50"
                            >
                              <td className="py-4 pr-4 font-semibold text-slate-900">
                                {fullName}
                              </td>
                              <td className="py-4 pr-4 text-slate-600">
                                {userProfile.email}
                              </td>
                              <td className="py-4 pr-4 text-slate-600">
                                {userProfile.is_admin
                                  ? "Administrator"
                                  : "Customer"}
                              </td>
                              <td className="py-4 pr-4 text-slate-600">
                                {joinedAt}
                              </td>
                              <td className="py-4 pr-4">
                                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                                  Active
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeSection === "Profile Settings" && (
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Profile Settings
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      Admin profile
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-500">
                      Admin user
                    </p>
                    <p className="mt-2 text-slate-950 font-semibold">
                      {user?.email}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-500">Role</p>
                    <p className="mt-2 text-slate-950 font-semibold">
                      Administrator
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Profile details
                    </p>
                    <div className="mt-6 grid gap-4">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          First name
                        </span>
                        <input
                          type="text"
                          value={profileForm.first_name}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              first_name: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                          placeholder="Enter first name"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Last name
                        </span>
                        <input
                          type="text"
                          value={profileForm.last_name}
                          onChange={(event) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              last_name: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                          placeholder="Enter last name"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={savingProfile}
                        className="mt-1 inline-flex items-center justify-center rounded-3xl bg-[#2F5D46] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#254A38] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingProfile ? "Saving..." : "Save profile"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-4xl border border-slate-200 bg-white p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Admin summary
                    </p>
                    <div className="mt-6 space-y-4">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-medium text-slate-500">
                          Admin user
                        </p>
                        <p className="mt-2 text-slate-950 font-semibold">
                          {user?.email}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-medium text-slate-500">
                          Role
                        </p>
                        <p className="mt-2 text-slate-950 font-semibold">
                          Administrator
                        </p>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        Update your name (if needed) as it appears across admin
                        sections and reports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
