import {compactBudget} from './companyWorkflow.js';
export const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', AED: 'AED ', EUR: '€', GBP: '£' };

const formatDate = date => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
const todayRange = () => { const day = formatDate(new Date()); return `${day} - ${day}`; };

function normalizeDates(value, post) {
  if (!value) return todayRange();
  const dates = String(value).split(/\s+[–—-]\s+/);
  if (dates.length !== 2) return String(value);
  return dates.map(text => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return text;
    const hasYear = /\b\d{4}\b/.test(text);
    const year = post?.createdAt ? new Date(post.createdAt).getFullYear() : new Date().getFullYear();
    const date = new Date(hasYear ? text : `${text}, ${year}`);
    return Number.isNaN(date.getTime()) ? text : formatDate(date);
  }).join(' - ');
}

export function getPostFormValues(post) {
  if (!post) return { scopeOfWork: '', scopeHtml: '', currency: 'USD', minBudget: '', maxBudget: '', isAsap: false, serviceDates: todayRange(), services: [], ports: [], files: [] };
  const budget = String(post.budget || '');
  const currency = post.currency || Object.keys(CURRENCY_SYMBOLS).find(code => budget.includes(code) || budget.includes(CURRENCY_SYMBOLS[code].trim())) || 'USD';
  const amounts = [...budget.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*([km])?/gi)].map(match => String(Number(match[1].replaceAll(',', '')) * (match[2]?.toLowerCase() === 'k' ? 1000 : match[2]?.toLowerCase() === 'm' ? 1000000 : 1)));
  const dateValues = [post.dateRange, post.serviceDate, post.timeline, post.serviceDates].filter(Boolean);
  const isAsap = post.isAsap ?? (dateValues.length ? /^asap$/i.test(dateValues[0]) : Boolean(post.isUrgent || post.urgent));
  const dates = [post.serviceDates, ...dateValues].filter(Boolean).find(value => !/^asap$/i.test(value));
  return {
    scopeOfWork: post.scopeOfWork || post.description || post.details || post.title || '',
    scopeHtml: post.scopeHtml || '', currency,
    minBudget: String(post.minBudget ?? amounts[0] ?? ''),
    maxBudget: String(post.maxBudget ?? amounts[1] ?? ''),
    isAsap, serviceDates: normalizeDates(dates, post),
    services: [...(post.services || [])], ports: [...(post.ports || [])],
    files: [...(post.attachments || post.files || [])]
  };
}

export function buildPostFormPayload(values, { post, draft = false } = {}) {
  const content = values.scopeOfWork.trim();
  const files = values.files.map(file => typeof File !== 'undefined' && file instanceof File ? { name: file.name, size: file.size, type: file.type } : file);
  const dates = values.isAsap ? 'ASAP' : values.serviceDates;
  return {
    scopeOfWork: content || 'Draft requirement', description: content || 'Draft requirement', details: content || 'Draft requirement',
    scopeHtml: values.scopeHtml || '', title: content.split('\n')[0] || 'Draft Requirement',
    services: [...values.services], ports: [...values.ports],
    currency: values.currency, minBudget: values.minBudget, maxBudget: values.maxBudget,
    budget: compactBudget(values.minBudget,values.maxBudget,values.currency),
    serviceDates: values.serviceDates, dateRange: dates, serviceDate: dates, timeline: dates,
    isAsap: values.isAsap, urgent: values.isAsap, isUrgent: values.isAsap,
    files, attachments: files,
    status: draft ? 'Draft' : post?.status || 'Live'
  };
}

// Preserve editor formatting without importing arbitrary markup or attributes.
export function sanitizeScopeHtml(html) {
  const template = document.createElement('template'); template.innerHTML = html;
  const allowed = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'OL', 'UL', 'LI', 'H1', 'H2', 'H3', 'DIV']);
  for (const element of [...template.content.querySelectorAll('*')]) {
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(element.tagName)) { element.remove(); continue; }
    if (!allowed.has(element.tagName)) { element.replaceWith(...element.childNodes); continue; }
    for (const attribute of [...element.attributes]) element.removeAttribute(attribute.name);
  }
  return template.innerHTML;
}
