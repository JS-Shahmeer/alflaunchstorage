"use client";

import { useMemo } from 'react';
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  CreditCard,
  DownloadCloud,
  ExternalLink,
  Package,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardClientProps {
  user: any;
  profile: any;
  userProducts: any[];
  purchases: any[];
}

export default function DashboardClient({
  user,
  profile,
  userProducts,
  purchases,
}: DashboardClientProps) {

  const activeCourses = useMemo(
    () => userProducts.filter((item) => item.products.type === 'course'),
    [userProducts]
  );

  const activeBundles = useMemo(
    () => userProducts.filter((item) => item.products.type === 'bundle'),
    [userProducts]
  );

  const quickStats = [
    {
      label: 'Courses owned',
      value: activeCourses.length,
      icon: Package,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Bundles active',
      value: activeBundles.length,
      icon: Sparkles,
      color: 'bg-lime-100 text-lime-700',
    },
    {
      label: 'Purchases',
      value: purchases.length,
      icon: CreditCard,
      color: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'Resources',
      value: userProducts.length * 3,
      icon: DownloadCloud,
      color: 'bg-violet-100 text-violet-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f8f5] md:pt-24 pt-32 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-emerald-200 bg-linear-to-br from-[#ebf8f1] via-[#f7fff8] to-[#e9f5ec] p-8 shadow-[0_25px_80px_rgba(15,57,34,0.12)] overflow-hidden mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/10 px-4 py-2 text-sm font-semibold text-emerald-900">
                <User className="h-4 w-4" /> Customer Panel
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Customer's Own Command Center
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                Access your purchased courses, bundles, receipts, and secure resource downloads from one beautiful dashboard.
              </p>
            </div>

            {/* <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2"> */}
            <div className="flex items-center justify-center">
              {/* <Link href="/course" className="inline-flex items-center justify-center rounded-3xl bg-[#2F5D46] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#254A38]">
                Go to Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link> */}
              <Link href="/shop" className="inline-flex hover:shadow-md items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-300 hover:text-emerald-900 hover:bg-emerald-50">
                Browse More
              </Link>
              {/* <Link href="/dashboard" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
                Manage Access
              </Link> */}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,57,34,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,57,34,0.12)]">
                    <div className={`inline-flex items-center justify-center rounded-2xl p-3 ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">My Access</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Purchased Courses & Bundles</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900">
                  <ShieldCheck className="h-4 w-4" /> Verified entitlement only
                </div>
              </div>

              {userProducts.length === 0 ? (
                <div className="mt-10 rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Package className="mx-auto h-14 w-14 rounded-3xl bg-slate-900/5 p-3 text-slate-900" />
                  <h3 className="mt-6 text-xl font-semibold text-slate-950">No courses yet</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Buy a course and your secure downloads will appear here.
                  </p>
                  <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2F5D46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#254A38]">
                    Browse Courses
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {userProducts.map((userProduct) => (
                    <div key={userProduct.id} className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,57,34,0.08)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{userProduct.products.type}</p>
                          <h3 className="mt-3 text-xl font-semibold text-slate-950">{userProduct.products.name}</h3>
                          <p className="mt-2 text-sm text-slate-600">{userProduct.products.description}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-3 shadow-sm">
                          <Bookmark className="h-5 w-5 text-emerald-800" />
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-slate-600">
                        {userProduct.products.features?.slice(0, 3).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">{index + 1}</span>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        {userProduct.products.type === 'course' && (
                          <Link href="/course" className="inline-flex min-w-42.5 items-center justify-center gap-2 rounded-full bg-[#2F5D46] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#254A38]">
                            <ExternalLink className="h-4 w-4" />
                            Access Course
                          </Link>
                        )}
                        <button className="inline-flex min-w-42.5 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
                          <DownloadCloud className="h-4 w-4" />
                          Download Resources
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Purchase activity</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Recent Transactions</h2>
                </div>
                <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  View all orders
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-4 text-xs uppercase tracking-[0.22em] text-slate-400 sm:grid-cols-4">
                  <span>Order</span>
                  <span>Date</span>
                  <span>Total</span>
                  <span>Status</span>
                </div>
                <div className="space-y-3 px-5 pb-5 pt-2">
                  {purchases.slice(0, 4).map((purchase) => (
                    <div key={purchase.id} className="grid grid-cols-2 items-center gap-x-6 gap-y-3 rounded-3xl bg-white px-5 py-4 shadow-sm sm:grid-cols-4">
                      <div className="font-medium text-slate-900">#{purchase.id.slice(-8)}</div>
                      <div className="text-sm text-slate-600">{new Date(purchase.created_at).toLocaleDateString()}</div>
                      <div className="text-sm font-semibold text-slate-900">${purchase.amount?.toFixed(2)}</div>
                      <div className="inline-flex max-w-max items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{purchase.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Welcome</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">{profile?.first_name || user.email}</h2>
                </div>
                <div className="rounded-3xl bg-emerald-100 p-3 text-emerald-900">
                  <User className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="mt-1 break-all">{user.email}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Joined</p>
                  <p className="mt-1 text-slate-600">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Status</p>
                  <p className="mt-1 text-emerald-700">Active member</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Resources</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950">Instant access</h2>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Secure downloads</p>
                  <p className="mt-2 text-sm text-slate-600">Only your purchased course materials are visible here.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Resource page</p>
                  <p className="mt-2 text-sm text-slate-600">Quickly access files and support documents.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
