"use client";
import { ChevronLeft, Loader } from "lucide-react";
import React from "react";

export default function CheckoutCustomerInfo({ form, handleChange, handleContinue, loading, errors }: {
  form: {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinue: () => void;
  loading: boolean;
  errors: { [key: string]: string };
}) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-black">Customer Information</h2>
      <form>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-600">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 text-gray-600 ${errors.email ? 'border-red-500' : 'border-[#cecece]'}`}
            placeholder="you@example.com"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-gray-600">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 text-gray-600 ${errors.firstName ? 'border-red-500' : 'border-[#cecece]'}`}
              placeholder="John"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-gray-600">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 text-gray-600 ${errors.lastName ? 'border-red-500' : 'border-[#cecece]'}`}
              placeholder="Doe"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-600">Company / Organization (Optional)</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-gray-600 border-[#cecece]"
            placeholder="Your Company"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1 text-gray-600">Phone Number (Optional)</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-gray-600 border-[#cecece]"
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-green-700 font-semibold cursor-pointer hover:text-green-900"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="inline mr-1" size={16} />
            Back to Cart
          </button>
          <button
            type="button"
            className={`bg-green-800 hover:bg-green-900 cursor-pointer text-white font-semibold py-3 rounded-lg px-8 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleContinue}
            disabled={loading}
          >
            {loading && <Loader className="animate-spin" size={16} />}
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
