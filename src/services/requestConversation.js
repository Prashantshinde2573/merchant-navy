import {buildRequestVoiceDraft} from './requestVoiceDraft.js';
import {getMissingQuestions,REQUIREMENT_QUESTIONS} from './requirementAI.js';
const QUESTIONS = ['What service do you need?','Which port is this for?','What work needs to be done?','When do you need it?','What’s your budget?'];
export async function requestConversationTurn(transcript, language, initialData, options) {
  const draft = await buildRequestVoiceDraft(transcript,language,initialData,options);
  const next = getMissingQuestions(draft,draft.aiAnswered)[0];
  return {draft, field:next===undefined?null:REQUIREMENT_QUESTIONS[next].id, question:next===undefined ? 'Your request is ready to review.' : QUESTIONS[next]};
}
