import test from 'node:test';
import assert from 'node:assert/strict';
import { getPostFormValues, buildPostFormPayload } from './postForm.js';
import { POSTS_DATA } from '../data/postsData.js';

test('pre-fills the supplied reference post without dropping its selections', () => {
  const post = POSTS_DATA.n8zXLc4RjgxncUntWUAPQ;
  const values = getPostFormValues(post);
  assert.equal(values.scopeOfWork, post.scopeOfWork);
  assert.equal(values.currency, 'USD');
  assert.equal(values.minBudget, '5555.00');
  assert.equal(values.maxBudget, '6666.00');
  assert.equal(values.isAsap, true);
  assert.equal(values.ports.length, 25);
  assert.equal(values.services.length, 12);
  values.ports.pop();
  assert.equal(post.ports.length, 25);
});

test('normalizes legacy currency, compact budgets, and dated requests', () => {
  const values = getPostFormValues({ budget: '₹500K - 600K', dateRange: 'Apr 10 - Apr 15', createdAt: '2026-01-01', isUrgent: true });
  assert.equal(values.currency, 'INR');
  assert.equal(values.minBudget, '500000');
  assert.equal(values.maxBudget, '600000');
  assert.equal(values.isAsap, false);
  assert.equal(values.serviceDates, '10/04/2026 - 15/04/2026');
});

test('round-trips all editable fields while retaining the existing post identity/status', () => {
  const post = { ...POSTS_DATA.n8zXLc4RjgxncUntWUAPQ, status: 'Awarded', ownerId: 'owner', viewsCount: 7, attachments: [{ name: 'existing.pdf', url: '/existing.pdf' }] };
  const values = { ...getPostFormValues(post), scopeOfWork: 'Updated scope\nSecond line', scopeHtml: '<p><strong>Updated scope</strong></p><p>Second line</p>', currency: 'EUR', minBudget: '100.50', maxBudget: '200', isAsap: false, serviceDates: '10/12/2026 - 15/12/2026', services: ['Freshwater Supply'], ports: ['Mumbai'] };
  const payload = buildPostFormPayload(values, { post });
  const updated = { ...post, ...payload };
  assert.equal(updated.id, post.id);
  assert.equal(updated.ownerId, 'owner');
  assert.equal(updated.viewsCount, 7);
  assert.equal(updated.status, 'Awarded');
  assert.equal(updated.title, 'Updated scope');
  assert.equal(updated.budget, '€100.5 - 200');
  assert.equal(updated.dateRange, values.serviceDates);
  assert.equal(updated.serviceDate, values.serviceDates);
  assert.equal(updated.isUrgent, false);
  assert.deepEqual(getPostFormValues(updated), values);
});

test('ASAP updates all date aliases and new drafts use the same payload builder', () => {
  const values = { ...getPostFormValues(), scopeOfWork: 'Draft scope', isAsap: true };
  const payload = buildPostFormPayload(values, { draft: true });
  assert.equal(payload.status, 'Draft');
  assert.equal(payload.dateRange, 'ASAP');
  assert.equal(payload.serviceDate, 'ASAP');
  assert.equal(payload.isUrgent, true);
  assert.deepEqual(payload.attachments, []);
});
