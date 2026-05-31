import { z } from "zod";

export const disputeIssueTypes = ["damage", "loss", "forbidden_content", "payment", "other"] as const;

export const openDisputeSchema = z.object({
  reason: z.string().min(10, "Sebep en az 10 karakter olmalıdır").max(2000),
  issue_type: z.enum(disputeIssueTypes).optional().default("other"),
});

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(5).max(2000),
  status: z.enum(["resolved", "closed"]).default("resolved"),
});

export type DisputeIssueType = (typeof disputeIssueTypes)[number];
