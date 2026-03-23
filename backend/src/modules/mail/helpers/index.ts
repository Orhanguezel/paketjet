// src/modules/mail/helpers/index.ts
// Local helper barrel for mail module. Keep explicit; no export *.

export {
  getAuthUserEmail,
  resolveTestMailRecipient,
} from "./controller";

export {
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
} from "./service";
export type {
  WelcomeMailInput,
  PasswordChangedMailInput,
} from "./service";
