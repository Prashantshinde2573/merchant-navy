export const PROTOTYPE_ONLY = true;
export const DEMO_AGENT_VERSION = 'ui-prototype-1';
export const DEMO_SCOPE = 'Supply 150 MT of fresh water to MV Indravati at Mumbai port.\nBudget INR 40,000. Required 15 November 2026.';
export const DEMO_SCOPES={
 en:DEMO_SCOPE,
 hi:'मुंबई बंदरगाह पर एमवी इंद्रावती को 150 मीट्रिक टन ताजा पानी की आपूर्ति करें।\nबजट 40,000 भारतीय रुपये। आवश्यकता की तिथि 15 नवंबर 2026।',
 mr:'मुंबई बंदरात एमव्ही इंद्रावतीला 150 मेट्रिक टन गोड्या पाण्याचा पुरवठा करा.\nअंदाजपत्रक 40,000 भारतीय रुपये. आवश्यक तारीख 15 नोव्हेंबर 2026.',
 es:'Suministrar 150 toneladas de agua dulce al MV Indravati en el puerto de Mumbai.\nPresupuesto: 40.000 INR. Fecha requerida: 15 de noviembre de 2026.',
 fr:'Fournir 150 tonnes d’eau douce au MV Indravati dans le port de Mumbai.\nBudget : 40 000 INR. Date souhaitée : 15 novembre 2026.',
 de:'150 Tonnen Frischwasser für die MV Indravati im Hafen Mumbai liefern.\nBudget: 40.000 INR. Benötigt am 15. November 2026.'
};
export async function demoTranslate(text,source,target,{signal}={}) {
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 if(source===target)return text;
 if(Object.values(DEMO_SCOPES).includes(text)&&DEMO_SCOPES[target])return DEMO_SCOPES[target];
 for(const value of Object.values(DEMO_SCOPES)){
  const index=value.split('\n').indexOf(text);
  if(index>=0&&DEMO_SCOPES[target])return DEMO_SCOPES[target].split('\n')[index];
 }
 const phrases={
  'Sample scope of work':{en:'Sample scope of work',hi:'कार्य का नमूना विवरण',mr:'कामाचा नमुना तपशील',es:'Ejemplo del alcance del trabajo',fr:'Exemple de description des travaux',de:'Beispiel einer Leistungsbeschreibung'},
  'Need fresh water in Mumbai.':{en:'Need fresh water in Mumbai.',hi:'मुंबई में ताजा पानी चाहिए।',mr:'मुंबईत गोडे पाणी हवे आहे.'}
 };
 for(const values of Object.values(phrases))if(Object.values(values).includes(text)&&values[target])return values[target];
 throw new Error('No local translation fixture for this content');
}
export const DEMO_PORTS=[{name:'Mumbai',code:'INBOM'},{name:'Chennai',code:'INMAA'},{name:'Visakhapatnam',code:'INVTZ'},{name:'Cochin',code:'INCOK'},{name:'Singapore',code:'SGSIN'},{name:'Rotterdam',code:'NLRTM'}];
export const DEMO_POST={id:'prototype-requirement',scopeOfWork:DEMO_SCOPE,sourceLanguage:'en',services:['Fresh Water Supply'],ports:['Mumbai'],budget:'INR 40,000',date:'15 Nov 2026'};
