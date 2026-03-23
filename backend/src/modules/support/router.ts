import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { createTicket, listFaqs, myTickets } from './controller';

export async function registerSupport(app: FastifyInstance) {
  const B = '/support';
  app.get(`${B}/faqs`, listFaqs);
  app.post(`${B}/tickets`, createTicket);
  app.get(`${B}/tickets/my`, { onRequest: [requireAuth] }, myTickets);
}
