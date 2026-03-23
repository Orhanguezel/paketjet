export { registerSupport } from './router';
export { registerSupportAdmin } from './admin.routes';
export { supportFaqs, supportFaqsI18n, supportTickets } from './schema';
export type {
  SupportFaq,
  SupportFaqI18n,
  SupportTicket,
  NewSupportFaq,
  NewSupportFaqI18n,
  NewSupportTicket,
} from './schema';
export {
  faqListQuerySchema,
  faqCreateSchema,
  faqUpdateSchema,
  faqReorderSchema,
  ticketCreateSchema,
  ticketListQuerySchema,
  ticketUpdateSchema,
} from './validation';
export {
  repoListFaqs,
  repoGetFaqById,
  repoCreateFaq,
  repoUpdateFaq,
  repoDeleteFaq,
  repoReorderFaqs,
  repoListTickets,
  repoGetTicketById,
  repoCreateTicket,
  repoUpdateTicket,
  repoDeleteTicket,
  repoListMyTickets,
} from './repository';
