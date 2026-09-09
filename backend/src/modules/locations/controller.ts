import type {FastifyReply,FastifyRequest} from 'fastify';
import {handleRouteError} from '../_shared/http';
import {locationSearchSchema} from './validation';
import {searchLocations} from './service';
export async function getLocations(req:FastifyRequest,reply:FastifyReply){try{const {q}=locationSearchSchema.parse(req.query);return reply.header('Cache-Control','private, max-age=300').send({data:await searchLocations(q)});}catch(error){if((error as {statusCode?:number}).statusCode===429)return reply.code(429).send({error:{message:'location_busy'}});return handleRouteError(reply,req,error,'locations_failed');}}
