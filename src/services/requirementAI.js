/**
 * Requirement AI Service
 * 
 * Manages the guided conversational question-by-question form filling logic
 * strictly mapped to the existing "Post Your Requirement" fields.
 */

export const REQUIREMENT_QUESTIONS = [
  {
    id: "services",
    field: "selectedServices",
    title: "Service Required",
    question: "What service do you need from the merchant? Please select or describe the work you want to arrange.",
    type: "multi-select",
    required: false,
    options: [
      "Ship Chandlering",
      "Bunker Supply",
      "Fresh Water Supply",
      "Underwater Hull Cleaning",
      "Propeller Polishing",
      "Waste Disposal",
      "Crew Transfer",
      "Canal Transit Agency Support",
      "Cash to Master (CTM) Coordination",
      "Compressed Air Utility",
      "Sea Chest Grating Inspection",
      "Zinc Anode Inspection"
    ],
    placeholder: "Type a service or pick from the options above...",
    helperText: "You can select one or multiple services from the options, or type your custom requirement."
  },
  {
    id: "ports",
    field: "selectedPorts",
    title: "Port / Location",
    question: "Which port or ports does this requirement apply to?",
    type: "multi-select",
    required: false,
    options: [
      "Chennai",
      "Mumbai",
      "Visakhapatnam (Vizag)",
      "Cochin",
      "Kolkata",
      "Jawaharlal Nehru Port (JNPT)",
      "Kandla",
      "Paradip",
      "Tuticorin",
      "Mormugao",
      "Mangalore",
      "Dubai (UAE)",
      "Singapore",
      "Rotterdam",
      "Fujairah"
    ],
    placeholder: "Type a port name or pick from the options above...",
    helperText: "Select one or more applicable ports, or type the specific port/anchorage."
  },
  {
    id: "scopeOfWork",
    field: "scopeOfWork",
    title: "Scope of Work",
    question: "Please describe the work details and specific job requirements for the merchant.",
    placeholder: "e.g., Vessel arriving next week. Need provisions, fresh water, and bunkering coordination at outer anchorage...",
    type: "textarea",
    required: true,
    helperText: "Share the key details. The first 2 lines will be displayed on the post summary."
  },
  {
    id: "timeline",
    field: "timeline",
    title: "Timeline & Urgency",
    question: "When is this service needed? Is this an urgent (ASAP) requirement?",
    type: "timing",
    required: false,
    helperText: "Choose ASAP for urgent delivery or specify the required service date window."
  },
  {
    id: "budget",
    field: "budget",
    title: "Budget Range",
    question: "What is your estimated budget range and preferred currency for this work?",
    type: "budget",
    required: false,
    currencies: ["USD", "INR", "AED", "EUR", "GBP"],
    helperText: "Specify MIN and MAX amounts (e.g. 4000 - 4500 USD), or skip if open to quotations."
  }
];

// Preserve custom entries alongside recognized choices rather than silently dropping them.
function matchOptions(questionId, input) {
  const options = REQUIREMENT_QUESTIONS.find(question => question.id === questionId).options;
  return [...new Set(input.split(/[,;\n]+|\s+and\s+/i).map(part => {
    const value = part.trim();
    const normalized = value.toLowerCase();
    const match = options.find(option => option.toLowerCase() === normalized ||
      option.toLowerCase().replace(/\s*\(.*?\)/, "") === normalized ||
      (normalized.length > 2 && option.toLowerCase().includes(normalized)));
    return match || value;
  }).filter(Boolean))];
}

/**
 * Intelligent parser to map user natural language answers to structured form fields
 */
export function parseAnswer(questionId, userInput, currentAnswers = {}) {
  const updated = { ...currentAnswers };
  const inputStr = typeof userInput === "string" ? userInput.trim() : "";

  switch (questionId) {
    case "scopeOfWork":
      updated.scopeOfWork = inputStr;
      break;

    case "services":
      if (Array.isArray(userInput)) {
        updated.selectedServices = userInput;
      } else if (inputStr) {
        updated.selectedServices = matchOptions("services", inputStr);
      }
      break;

    case "ports":
      if (Array.isArray(userInput)) {
        updated.selectedPorts = userInput;
      } else if (inputStr) {
        updated.selectedPorts = matchOptions("ports", inputStr);
      }
      break;

    case "budget":
      if (typeof userInput === "object" && userInput !== null) {
        if (userInput.currency) updated.currency = userInput.currency;
        if (userInput.minBudget !== undefined) updated.minBudget = userInput.minBudget;
        if (userInput.maxBudget !== undefined) updated.maxBudget = userInput.maxBudget;
      } else if (inputStr) {
        const budget = extractBudget(inputStr, currentAnswers.currency || "USD", false);
        if (budget) Object.assign(updated, budget);
      }
      break;

    case "timeline":
      if (typeof userInput === "object" && userInput !== null) {
        if (userInput.isAsap !== undefined) updated.isAsap = userInput.isAsap;
        if (userInput.serviceDates !== undefined) updated.serviceDates = userInput.serviceDates;
      } else if (inputStr) {
        const extracted = extractRequirement(inputStr, currentAnswers);
        if (extracted.identified.includes("timeline")) {
          updated.isAsap = extracted.data.isAsap;
          updated.serviceDates = extracted.data.serviceDates;
        } else {
          updated.isAsap = false;
          updated.serviceDates = inputStr;
        }
      }
      break;

    default:
      break;
  }

  return updated;
}

const SERVICE_ALIASES = [
  /\b(?:ship chandler(?:ing)?|provisions?|ship stores)\b/i,
  /\b(?:bunker(?:ing| supply)?|vlsfo|mgo|marine gas oil)\b/i,
  /\b(?:fresh\s*water|potable water)\b/i,
  /\b(?:underwater hull cleaning|hull cleaning)\b/i,
  /\bpropeller polishing\b/i,
  /\b(?:waste disposal|sludge removal|garbage collection)\b/i,
  /\b(?:crew transfer|crew change)\b/i,
  /\b(?:canal transit|canal agency)\b/i,
  /\b(?:cash to master|ctm)\b/i,
  /\bcompressed air\b/i,
  /\bsea chest(?: grating)? inspection\b/i,
  /\bzinc anode inspection\b/i
];

const PORT_ALIASES = [
  /\bchennai\b/i, /\bmumbai\b/i, /\b(?:visakhapatnam|vizag)\b/i,
  /\b(?:cochin|kochi)\b/i, /\bkolkata\b/i, /\b(?:jnpt|jawaharlal nehru)\b/i,
  /\bkandla\b/i, /\bparadip\b/i, /\b(?:tuticorin|thoothukudi)\b/i,
  /\bmormugao\b/i, /\b(?:mangalore|mangaluru)\b/i, /\bdubai\b/i,
  /\bsingapore\b/i, /\brotterdam\b/i, /\bfujairah\b/i
];

const MONEY_AMOUNT = String.raw`\d+(?:,\d{2,3})*(?:\.\d+)?(?:\s*(?:thousand|million|crore|lakhs?|[km])\b)?`;
const MONEY_CURRENCY = String.raw`(?:USD|INR|AED|EUR|GBP|rupees?|dollars?|dirhams?|euros?|pounds?|[$₹€£])`;
const MONEY_RANGE = `${MONEY_AMOUNT}(?:\\s*(?:-|–|—|to)\\s*(?:${MONEY_CURRENCY}\\s*)?${MONEY_AMOUNT})?`;

function amountValue(value) {
  const number = Number(value.replace(/,/g, "").match(/\d+(?:\.\d+)?/)[0]);
  const multiplier = /crore/i.test(value) ? 10000000 : /lakh/i.test(value) ? 100000
    : /million|m\b/i.test(value) ? 1000000 : /thousand|k\b/i.test(value) ? 1000 : 1;
  return String(number * multiplier);
}

// Match monetary phrases only: vessel tonnage, dates and crew counts are not budgets.
export function extractBudget(text, defaultCurrency = "USD", requireContext = true) {
  const candidate = /\bbudget\b[^;\n]*/i.exec(text)?.[0] || text;
  const prefix = new RegExp(`${MONEY_CURRENCY}\\s*(${MONEY_RANGE})`, "i").exec(candidate);
  const suffix = new RegExp(`(${MONEY_RANGE})\\s*${MONEY_CURRENCY}`, "i").exec(candidate);
  const explicitBudget = new RegExp(`\\bbudget(?:\\s+(?:is|of|around|about|approximately))?\\s*[:=]?\\s*(${MONEY_RANGE})`, "i").exec(candidate);
  const bare = !requireContext && new RegExp(`^\\s*(${MONEY_RANGE})\\s*$`, "i").exec(candidate);
  const match = prefix || suffix || explicitBudget || bare;
  if (!match || new RegExp(`^(?:budget\\s*(?:(?:is|of|around|about)\\s*)?[:=]?\\s*)?(?:${MONEY_CURRENCY}\\s*)?-\\s*\\d`, "i").test(candidate.trim())) return null;
  const values = match[1].match(new RegExp(MONEY_AMOUNT, "gi")) || [];
  if (!values.length) return null;
  let currency = defaultCurrency;
  const currencyText = match[0];
  if (/₹|\b(?:inr|rupees?)\b/i.test(currencyText)) currency = "INR";
  else if (/€|\b(?:eur|euros?)\b/i.test(currencyText)) currency = "EUR";
  else if (/£|\b(?:gbp|pounds?)\b/i.test(currencyText)) currency = "GBP";
  else if (/\b(?:aed|dirhams?)\b/i.test(currencyText)) currency = "AED";
  else if (/\$|\b(?:usd|dollars?)\b/i.test(currencyText)) currency = "USD";
  const sharedUnit = values[1]?.match(/thousand|million|crore|lakhs?|[km]\b/i)?.[0];
  const first = sharedUnit && !/[a-z]/i.test(values[0]) &&
    Number(values[0].replace(/,/g, "")) <= Number(values[1].replace(/,/g, "").match(/\d+(?:\.\d+)?/)[0])
    ? `${values[0]} ${sharedUnit}` : values[0];
  return { currency, minBudget: amountValue(first), maxBudget: amountValue(values[1] || values[0]) };
}

function positiveMatch(text, pattern) {
  // Avoid treating explicitly excluded services or locations as requested ones.
  return text.split(/[.;\n]/).some(clause => {
    const match = pattern.exec(clause);
    return match && !/\b(?:no|not|without|except|excluding)\s+(?:(?:any|an?|the|need(?:ed)?|require(?:d)?)\s+)*$/i.test(clause.slice(0, match.index));
  });
}

export function extractRequirement(description, currentAnswers = {}, now = new Date()) {
  const text = description.trim();
  const data = { ...currentAnswers, scopeOfWork: text };
  const identified = text ? ["scopeOfWork"] : [];
  const services = REQUIREMENT_QUESTIONS[0].options.filter((_, index) => positiveMatch(text, SERVICE_ALIASES[index]));
  const ports = REQUIREMENT_QUESTIONS[1].options.filter((_, index) => positiveMatch(text, PORT_ALIASES[index]));
  if (services.length) { data.selectedServices = services; identified.push("services"); }
  if (ports.length) { data.selectedPorts = ports; identified.push("ports"); }

  const budget = extractBudget(text, currentAnswers.currency || "USD");
  if (budget && Number(budget.minBudget) <= Number(budget.maxBudget)) {
    Object.assign(data, budget);
    identified.push("budget");
  } else if (budget) {
    // A contradictory range needs clarification, even if the manual form had a budget.
    Object.assign(data, { minBudget: "", maxBudget: "" });
  } else if (/\b(?:open (?:for|to) (?:quotes|quotations)|no (?:fixed )?budget|budget (?:is )?(?:flexible|not specified))\b/i.test(text)) {
    Object.assign(data, { minBudget: "", maxBudget: "" });
    identified.push("budget");
  }

  const urgent = /\b(?:asap|urgent(?:ly)?|immediate(?:ly)?)\b/i;
  const relative = /\b(day after tomorrow|tomorrow|today|next week|in \d+ days?)\b/i.exec(text);
  const months = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
  const expandedDates = text
    .replace(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:to|[-–])\\s*(\\d{1,2})(?:st|nd|rd|th)?\\s+(${months})\\s+(\\d{4})\\b`, 'gi'), '$1 $3 $4 to $2 $3 $4')
    .replace(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${months})\\s*,?\\s*(\\d{4})\\b`, 'gi'), (_,day,month,year)=>`${day}/${new Date(`${month} 1 2000`).getMonth()+1}/${year}`)
    .replace(new RegExp(`\\b(${months})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s*,?\\s*(\\d{4})\\b`, 'gi'), (_,month,day,year)=>`${day}/${new Date(`${month} 1 2000`).getMonth()+1}/${year}`)
    .replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g,'$3/$2/$1');
  const explicitDates = expandedDates.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g);
  if (positiveMatch(text, urgent)) {
    Object.assign(data, { isAsap: true, serviceDates: "" });
    identified.push("timeline");
  } else if (relative && positiveMatch(text, /\b(day after tomorrow|tomorrow|today|next week|in \d+ days?)\b/i)) {
    const days = /^in /i.test(relative[0]) ? Number(relative[0].match(/\d+/)[0])
      : ({ today: 0, tomorrow: 1, "day after tomorrow": 2, "next week": 7 })[relative[0].toLowerCase()];
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    const formatted = date.toLocaleDateString("en-GB");
    Object.assign(data, { isAsap: false, serviceDates: /^next week$/i.test(relative[0]) ? "Next week" : `${formatted} - ${formatted}` });
    identified.push("timeline");
  } else if (explicitDates?.length) {
    const valid = explicitDates.every(value => {
      const [day, month, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    });
    const dateValue = value => {const [day,month,year]=value.split('/').map(Number);return new Date(year,month-1,day).getTime();};
    if (valid && (explicitDates.length<2 || dateValue(explicitDates[0])<=dateValue(explicitDates[1]))) {
      Object.assign(data, { isAsap: false, serviceDates: `${explicitDates[0]} - ${explicitDates[1] || explicitDates[0]}` });
      identified.push("timeline");
    }
  } else if (/\b(?:no deadline|dates? (?:is |are )?flexible|timing (?:is )?flexible)\b/i.test(text)) {
    Object.assign(data, { isAsap: false, serviceDates: "" });
    identified.push("timeline");
  }
  return { data, identified };
}

export function getMissingQuestions(data, answered = []) {
  return REQUIREMENT_QUESTIONS.map((question, index) => ({ question, index })).filter(({ question }) => {
    if (answered.includes(question.id)) return false;
    switch (question.id) {
      case "services": return !data.selectedServices?.length;
      case "ports": return !data.selectedPorts?.length;
      case "scopeOfWork": return !data.scopeOfWork?.trim();
      case "timeline": return !data.isAsap && !data.serviceDates?.trim();
      case "budget": return !((data.minBudget !== "" && data.minBudget != null) &&
        (data.maxBudget !== "" && data.maxBudget != null) && Number.isFinite(Number(data.minBudget)) &&
        Number.isFinite(Number(data.maxBudget)) && Number(data.minBudget) >= 0 && Number(data.maxBudget) >= Number(data.minBudget));
      default: return false;
    }
  }).map(({ index }) => index);
}
