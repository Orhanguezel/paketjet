import type {FastifyRequest,FastifyReply} from 'fastify';
import {handleRouteError,sendNotFound} from '@/modules/_shared';
import {parseAdminIlanListParams} from './helpers';
import {updateIlanStatusSchema} from './validation';
import {repoGetIlanById,repoUpdateIlanStatus,repoDeleteIlan} from './repository';
import {repoAdminListIlans,repoAdminListingHistory} from './admin.repository';
export async function adminListIlans(req:FastifyRequest,reply:FastifyReply){
 try{const params=parseAdminIlanListParams(req.query as Record<string,string>);const result=await repoAdminListIlans(params);return reply.send({...result,page:params.page,limit:params.limit});}
 catch(e){return handleRouteError(reply,req,e,'admin_ilan_list');}
}
export async function adminGetIlan(req:FastifyRequest,reply:FastifyReply){
 try{const row=await repoGetIlanById((req.params as {id:string}).id);return row?reply.send(row):sendNotFound(reply);}
 catch(e){return handleRouteError(reply,req,e,'admin_ilan_get');}
}
export async function adminUpdateIlanStatus(req:FastifyRequest,reply:FastifyReply){
 try{const {id}=req.params as {id:string};const {status}=updateIlanStatusSchema.parse(req.body);return reply.send(await repoUpdateIlanStatus(id,status,true,(req.user as {sub:string}).sub));}
 catch(e){return handleRouteError(reply,req,e,'admin_ilan_status');}
}
export async function adminDeleteIlan(req:FastifyRequest,reply:FastifyReply){
 try{await repoDeleteIlan((req.params as {id:string}).id);return reply.send({ok:true});}
 catch(e){return handleRouteError(reply,req,e,'admin_ilan_delete');}
}
export async function adminListingHistory(req:FastifyRequest,reply:FastifyReply){
 try{return reply.send(await repoAdminListingHistory((req.params as {id:string}).id));}
 catch(e){return handleRouteError(reply,req,e,'admin_listing_history');}
}
