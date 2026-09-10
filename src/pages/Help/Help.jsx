import React, { useState } from 'react';
import { SupportModal } from '../../components/SupportModal/SupportModal';
import './Help.css';

const FAQ_ITEMS = [
  {
    id: 'success-plan',
    question: 'How does the Success Plan work?',
    answer: 'You pay 2.5-5% only on jobs you successfully award through the platform. No monthly fees, perfect for businesses testing the waters.'
  },
  {
    id: 'refund-policy',
    question: "What's your refund policy?",
    answer: 'We offer a 14-day refund policy for unused platform credits. For dispute resolutions on awarded contracts, our arbitration team mediates based on the agreed terms.'
  },
  {
    id: 'verified-badge',
    question: 'How do I get a verified badge?',
    answer: 'Complete your merchant profile, upload valid business registration and port authority certificates. Our team verifies submissions within 24-48 business hours.'
  },
  {
    id: 'upgrade-downgrade',
    question: 'Can I upgrade or downgrade?',
    answer: 'Yes, you can adjust your subscription plan anytime from your account settings. Upgrades take effect immediately, while downgrades apply at the next billing cycle.'
  }
];

export function Help() {
  const [openItems, setOpenItems] = useState(['success-plan']);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitRequest = () => {
    setIsSupportModalOpen(true);
  };

  return (
    <div className="bg-blue-25 min-h-[calc(100vh-56px)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <div className="mb-6">
          <h1 className="text-content1-foreground font-['Inter'] text-2xl leading-8 font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="mt-1.5 font-['Inter'] text-base leading-6 font-normal text-zinc-500">
            Billing, verification, plans, and more.
          </p>
        </div>

        {/* FAQ Accordion Card */}
        <div
          className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none shadow-neutral-sm mb-8 border border-blue-50 bg-white"
          tabIndex="-1"
        >
          <div className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-6">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openItems.includes(item.id);
              return (
                <div key={item.id} className="border-b border-blue-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center justify-between py-4 text-left transition-all cursor-pointer"
                  >
                    <span className="text-modified-15-semibold text-content1-foreground pr-4 font-semibold text-[15px]">
                      {item.question}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-chevron-down text-content3-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="pb-4">
                      <p className="text-content3-foreground text-sm leading-5 font-normal text-zinc-600">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Help CTA Banner */}
        <div
          className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none bg-primary-900 border-none"
          tabIndex="-1"
        >
          <div className="relative flex w-full flex-auto place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased flex-row items-center justify-between gap-6 p-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-['Inter'] text-xl leading-7 font-bold text-white">
                Need help?
              </h2>
              <p className="font-['Inter'] text-sm leading-5 font-normal text-blue-100">
                Tell us what you need. We'll route it to the right team immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmitRequest}
              tabIndex="0"
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-6 min-w-24 h-12 text-medium gap-3 rounded-large transition-transform-colors-opacity motion-reduce:transition-none hover:opacity-90 text-primary-900 shrink-0 bg-white font-semibold text-sm"
            >
              Submit a Request
            </button>
          </div>
        </div>
      </div>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
