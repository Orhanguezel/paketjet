import {and,or,like,sql,type SQL} from 'drizzle-orm';
import {ilanlar} from './schema';
/** A selected province like "İzmir, Türkiye" must still find older city-only listings. */
export function locationFilter(side:'from'|'to',query:string):SQL{
 const terms=query.split(',').map(s=>s.trim()).filter(s=>s&&!['türkiye','turkey','turkiye'].includes(s.toLocaleLowerCase('tr-TR'))).slice(0,12);
 return and(...(terms.length?terms:[query]).map(term=>{const match=`%${term.replace(/[\\%_]/g,'\\$&')}%`;return or(like(ilanlar[`${side}_city`],match),like(ilanlar[`${side}_district`],match),sql`JSON_UNQUOTE(JSON_EXTRACT(${ilanlar[`${side}_location`]}, '$.label')) LIKE ${match}`)!;}))!;
}
