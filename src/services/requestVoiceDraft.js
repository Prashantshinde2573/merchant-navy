import { extractRequirement } from './requirementAI.js';
import { requirementCurrencyHint } from './requirementLanguages.js';
import { translateRequirementText } from './requirementTranslation.js';

/** Only identified fields are merged; unanswered/manual fields remain untouched. */
export async function buildRequestVoiceDraft(transcript, language, initialData, {signal, translate = translateRequirementText} = {}) {
  if (!transcript.trim()) return {...initialData};
  const english = language === 'en' ? transcript : await translate(transcript, language, 'en', {signal});
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const extracted = extractRequirement(english, initialData);
  const manualScope = initialData.scopeOfWork?.trim() || '';
  extracted.data.scopeOfWork = [manualScope, transcript.trim()].filter(Boolean).join('\n\n');
  const currency = requirementCurrencyHint(transcript);
  if (currency && extracted.identified.includes('budget')) extracted.data.currency = currency;
  return extracted.data;
}
