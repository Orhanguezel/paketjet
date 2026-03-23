import type { FastifyInstance } from 'fastify';
import {
  adminCreateFaq,
  adminDeleteFaq,
  adminDeleteTicket,
  adminGetTicket,
  adminListFaqs,
  adminListTickets,
  adminReorderFaqs,
  adminUpdateFaq,
  adminUpdateTicket,
} from './admin.controller';

export async function registerSupportAdmin(app: FastifyInstance) {
  const B = '/support';
  app.get(`${B}/faqs`, adminListFaqs);
  app.post(`${B}/faqs`, adminCreateFaq);
  app.patch(`${B}/faqs/:id`, adminUpdateFaq);
  app.delete(`${B}/faqs/:id`, adminDeleteFaq);
  app.post(`${B}/faqs/reorder`, adminReorderFaqs);
  app.get(`${B}/tickets`, adminListTickets);
  app.get(`${B}/tickets/:id`, adminGetTicket);
  app.patch(`${B}/tickets/:id`, adminUpdateTicket);
  app.delete(`${B}/tickets/:id`, adminDeleteTicket);
}
