export function requestReviewError(aiAssisted,reviewAccepted) {
  return aiAssisted && !reviewAccepted ? 'Please review the AI-generated details and check the acknowledgment before publishing.' : '';
}
