import type {FastifyInstance} from 'fastify';
import {getLocations} from './controller';
export async function registerLocations(app:FastifyInstance){app.get('/locations/search',{config:{rateLimit:{max:30,timeWindow:'1 minute'}}},getLocations);}
