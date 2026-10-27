import {createRequirementNarrator,requirementGreeting} from './requirementNarration.js';
import {requirementCopy} from './requirementLanguages.js';
import {startRequirementSpeech} from './requirementSpeech.js';

/** The recognizer is created only after successful completion of the full opening. */
export function startRequirementVoiceOpening({language='en', now=()=>new Date(), synthesis, Utterance, recognitionFactory=startRequirementSpeech, narratorFactory=createRequirementNarrator, ...speechOptions}) {
  let active=true;
  let listening=null;
  const narrator=narratorFactory({synthesis,Utterance,
    onState:state=>{if(active){if(['starting','speaking'].includes(state))speechOptions.onState('speaking');else if(state==='idle')speechOptions.onState('idle');}},
    onError:message=>{if(active&&message){active=false;speechOptions.onState('error');speechOptions.onError('Couldn’t play the opening. Tap to try again or switch to Chat.');}}
  });
  // One utterance keeps the same voice and pacing; sentence punctuation supplies
  // a natural short pause without delaying a mobile tap behind a timer.
  const opening=`${requirementGreeting(now(),language)}. ${requirementCopy('Please describe your requirements.',language)}`;
  narrator.speak(opening,{locale:speechOptions.locale,userInitiated:true,onComplete:()=>{
    if(!active)return;
    listening=recognitionFactory({...speechOptions,
      onText:value=>{if(active)speechOptions.onText(value);},
      onState:state=>{if(active)speechOptions.onState(state);},
      onError:message=>{if(active)speechOptions.onError(message);},
      onFinish:()=>{if(active)speechOptions.onFinish();}
    });
  }});
  return {
    stop(){if(!active)return;if(listening)listening.stop();else{active=false;narrator.stop();speechOptions.onState('idle');}},
    cancel(){active=false;narrator.stop();listening?.cancel();}
  };
}
