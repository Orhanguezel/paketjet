import type { RouteHandler } from 'fastify';
import { getAuthUserId, handleRouteError } from '../_shared';
import { repoLegacyTransactions, repoLegacyWallet } from './archive.repository';
export const getMyWallet:RouteHandler=async(req,reply)=>{
  try{return reply.send(await repoLegacyWallet(getAuthUserId(req)));}
  catch(error){return handleRouteError(reply,req,error,'wallet_archive');}
};
export const listMyTransactions:RouteHandler=async(req,reply)=>{
  try{const q=req.query as {page?:string;limit?:string};const page=Math.max(1,Number(q.page)||1),limit=Math.min(100,Math.max(1,Number(q.limit)||20));return reply.send(await repoLegacyTransactions(getAuthUserId(req),page,limit));}
  catch(error){return handleRouteError(reply,req,error,'wallet_archive_transactions');}
};
