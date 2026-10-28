export const FRENCH_REQUIREMENT = {
  id:'demo-requirement-marseille-fr',postIdCode:'#FR-MRS-2026',
  vendorName:'Atlantique Services Maritimes',vendorAvatar:'AM',isVerified:true,
  ownerId:'demo-maritime-fr',timeAgo:'28 oct. 2026',createdAt:'2026-10-28T08:00:00.000Z',
  title:'Livraison de 80 tonnes d’eau potable au port de Marseille-Fos',
  scopeOfWork:'Livraison de 80 tonnes d’eau potable au port de Marseille-Fos.\n\nNous recherchons un fournisseur pour ravitailler le navire Belle Étoile le 30 octobre 2026, entre 8 h et 14 h. Livraison à quai par camion-citerne ou par barge, avec certificat de potabilité et relevé des quantités livrées.\n\nMerci de préciser les modalités de livraison, le délai de mobilisation et le coût total dans votre devis. Budget prévu : de 2 000 à 3 000 euros, livraison comprise.',
  sourceLanguage:'fr',ports:['Marseille-Fos'],services:['Approvisionnement en eau potable'],
  budget:'2 000 – 3 000 €',dateRange:'30 octobre 2026 · 8 h – 14 h',isUrgent:false,
  viewsCount:0,attachments:[],status:'Live'
};
const normalize=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/&#x20;|&nbsp;/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const retired=normalize('I want a 40 litre empty water freshwater or Mumbai port with 40000 budget');
export function cleanRequirementSamples(posts=[]) {
  const removedIds=[];
  const kept=posts.filter(post=>{
    const remove=[post.title,post.scopeOfWork,post.details,post.scopeHtml?.replace(/<[^>]*>/g,' ')].some(value=>normalize(value).replace(/ post$/,'')===retired);
    if(remove)removedIds.push(post.id);
    return !remove;
  });
  return {posts:kept.some(post=>post.id===FRENCH_REQUIREMENT.id)?kept:[FRENCH_REQUIREMENT,...kept],removedIds};
}
