export type PaymentDraft = {
  note: string;
  transactionId: string;
  rejectReason: string;
  bankConfirmed: boolean;
  refundNote: string;
  refundConfirmed: boolean;
  actionFeedback: string;
  noteFeedback: string;
};

export const emptyPaymentDraft: PaymentDraft = {
  note: "",
  transactionId: "",
  rejectReason: "",
  bankConfirmed: false,
  refundNote: "",
  refundConfirmed: false,
  actionFeedback: "",
  noteFeedback: "",
};
