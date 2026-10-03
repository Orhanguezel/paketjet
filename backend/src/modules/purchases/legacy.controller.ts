// src/modules/purchases/legacy.controller.ts
// Eski cuzdan/rezervasyon modelinin ve iptal edilen iyzico/PayTR akislarinin tum giris noktalari kapali.
import type { FastifyReply, FastifyRequest } from 'fastify';
export async function retiredOperation(_req: FastifyRequest, reply: FastifyReply) {
  return reply.code(410).send({error: {message: 'legacy_flow_retired'}, next: '/api/ilan-alma-hakki'});
}
