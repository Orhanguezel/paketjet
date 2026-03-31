// src/modules/carrier-kyc/admin.controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError, sendNotFound, parsePage } from "@/modules/_shared";
import { adminReviewSchema } from "./validation";
import {
  repoAdminListPendingDocuments,
  repoAdminGetCarrierKyc,
  repoGetDocumentById,
  repoReviewDocument,
  repoSyncKycStatus,
  repoSetIyzicoSubMerchant,
} from "./repository";
import { createUserNotification } from "../notifications/service";

/** GET /admin/kyc */
export const adminListKyc: RouteHandler = async (req, reply) => {
  try {
    const q = req.query as Record<string, string>;
    const { limit, offset, page } = parsePage(q);
    const result = await repoAdminListPendingDocuments({ status: q.status, limit, offset });
    reply.header("x-total-count", String(result.total));
    return reply.send({ data: result.data, total: result.total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_kyc_list");
  }
};

/** GET /admin/kyc/carrier/:id */
export const adminGetCarrierKyc: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const result = await repoAdminGetCarrierKyc(id);
    if (!result) return sendNotFound(reply);
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_kyc_carrier");
  }
};

/** PUT /admin/kyc/:id/review */
export const adminReviewDocument: RouteHandler = async (req, reply) => {
  try {
    const adminId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const { status, admin_note } = adminReviewSchema.parse(req.body);

    if (status === "rejected" && !admin_note) {
      return reply.code(400).send({ error: { message: "rejection_note_required" } });
    }

    const doc = await repoGetDocumentById(id);
    if (!doc) return sendNotFound(reply);

    const updated = await repoReviewDocument(id, adminId, status, admin_note);
    const kycStatus = await repoSyncKycStatus(doc.carrier_id);

    // KYC durum bildirimi
    if (kycStatus === "approved") {
      void createUserNotification({
        userId: doc.carrier_id,
        title: "KYC Doğrulamanız Onaylandı",
        message: "Kimlik doğrulamanız onaylandı. Artık ilan açabilirsiniz.",
        type: "info",
      }).catch(() => {});
    } else if (kycStatus === "rejected") {
      void createUserNotification({
        userId: doc.carrier_id,
        title: "KYC Doğrulamanız Reddedildi",
        message: `Belgeniz reddedildi: ${admin_note ?? "Lütfen belgeleri kontrol edip tekrar yükleyin."}`,
        type: "warning",
      }).catch(() => {});
    }

    return reply.send({ document: updated, kyc_status: kycStatus });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_kyc_review");
  }
};

/** POST /admin/kyc/carrier/:id/create-sub-merchant */
export const adminCreateSubMerchant: RouteHandler = async (req, reply) => {
  try {
    const { id } = req.params as { id: string };
    const carrier = await repoAdminGetCarrierKyc(id);
    if (!carrier) return sendNotFound(reply);

    if (carrier.kyc_status !== "approved") {
      return reply.code(400).send({ error: { message: "kyc_not_approved" } });
    }

    if (carrier.iyzico_sub_merchant_key) {
      return reply.code(400).send({ error: { message: "sub_merchant_already_exists" } });
    }

    // Zorunlu alan kontrolleri
    if (!carrier.tc_identity) return reply.code(400).send({ error: { message: "tc_identity_required" } });
    if (!carrier.phone) return reply.code(400).send({ error: { message: "phone_required" } });

    // IBAN: carrier-bank modülünden al
    const { repoGetBankByUserId } = await import("@/modules/carrier-bank/repository");
    const bank = await repoGetBankByUserId(id);
    if (!bank?.iban) return reply.code(400).send({ error: { message: "iban_required" } });

    const subMerchantType = carrier.tax_number ? "LIMITED_OR_JOINT_STOCK_COMPANY" as const : "PERSONAL" as const;
    const nameParts = (carrier.full_name ?? "").split(" ");
    const contactName = nameParts[0] || "Ad";
    const contactSurname = nameParts.slice(1).join(" ") || "Soyad";

    const { createSubMerchant } = await import("@/modules/wallet/iyzico");
    const result = await createSubMerchant({
      subMerchantExternalId: id,
      subMerchantType,
      name: carrier.legal_company_title || carrier.full_name || carrier.email,
      email: carrier.email,
      gsmNumber: carrier.phone.replace(/\s/g, ""),
      address: "Türkiye",
      contactName,
      contactSurname,
      iban: bank.iban,
      identityNumber: carrier.tc_identity,
      taxOffice: carrier.tax_office ?? undefined,
      taxNumber: carrier.tax_number ?? undefined,
      legalCompanyTitle: carrier.legal_company_title ?? undefined,
      currency: "TRY",
    });

    if (result.status !== "success" || !result.subMerchantKey) {
      return reply.code(400).send({
        error: { message: "iyzico_sub_merchant_failed", detail: result.errorMessage ?? result.errorCode },
      });
    }

    await repoSetIyzicoSubMerchant(id, result.subMerchantKey, subMerchantType);

    return reply.send({ sub_merchant_key: result.subMerchantKey, type: subMerchantType });
  } catch (e) {
    return handleRouteError(reply, req, e, "admin_kyc_sub_merchant");
  }
};
