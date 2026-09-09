/** SQL DATETIME is UTC; display explicitly in the product's Istanbul timezone. */
export function parseApiDate(value: string) {
  const normalized=value.replace(' ','T');
  return new Date(/(?:Z|[+-]\d\d:\d\d)$/i.test(normalized)?normalized:`${normalized}Z`);
}
export function formatDate(value:string,options:Intl.DateTimeFormatOptions={day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) {
  const date=parseApiDate(value);
  return Number.isNaN(date.getTime())?'Tarih belirtilmedi':new Intl.DateTimeFormat('tr-TR',{...options,timeZone:'Europe/Istanbul'}).format(date);
}
