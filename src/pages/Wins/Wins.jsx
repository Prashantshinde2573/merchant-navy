import React from 'react';
import { Link } from 'react-router-dom';
import './Wins.css';

const WINS_DATA = [
  {
    id: 'win-1',
    title: 'Multiple port services required for MV Indravati (45,000 DWT bulk carrier) arriving Visakhapatnam.',
    awardedTo: 'Indra Shipping Co.',
    date: 'Apr 28, 2026',
    amount: '$566.00',
    port: 'Visakhapatnam',
    status: 'Awarded'
  }
];

export function Wins() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Wins & Awards</h1>
        <p className="text-sm text-gray-500">
          Track your awarded bids, contracts, and successful collaborations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50/80 border-b border-gray-100 hidden md:grid md:grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Project / Request</div>
          <div className="col-span-3">Merchant / Winner</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-gray-100">
          {WINS_DATA.map((win) => (
            <div
              key={win.id}
              className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-blue-50/20 transition"
            >
              <div className="col-span-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    {win.status}
                  </span>
                  <span className="text-xs text-gray-400">{win.date}</span>
                </div>
                <h4 className="font-semibold text-xs text-gray-900 leading-snug">{win.title}</h4>
                <span className="text-[11px] text-gray-500">Port: {win.port}</span>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                  I
                </span>
                <div>
                  <h5 className="font-semibold text-xs text-gray-900">{win.awardedTo}</h5>
                  <span className="text-[10px] text-amber-500 font-bold">★ 5.00</span>
                </div>
              </div>

              <div className="col-span-2 font-bold text-sm text-gray-900">
                {win.amount}
              </div>

              <div className="col-span-2 text-right">
                <Link
                  to="/chats"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow-xs inline-block"
                >
                  Open Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
