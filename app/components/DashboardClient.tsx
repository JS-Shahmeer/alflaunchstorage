"use client";

import { useState } from 'react';
import { User, Package, CreditCard, Download, ExternalLink } from 'lucide-react';
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
  purchases
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'purchases', label: 'Purchase History', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            Manage your account and access your purchased products.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Your Products</h2>
                {userProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">You haven't purchased any products yet.</p>
                    <Link
                      href="/shop"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userProducts.map((userProduct) => (
                      <div key={userProduct.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {userProduct.products.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {userProduct.products.description}
                            </p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {userProduct.products.features?.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          {userProduct.products.type === 'course' && (
                            <Link
                              href={`/course`}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              <ExternalLink size={14} />
                              Access Course
                            </Link>
                          )}
                          <button className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Purchase History</h2>
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                    <p className="text-gray-600">Your purchase history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order #{purchase.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(purchase.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${purchase.amount?.toFixed(2)}
                            </p>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {purchase.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {purchase.items?.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.name}</span>
                              <span className="text-gray-900">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.first_name || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.last_name || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.company || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}