"use client";
import React from "react";
import {
  CheckCircle,
  Download,
  Lock,
  Phone,
  BookOpen,
  Mail,
  Calendar,
  CreditCard,
  Box,
  Clipboard,
  ChevronLeft,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPaymentConfirmation({
  orderNumber,
  customerEmail,
  items,
  downloads,
  onlineAccess,
  discount,
  tax,
  orderDate,
  paymentStatus = "Completed",
}: {
  orderNumber: string;
  customerEmail: string;
  items: { name: string; price: number }[];
  downloads: { name: string; type: string }[];
  onlineAccess?: { name: string; type: string }[];
  discount: number;
  tax: number;
  orderDate: string;
  paymentStatus?: string;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount + tax;

  // fallback generation for online access if not provided
  const accessList =
    onlineAccess && onlineAccess.length > 0
      ? onlineAccess
      : items.some((i) => i.name.toLowerCase().includes("bundle"))
        ? [
            { name: "Video Training Course", type: "Full Access" },
            { name: "Private Community Access", type: "Premium Access" },
          ]
        : [{ name: "Video Training Course", type: "Full Access" }];

  // Generate downloadable receipt
  const generateReceipt = () => {
    const receiptContent = `
ORDER CONFIRMATION RECEIPT
=========================
Order Number: ${orderNumber}
Customer Email: ${customerEmail}
Date: ${new Date(orderDate).toLocaleDateString()}
Payment Status: ${paymentStatus}

ITEMS:
${items.map((item) => `- ${item.name}: $${item.price.toFixed(2)}`).join("\n")}

PRICING:
Subtotal: $${subtotal.toFixed(2)}
${discount > 0 ? `Discount: -$${discount.toFixed(2)}\n` : ""}Tax (8%): $${tax.toFixed(2)}
---
TOTAL: $${total.toFixed(2)}

DOWNLOADS:
${downloads.map((d) => `- ${d.name} (${d.type})`).join("\n")}

ONLINE ACCESS:
${accessList.map((a) => `- ${a.name} (${a.type})`).join("\n")}

Thank you for your purchase!
    `;

    const element = document.createElement("a");
    const file = new Blob([receiptContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${orderNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-md w-full max-w-2xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-black">
          Thank You for Your Purchase!
        </h2>
        <p className="text-gray-600">
          Your order has been confirmed and your files are ready for download.
        </p>
      </div>

      {/* Order Number */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Clipboard size={20} className="text-green-800" />
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-lg text-black">{orderNumber}</p>
            </div>
          </div>
          <p className="text-sm text-green-700 flex items-center gap-1">
            <Mail size={14} />
            Confirmation sent to {customerEmail}
          </p>
        </div>
      </div>

      {/* Your Downloads */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Download size={20} className="text-green-800" />
          <h3 className="font-bold text-lg text-black">Your Downloads</h3>
        </div>
        <div className="space-y-3">
          {downloads.map((download, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-semibold text-black">{download.name}</p>
                <p className="text-xs text-gray-600">{download.type}</p>
              </div>
              <button className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                Download
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-600 mt-2">
            Download links have also been emailed to you for future access.
          </p>
        </div>
      </div>

      {/* Your Online Access */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={20} className="text-green-800" />
          <h3 className="font-bold text-lg text-black">Your Online Access</h3>
        </div>
        <div className="space-y-3">
          {accessList.map((access, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-semibold text-black">{access.name}</p>
                <p className="text-xs text-gray-600">{access.type}</p>
              </div>
              <button className="bg-green-800 hover:bg-green-900 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                Access Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What You Purchased */}
      <div className="mb-8">
        <h3 className="font-bold text-lg text-black mb-4">
          What You Purchased
        </h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-3 mb-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-start gap-2">
                  <CheckCircle size={24} className="text-green-600" />
                  <span className="text-black font-medium">{item.name}</span>
                </div>
                <span className="text-black font-bold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-black font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-700">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="text-black font-semibold">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-black font-bold text-lg">Total</span>
              <span className="text-black font-bold text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="mb-8">
        <h3 className="font-bold text-lg text-black mb-4">What's Next?</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center hover:shadow-lg transition">
            <BookOpen size={32} className="text-green-800 mx-auto mb-2" />
            <p className="font-semibold text-black text-sm">Learn How to Use</p>
            <p className="text-xs text-gray-600">Access our guides</p>
          </div>
          <div className="border rounded-lg p-4 text-center hover:shadow-lg transition">
            <Phone size={32} className="text-green-800 mx-auto mb-2" />
            <p className="font-semibold text-black text-sm">Get Help</p>
            <p className="text-xs text-gray-600">Contact support</p>
          </div>
          <div className="border rounded-lg p-4 text-center hover:shadow-lg transition">
            <Search size={32} className="text-green-800 mx-auto mb-2" />
            <p className="font-semibold text-black text-sm">Explore More</p>
            <p className="text-xs text-gray-600">Expand resources</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-bold text-black mb-4">Order Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-gray-600" />
            <div>
              <p className="text-gray-600">Date</p>
              <p className="text-black font-semibold">
                {new Date(orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Mail size={16} className="text-gray-600" />
            <div>
              <p className="text-gray-600">Customer</p>
              <p className="text-black font-semibold">{customerEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard size={16} className="text-gray-600" />
            <div>
              <p className="text-gray-600">Payment Status</p>
              <p className="text-green-700 font-semibold">{paymentStatus}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Box size={16} className="text-gray-600" />
            <div>
              <p className="text-gray-600">Items</p>
              <p className="text-black font-semibold">
                {items.length} product(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={generateReceipt}
          className="w-full border-2 border-green-800 text-green-800 cursor-pointer font-semibold py-3 rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download Receipt
        </button>
        <a
          href="/"
          className="text-center text-green-800 font-semibold hover:text-green-900 text-sm"
        >
          <ChevronLeft size={16} className="inline mr-1" />
          Back to Home
        </a>
      </div>
    </div>
  );
}
