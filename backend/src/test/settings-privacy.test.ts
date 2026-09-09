import {afterAll,describe,it,expect} from 'bun:test';
import {repoUpsertOne} from '@/modules/siteSettings/repository';
import {getTestApp,closeTestApp} from './setup';
afterAll(closeTestApp);
describe('Public settings boundary',()=>{
 it('denies private and unknown keys through list, direct, prefix and key_in without hiding public prices',async()=>{
  const app=await getTestApp();await repoUpsertOne('smtp_password','*','isolated-private-value');await repoUpsertOne('integration.paytr.merchant_key','*','isolated-private-value');await repoUpsertOne('unknown_private_config','*',{credential:'isolated-private-value'});
  for(const url of ['/api/site_settings/smtp_password?locale=*','/api/site_settings/merchant_key?prefix=integration.paytr.&locale=*','/api/site_settings/unknown_private_config?locale=*'])expect((await app.inject({method:'GET',url})).statusCode).toBe(404);
  for(const url of ['/api/site_settings?locale=*','/api/site_settings?prefix=smtp_&locale=*','/api/site_settings?key_in=smtp_password,integration.paytr.merchant_key&locale=*'])expect((await app.inject({method:'GET',url})).body).not.toContain('isolated-private-value');
  expect((await app.inject({method:'GET',url:'/api/site_settings/pricing.listing_credit_price'})).statusCode).toBe(200);
 });
});
