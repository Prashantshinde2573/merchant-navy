import test from 'node:test';
import assert from 'node:assert/strict';
import { extractBudget, extractRequirement, getMissingQuestions, parseAnswer } from './requirementAI.js';

const today = new Date(2026, 9, 26, 12);
const empty = { selectedServices: [], selectedPorts: [], scopeOfWork: '', currency: 'USD', minBudget: '', maxBudget: '', isAsap: false, serviceDates: '' };

test('a complete description skips all follow-up questions and preserves the scope', () => {
  const description = 'We need 150 MT of fresh water at Mumbai tomorrow, budget around ₹40,000.';
  const {data, identified} = extractRequirement(description, empty, today);
  assert.deepEqual(data.selectedServices, ['Fresh Water Supply']);
  assert.deepEqual(data.selectedPorts, ['Mumbai']);
  assert.equal(data.minBudget, '40000');
  assert.equal(data.currency, 'INR');
  assert.equal(data.serviceDates, '27/10/2026 - 27/10/2026');
  assert.equal(data.scopeOfWork, description);
  assert.deepEqual(getMissingQuestions(data, identified), []);
});

test('partial descriptions ask only for missing details, not vessel quantities', () => {
  const {data, identified} = extractRequirement('Fresh water, 150 MT for 22 crew at Mumbai.', empty, today);
  assert.equal(data.minBudget, '');
  assert.deepEqual(getMissingQuestions(data, identified), [3, 4]);
});

test('aliases, ASAP and explicitly open quotations need no repeated questions', () => {
  const {data, identified} = extractRequirement('Hull cleaning and propeller polishing at Vizag, ASAP. Open for quotations.', empty, today);
  assert.deepEqual(data.selectedServices, ['Underwater Hull Cleaning', 'Propeller Polishing']);
  assert.deepEqual(data.selectedPorts, ['Visakhapatnam (Vizag)']);
  assert.equal(data.isAsap, true);
  assert.deepEqual(getMissingQuestions(data, identified), []);
});

test('unfamiliar services and ports remain in the scope and prompt clarification', () => {
  const {data, identified} = extractRequirement('Need crane repairs at a private anchorage.', empty, today);
  assert.deepEqual(getMissingQuestions(data, identified), [0, 1, 3, 4]);
  assert.match(data.scopeOfWork, /crane repairs/);
});

test('money parsing supports Indian grouping, ranges and spoken units', () => {
  assert.deepEqual(extractBudget('₹1,50,000'), {currency:'INR', minBudget:'150000', maxBudget:'150000'});
  assert.deepEqual(extractBudget('5k - 8k AED'), {currency:'AED', minBudget:'5000', maxBudget:'8000'});
  assert.equal(extractBudget('INR 3.5 lakh to 5 lakh').maxBudget, '500000');
  assert.equal(extractBudget('₹3.5 – ₹5 lakh').minBudget, '350000');
  assert.equal(extractBudget('USD 5,000 - 8,000').minBudget, '5000');
  assert.equal(extractBudget('150 MT, 22 crew and 45000 DWT'), null);
  assert.equal(extractBudget('USD -500'), null);
});

test('invalid budget ranges require clarification instead of reusing an older budget', () => {
  const {data, identified} = extractRequirement('Budget INR 8000 - 5000', {...empty, minBudget:'100', maxBudget:'200'}, today);
  assert.ok(getMissingQuestions(data, identified).includes(4));
});

test('existing answers are preserved when the description does not replace them', () => {
  const {data, identified} = extractRequirement('Fresh water needed.', {...empty, selectedPorts:['Chennai'], isAsap:true, minBudget:'100', maxBudget:'200'}, today);
  assert.deepEqual(data.selectedPorts, ['Chennai']);
  assert.deepEqual(getMissingQuestions(data, identified), []);
});

test('relative dates cross month boundaries and vague weeks stay flexible', () => {
  assert.equal(extractRequirement('Fresh water tomorrow', empty, new Date(2026, 9, 31)).data.serviceDates, '01/11/2026 - 01/11/2026');
  assert.equal(extractRequirement('Fresh water next week', empty, today).data.serviceDates, 'Next week');
  assert.equal(extractRequirement('In 3 days', empty, today).data.serviceDates, '29/10/2026 - 29/10/2026');
  assert.ok(getMissingQuestions(extractRequirement('On 31/02/2026', empty, today).data).includes(3));
});

test('explicitly excluded options are not selected', () => {
  const {data} = extractRequirement('Fresh water at Mumbai, no bunkering. Not urgent.', empty, today);
  assert.deepEqual(data.selectedServices, ['Fresh Water Supply']);
  assert.equal(data.isAsap, false);
});

test('skipping missing optional fields resolves them and preserves other answers', () => {
  const data = {...empty, scopeOfWork:'Need vessel repairs'};
  assert.deepEqual(getMissingQuestions(data, ['services','ports','timeline','budget']), []);
  assert.deepEqual(parseAnswer('ports', 'Mumbai and private anchorage').selectedPorts, ['Mumbai','private anchorage']);
  assert.equal(parseAnswer('timeline', {isAsap:false, serviceDates:''}, {...empty, serviceDates:'old'}).serviceDates, '');
  assert.equal(parseAnswer('budget','5000 - 8000', {...empty, currency:'EUR'}).currency, 'EUR');
});

test('negated timing prompts a question rather than choosing an excluded date', () => {
  const {data, identified} = extractRequirement('Fresh water at Mumbai, not tomorrow.', empty, today);
  assert.ok(getMissingQuestions(data, identified).includes(3));
});
