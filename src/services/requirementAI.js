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
        // Match against available services
        const matched = REQUIREMENT_QUESTIONS.find(q => q.id === "services").options.filter(s =>
          inputStr.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(inputStr.toLowerCase())
        );
        updated.selectedServices = matched.length > 0 ? matched : [inputStr];
      }
      break;

    case "ports":
      if (Array.isArray(userInput)) {
        updated.selectedPorts = userInput;
      } else if (inputStr) {
        // Match against available ports
        const matched = REQUIREMENT_QUESTIONS.find(q => q.id === "ports").options.filter(p =>
          inputStr.toLowerCase().includes(p.toLowerCase().replace(/\s*\(.*?\)/, ""))
        );
        updated.selectedPorts = matched.length > 0 ? matched : [inputStr];
      }
      break;

    case "budget":
      if (typeof userInput === "object" && userInput !== null) {
        if (userInput.currency) updated.currency = userInput.currency;
        if (userInput.minBudget !== undefined) updated.minBudget = userInput.minBudget;
        if (userInput.maxBudget !== undefined) updated.maxBudget = userInput.maxBudget;
      } else if (inputStr) {
        // Parse currency and numbers from text like "5000 - 8000 USD" or "$5000"
        let curr = "USD";
        if (inputStr.includes("₹") || /inr|rupee/i.test(inputStr)) curr = "INR";
        else if (inputStr.includes("€") || /eur|euro/i.test(inputStr)) curr = "EUR";
        else if (inputStr.includes("£") || /gbp|pound/i.test(inputStr)) curr = "GBP";
        else if (/aed|dirham/i.test(inputStr)) curr = "AED";

        const numbers = inputStr.match(/\d+(?:[.,]\d+)?/g) || [];
        updated.currency = curr;
        if (numbers.length >= 2) {
          updated.minBudget = numbers[0];
          updated.maxBudget = numbers[1];
        } else if (numbers.length === 1) {
          updated.minBudget = numbers[0];
          updated.maxBudget = numbers[0];
        }
      }
      break;

    case "timeline":
      if (typeof userInput === "object" && userInput !== null) {
        if (userInput.isAsap !== undefined) updated.isAsap = userInput.isAsap;
        if (userInput.serviceDates) updated.serviceDates = userInput.serviceDates;
      } else if (inputStr) {
        if (/asap|urgent|immediate/i.test(inputStr)) {
          updated.isAsap = true;
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
