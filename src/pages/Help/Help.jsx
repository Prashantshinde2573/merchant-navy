import React from 'react';
import './Help.css';

export function Help() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support & Help Center</h1>
        <p className="text-sm text-gray-500">
          Frequently asked questions and merchant support contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact card */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">contact_support</span>
            </span>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Direct Support</h3>
              <p className="text-xs text-gray-500">Reach out to our platform team</p>
            </div>
          </div>
          <div className="p-4 bg-blue-25 rounded-xl border border-blue-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Email:</span>
              <a href="mailto:admin@merchant.navy" className="font-semibold text-blue-700 hover:underline">
                admin@merchant.navy
              </a>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Availability:</span>
              <span className="font-semibold text-gray-800">24/7 Port Support</span>
            </div>
          </div>
        </div>

        {/* Quick Guide Card */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">help</span>
            </span>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">How It Works</h3>
              <p className="text-xs text-gray-500">Quick maritime operations workflow</p>
            </div>
          </div>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">1</span>
              <span>Post your port requirements & scope of work.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">2</span>
              <span>Receive competitive quotations from certified vendors.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">3</span>
              <span>Discuss via live chat and award the contract.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
