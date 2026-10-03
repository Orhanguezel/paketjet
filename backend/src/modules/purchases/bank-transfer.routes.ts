import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@/common/middleware/auth';
import { approveBankTransfer, createBankCreditOrder, createBankListingOrder, getBankAvailability, getBankOrder, rejectBankTransfer, reportBankTransfer } from './bank-transfer.controller';

const auth = { preHandler: [requireAuth], config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };
export async function registerBankTransfer(app: FastifyInstance) {
  app.get('/payments/bank-transfer/availability', auth, getBankAvailability);
  app.get('/payments/bank-transfer/:ref', auth, getBankOrder);
  app.post('/payments/bank-transfer/:ref/report', auth, reportBankTransfer);
  app.post('/ilan-alma-hakki/satin-al/bank-transfer', auth, createBankCreditOrder);
  app.post('/ilanlar/:id/satin-al/bank-transfer', auth, createBankListingOrder);
}
export async function registerBankTransferAdmin(app: FastifyInstance) {
  app.post('/payment-operations/:ref/bank-approve', approveBankTransfer);
  app.post('/payment-operations/:ref/bank-reject', rejectBankTransfer);
}
