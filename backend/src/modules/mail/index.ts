// src/modules/mail/index.ts
// External module surface for mail. Keep explicit; no export *.

export { registerMail } from './router';

export {
  sendMailHandler,
  sendTestMail,
} from './controller';

export {
  getAuthUserEmail,
  resolveTestMailRecipient,
  SITE_NAME,
  buildMailTransportSignature,
  buildMailFromAddress,
  createMailTransportConfig,
  escapeMailHtml,
  wrapMailBody,
  formatMailPrice,
  sendMailWithTransport,
  welcomeMailSchema,
  passwordChangedSchema,
  buildBookingRouteLabel,
  buildCarrierPaymentSubject,
} from './helpers';
export type {
  WelcomeMailInput,
  PasswordChangedMailInput,
} from './helpers';

export {
  sendMailRaw,
  sendWelcomeMail,
  sendPasswordChangedMail,
  sendBookingCreatedMail,
  sendBookingConfirmedMail,
  sendBookingInTransitMail,
  sendBookingDeliveredMail,
  sendBookingCancelledMail,
  sendCarrierPaymentMail,
} from './service';

export {
  sendMailSchema,
} from './validation';
export type {
  SendMailInput,
  BookingMailInput,
  WalletMailInput,
} from './validation';
