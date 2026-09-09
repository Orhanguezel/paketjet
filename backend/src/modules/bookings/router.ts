import type {FastifyInstance} from 'fastify';
import {requireAuth} from '@/common/middleware/auth';
import {retiredOperation} from '../purchases/legacy.controller';
import {listMyBookings,getBooking} from './controller';
export async function registerBookings(app:FastifyInstance){
 const auth={preHandler:[requireAuth]};
 app.get('/bookings',auth,listMyBookings);
 app.get('/bookings/:id',auth,getBooking);
 app.post('/bookings',auth,retiredOperation);
 app.get('/bookings/bank-details',auth,retiredOperation);
 app.patch('/bookings/:id/confirm',auth,retiredOperation);
 app.patch('/bookings/:id/status',auth,retiredOperation);
 app.patch('/bookings/:id/confirm-delivery',auth,retiredOperation);
 app.patch('/bookings/:id/cancel',auth,retiredOperation);
}
