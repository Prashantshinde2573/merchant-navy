export const QUOTATIONS_DATA = {
  'quote-1': {
    id: 'quote-1',
    postId: 'my-post-1',
    merchantName: 'Indra Shipping Co.',
    avatar: '/images/profile_avatar.webp',
    rating: '5.00',
    reviewCount: '2 reviews',
    matchPercent: 58,
    portMatch: '4/25',
    serviceMatch: '12/12',
    price: '$566.00',
    validityDate: 'Jun 19, 2026',
    status: 'Awarded',
    isAwarded: true,
    statusColor: 'bg-[#0e793c] text-white',
    isRecommended: true,
    deliveryTime: 'Within 24-48 Hours',
    paymentTerms: 'Net 15 days from invoice',
    scopeSummary: 'Full ship chandlery provisions for 22 crew (vegetarian included), 150 MT fresh potable water certified to WHO standards, and MARPOL-compliant VLSFO bunker coordination.',
    certifications: ['VPT Port Authorised', 'ISO 9001:2015', 'MARPOL Annex VI Certified'],
    chatId: 'c-1'
  },
  'quote-2': {
    id: 'quote-2',
    postId: 'my-post-1',
    merchantName: 'Oceanic Marine Services Ltd.',
    avatar: '/images/profile_avatar.webp',
    rating: '4.85',
    reviewCount: '12 reviews',
    matchPercent: 88,
    portMatch: '20/25',
    serviceMatch: '11/12',
    price: '$520.00',
    validityDate: 'Jun 24, 2026',
    status: 'Awarded',
    isAwarded: true,
    statusColor: 'bg-[#0e793c] text-white',
    isRecommended: false,
    deliveryTime: '2-3 Days',
    paymentTerms: 'Net 30 days',
    scopeSummary: 'Comprehensive bunkering coordination and husbandry support with dedicated port liaison officer.',
    certifications: ['Port Authority Authorised', 'ISO 14001'],
    chatId: 'c-2'
  },
  'quote-3': {
    id: 'quote-3',
    postId: 'my-post-1',
    merchantName: 'Visakha Chandler & Bunkering Corp.',
    avatar: '/images/profile_avatar.webp',
    rating: '4.90',
    reviewCount: '9 reviews',
    matchPercent: 84,
    portMatch: '18/25',
    serviceMatch: '10/12',
    price: '$590.00',
    validityDate: 'Jun 22, 2026',
    status: 'Awarded',
    isAwarded: true,
    statusColor: 'bg-[#0e793c] text-white',
    isRecommended: false,
    deliveryTime: 'Within 48 Hours',
    paymentTerms: 'Net 15 days',
    scopeSummary: 'Potable water supply and deck & engine stores delivery directly alongside berth.',
    certifications: ['VPT Authorised Chandler'],
    chatId: 'c-3'
  },
  'quote-6': {
    id: 'quote-6',
    postId: 'my-post-2',
    merchantName: 'Visakhapatnam Harbor Supplies',
    avatar: '/images/profile_avatar.webp',
    rating: '4.95',
    reviewCount: '14 reviews',
    matchPercent: 92,
    portMatch: '22/25',
    serviceMatch: '10/12',
    price: '$5,200.00',
    validityDate: 'Jul 10, 2026',
    status: 'Awarded',
    isAwarded: true,
    statusColor: 'bg-[#0e793c] text-white',
    isRecommended: true,
    deliveryTime: 'Immediate',
    paymentTerms: 'Net 15 days',
    scopeSummary: 'Freshwater barge delivery and certified MARPOL garbage collection.',
    certifications: ['VPT Licensed'],
    chatId: 'c-1'
  },
  'quote-7': {
    id: 'quote-7',
    postId: 'my-post-2',
    merchantName: 'Coromandel Marine Logistics',
    avatar: '/images/profile_avatar.webp',
    rating: '4.75',
    reviewCount: '8 reviews',
    matchPercent: 80,
    portMatch: '18/25',
    serviceMatch: '9/12',
    price: '$5,450.00',
    validityDate: 'Jul 15, 2026',
    status: '',
    isAwarded: false,
    statusColor: '',
    isRecommended: false,
    deliveryTime: '2 Days',
    paymentTerms: 'Net 30 days',
    scopeSummary: 'Potable water supply and port husbandry support.',
    certifications: ['ISO 9001'],
    chatId: 'c-3'
  },
  'quote-8': {
    id: 'quote-8',
    postId: 'my-post-3',
    merchantName: 'Chennai Coastal Services',
    avatar: '/images/profile_avatar.webp',
    rating: '4.80',
    reviewCount: '6 reviews',
    matchPercent: 85,
    portMatch: '19/25',
    serviceMatch: '8/12',
    price: '$350.00',
    validityDate: 'Aug 01, 2026',
    status: 'Awarded',
    isAwarded: true,
    statusColor: 'bg-[#0e793c] text-white',
    isRecommended: true,
    deliveryTime: '1 Day',
    paymentTerms: 'Cash to Master / Net 7 days',
    scopeSummary: 'Canal transit agency documentation and cash delivery coordination.',
    certifications: ['Authorized Port Agent'],
    chatId: 'c-1'
  }
};

/**
 * Get all quotations for a given postId
 * Normalizes 'details' -> 'my-post-1'
 */
export function getQuotationsForPost(postId) {
  const normalizedId = !postId || postId === 'details' ? 'my-post-1' : postId;
  const quotes = Object.values(QUOTATIONS_DATA).filter((q) => q.postId === normalizedId);
  if (quotes && quotes.length > 0) {
    return quotes;
  }
  return Object.values(QUOTATIONS_DATA).filter((q) => q.postId === 'my-post-1');
}

/**
 * Get a specific quotation by ID
 */
export function getQuotationById(quotationId) {
  return QUOTATIONS_DATA[quotationId] || null;
}
